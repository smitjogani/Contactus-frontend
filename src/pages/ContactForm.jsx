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
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">
                                    Subject <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="form-input"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">
                                Message <span className="required">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-textarea"
                                placeholder="Tell us more about your inquiry..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="6"
                            />
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
