import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Search,
    LogOut,
    Trash2,
    AlertCircle,
    CheckCircle,
    X,
    Phone,
    Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { admin, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, spam: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 10,
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    useEffect(() => {
        fetchMessages();
    }, [filters]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await messageService.getAllMessages(filters);
            setMessages(response.data);
            setStats(response.stats);
            setPagination(response.pagination);
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id, isRead) => {
        try {
            await messageService.markAsRead(id, isRead);
            toast.success(`Message marked as ${isRead ? 'read' : 'unread'}`);
            fetchMessages();
            if (selectedMessage?._id === id) {
                setSelectedMessage({ ...selectedMessage, isRead });
            }
        } catch (error) {
            toast.error('Failed to update message');
        }
    };

    const handleMarkAsSpam = async (id) => {
        try {
            await messageService.markAsSpam(id);
            toast.success('Message marked as spam');
            fetchMessages();
            setSelectedMessage(null);
        } catch (error) {
            toast.error('Failed to mark as spam');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await messageService.deleteMessage(id);
            toast.success('Message deleted successfully');
            fetchMessages();
            setSelectedMessage(null);
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
        toast.success('Logged out successfully');
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value, page: 1 });
    };

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <h1 className="dashboard-title">Admin Dashboard</h1>
                            <p className="dashboard-subtitle">Welcome back, {admin?.name}</p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="container">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <p className="stat-label">Total Messages</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>

                        <div className="stat-card">
                            <p className="stat-label">Unread</p>
                            <p className="stat-value">{stats.unread}</p>
                        </div>

                        <div className="stat-card">
                            <p className="stat-label">Read</p>
                            <p className="stat-value">{stats.read}</p>
                        </div>

                        <div className="stat-card">
                            <p className="stat-label">Spam</p>
                            <p className="stat-value">{stats.spam}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters-section">
                        <div className="filters-row">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="search-input"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>

                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('status', 'all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn ${filters.status === 'unread' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('status', 'unread')}
                                >
                                    Unread
                                </button>
                                <button
                                    className={`filter-btn ${filters.status === 'read' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('status', 'read')}
                                >
                                    Read
                                </button>
                                <button
                                    className={`filter-btn ${filters.status === 'spam' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('status', 'spam')}
                                >
                                    Spam
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Table */}
                    <div className="messages-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner" />
                                <p>Loading messages...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="empty-state">
                                <Mail size={48} style={{ color: '#9e9e9e' }} />
                                <h3>No messages found</h3>
                                <p>There are no messages matching your filters.</p>
                            </div>
                        ) : (
                            <>
                                <table className="messages-table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>From</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map((message) => (
                                            <tr
                                                key={message._id}
                                                className={!message.isRead ? 'unread' : ''}
                                                onClick={() => setSelectedMessage(message)}
                                            >
                                                <td>
                                                    {message.isSpam ? (
                                                        <span className="status-badge spam">Spam</span>
                                                    ) : message.isRead ? (
                                                        <span className="status-badge read">Read</span>
                                                    ) : (
                                                        <span className="status-badge unread">Unread</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="message-name">{message.name}</div>
                                                    <div className="message-email">{message.email}</div>
                                                </td>
                                                <td>
                                                    <div className="message-subject">{message.subject}</div>
                                                    <div className="message-preview">{message.message}</div>
                                                </td>
                                                <td className="message-date">{formatDate(message.createdAt)}</td>
                                                <td>
                                                    <div className="message-actions" onClick={(e) => e.stopPropagation()}>
                                                        {!message.isRead && (
                                                            <button
                                                                className="action-btn"
                                                                onClick={() => handleMarkAsRead(message._id, true)}
                                                                title="Mark as read"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>
                                                        )}
                                                        {!message.isSpam && (
                                                            <button
                                                                className="action-btn"
                                                                onClick={() => handleMarkAsSpam(message._id)}
                                                                title="Mark as spam"
                                                            >
                                                                <AlertCircle size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="action-btn danger"
                                                            onClick={() => handleDelete(message._id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handlePageChange(filters.page - 1)}
                                            disabled={filters.page === 1}
                                        >
                                            Previous
                                        </button>
                                        <span className="pagination-info">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handlePageChange(filters.page + 1)}
                                            disabled={filters.page === pagination.totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="message-modal" onClick={() => setSelectedMessage(null)}>
                    <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedMessage.subject}</h2>
                            <button className="modal-close" onClick={() => setSelectedMessage(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-meta">
                                <div className="meta-item">
                                    <Mail size={16} />
                                    <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                                </div>
                                {selectedMessage.phone && (
                                    <div className="meta-item">
                                        <Phone size={16} />
                                        <strong>Phone:</strong> {selectedMessage.phone}
                                    </div>
                                )}
                                <div className="meta-item">
                                    <Clock size={16} />
                                    <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#757575' }}>Message:</h3>
                            <div className="message-text">{selectedMessage.message}</div>
                        </div>

                        <div className="modal-footer">
                            {!selectedMessage.isRead ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleMarkAsRead(selectedMessage._id, true)}
                                >
                                    <CheckCircle size={18} />
                                    Mark as Read
                                </button>
                            ) : (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleMarkAsRead(selectedMessage._id, false)}
                                >
                                    Mark as Unread
                                </button>
                            )}
                            {!selectedMessage.isSpam && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleMarkAsSpam(selectedMessage._id)}
                                >
                                    <AlertCircle size={18} />
                                    Mark as Spam
                                </button>
                            )}
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(selectedMessage._id)}
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
