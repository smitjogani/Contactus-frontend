import { useState } from 'react';
import toast from 'react-hot-toast';
import { messageService } from '../services';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Validation functions
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (name.trim().length > 100) {
            return 'Name must not exceed 100 characters';
        }
        // Check for digits
        if (/\d/.test(name)) {
            return 'Name should not contain numbers';
        }
        // Check for special characters (allow only letters, spaces, hyphens, apostrophes)
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            return 'Name should only contain letters, spaces, hyphens, and apostrophes';
        }
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Email is required';
        }
        // Standard email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone.trim()) {
            return ''; // Phone is optional
        }

        // Remove all spaces and hyphens for validation
        const cleanPhone = phone.replace(/[\s-]/g, '');

        // Indian phone number validation: +91 followed by 10 digits
        const indianPhoneRegex = /^\+91[6-9]\d{9}$/;

        if (!indianPhoneRegex.test(cleanPhone)) {
            return 'Please enter a valid Indian phone number (e.g., +91 98765 43210)';
        }

        return '';
    };

    const validateSubject = (subject) => {
        if (!subject.trim()) {
            return 'Subject is required';
        }
        if (subject.trim().length < 3) {
            return 'Subject must be at least 3 characters';
        }
        if (subject.trim().length > 200) {
            return 'Subject must not exceed 200 characters';
        }
        return '';
    };

    const validateMessage = (message) => {
        if (!message.trim()) {
            return 'Message is required';
        }
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        if (message.trim().length > 2000) {
            return 'Message must not exceed 2000 characters';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData({
            ...formData,
            [name]: value,
        });

        // Real-time validation
        let error = '';
        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
            case 'subject':
                error = validateSubject(value);
                break;
            case 'message':
                error = validateMessage(value);
                break;
            default:
                break;
        }

        // Update errors
        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const validateForm = () => {
        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            subject: validateSubject(formData.subject),
            message: validateMessage(formData.message),
        };

        setErrors(newErrors);

        // Check if there are any errors
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateForm()) {
            toast.error('Please fix all validation errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const response = await messageService.submitMessage(formData);
            toast.success(response.message);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setErrors({});

            // Reset submitted state after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-form-page">
            <div className="contact-container">
                <div className="contact-card">
                    <div className="contact-header">
                        <h1 className="contact-title">Contact Us</h1>
                        <p className="contact-subtitle">
                            Have a question or want to work together? We'd love to hear from you.
                        </p>
                    </div>

                    {submitted && (
                        <div className="success-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Message sent successfully! We'll get back to you soon.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="contact-form" noValidate>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Phone Number (Indian)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={`form-input ${errors.phone ? 'error' : ''}`}
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">
                                    Subject <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className={`form-input ${errors.subject ? 'error' : ''}`}
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                                {errors.subject && <span className="error-message">{errors.subject}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">
                                Message <span className="required">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className={`form-textarea ${errors.message ? 'error' : ''}`}
                                placeholder="Tell us more about your inquiry..."
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                style={{ resize: 'none' }}
                            />
                            {errors.message && <span className="error-message">{errors.message}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
