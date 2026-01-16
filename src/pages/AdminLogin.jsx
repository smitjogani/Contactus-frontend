import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success('Login successful!');
            navigate('/admin/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card card-glass animate-scale-in">
                    <div className="login-header">
                        <div className="login-icon">
                            <Shield size={40} />
                        </div>
                        <h1 className="login-title">Admin Portal</h1>
                        <p className="login-subtitle">Sign in to access the dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <Mail size={16} /> Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                <Lock size={16} /> Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner spinner-sm" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="footer-text">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>

                <div className="login-bg-decoration">
                    <div className="decoration-circle decoration-1"></div>
                    <div className="decoration-circle decoration-2"></div>
                    <div className="decoration-circle decoration-3"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
