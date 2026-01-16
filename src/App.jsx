import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ContactForm from './pages/ContactForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ContactForm />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin to dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              boxShadow: 'var(--shadow-xl)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent-green)',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--accent-red)',
                secondary: 'white',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
