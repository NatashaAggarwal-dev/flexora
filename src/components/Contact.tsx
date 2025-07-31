import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { submitContactForm } from '../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check for waitlist email on component mount and when component updates
  useEffect(() => {
    const checkForWaitlistEmail = () => {
      const waitlistEmail = localStorage.getItem('waitlistEmail');
      
      if (waitlistEmail) {
        setFormData(prev => ({
          ...prev,
          email: waitlistEmail
        }));
        // Clear the stored email after using it
        localStorage.removeItem('waitlistEmail');
      }
    };

    // Check immediately
    checkForWaitlistEmail();
    
    // Also check after a short delay to handle timing issues
    const timeoutId = setTimeout(checkForWaitlistEmail, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit form data to Supabase
      await submitContactForm(formData);
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // You can add error handling here (show error message to user)
      alert('There was an error submitting your message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "flexora41@gmail.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "Jaipur Resdencies, Jagatpura",
      description: "Jaipur, Rajasthan, India"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Monday - Friday",
      description: "9:00 AM - 6:00 PM IST"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading text-gray-900 mb-6">
            Get in <span className="text-cyan-600">Touch</span>
          </h2>
          <p className="text-lg font-body text-gray-600 max-w-3xl mx-auto">
            Have questions about Flexora? Need support? Want to place a bulk order? 
            We're here to help you find the perfect solution for your workspace.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-heading text-gray-900 mb-6">Send us a Message</h3>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-subheading text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-600 font-body">Thank you for contacting us. We'll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-subheading text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-subheading text-gray-700 mb-2">
                      Email Address *
                      {formData.email && (
                        <span className="ml-2 text-xs text-cyan-600 font-medium">
                          (Pre-filled from waitlist)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          formData.email ? 'border-cyan-300 bg-cyan-50/30' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />

                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-subheading text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-subheading text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-heading text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-600 font-body mb-8 leading-relaxed">
                Our team is here to help you find the perfect Flexora chair for your needs. 
                Whether you have questions about features, need technical support, or want to 
                discuss bulk ordering options, we're ready to assist you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-subheading text-gray-900 mb-1">{info.title}</h4>
                    <p className="text-gray-900 font-body font-medium">{info.details}</p>
                    <p className="text-gray-600 font-body text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
              <h4 className="text-lg font-subheading text-gray-900 mb-3">Why Choose Flexora?</h4>
              <ul className="space-y-2 text-sm font-body text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                  <span>Free shipping on all orders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                  <span>15-day money-back guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                  <span>2-year comprehensive warranty</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                  <span>Expert customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 