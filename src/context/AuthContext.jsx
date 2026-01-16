import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await authService.getProfile();
                setAdmin(response.admin);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('admin', JSON.stringify(response.admin));
        setAdmin(response.admin);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
