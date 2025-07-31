import React, { useState } from 'react';
import { Linkedin, Youtube, Mail, MapPin, MessageCircle, X } from 'lucide-react';
import PDFViewerModal from './PDFViewerModal';

const Footer = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const openChatbot = () => {
    setIsChatbotOpen(true);
    setSelectedQuestion(null);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setSelectedQuestion(null);
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
  };

  const getAnswer = (question: string) => {
    const answers: { [key: string]: string } = {
      'How does the posture monitoring work?': 'Flexora uses advanced sensors embedded in the chair to detect your sitting position. When it detects poor posture, it gently alerts you through subtle vibrations and LED indicators. The system learns your habits and provides personalized recommendations for better ergonomics.',
      'What\'s the warranty coverage?': 'Flexora comes with a comprehensive 2-year warranty covering all parts and labor. This includes the smart technology components, mechanical parts, and upholstery. We also offer extended warranty options for additional peace of mind.',
      'How long does shipping take?': 'Standard shipping takes 5-7 business days within India. We also offer expedited shipping options (2-3 days) and white-glove delivery service for professional installation. International shipping is available to select countries.',
      'Can I customize the chair?': 'Absolutely! Flexora offers multiple color options including classic black, modern gray, and premium leather finishes. You can also choose from different fabric types and cushion densities to match your office aesthetic and comfort preferences.'
    };
    return answers[question] || 'For this specific question, please contact us directly at flexora41@gmail.com and our team will be happy to assist you.';
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              Flex<span className="text-cyan-400">ora</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Revolutionizing the way you sit, work, and live with intelligent ergonomic solutions designed for the modern digital lifestyle.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@natashaaggarwal03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/natashaaggarwal03/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#audience" className="text-gray-300 hover:text-cyan-400 transition-colors">Designed for Whom?</a></li>
              <li><a href="#innovation" className="text-gray-300 hover:text-cyan-400 transition-colors">Innovations</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-cyan-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><button onClick={openChatbot} className="text-gray-300 hover:text-cyan-400 transition-colors">Help Center</button></li>
              <li><a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="text-cyan-400" size={16} />
                <span className="text-gray-300">flexora41@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-cyan-400" size={16} />
                <span className="text-gray-300">Jaipur Resdencies, Jagatpura, Jaipur<br />Rajasthan, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Flexora. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button 
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setIsTermsModalOpen(true)}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={closeChatbot}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading text-gray-900 mb-2">Flexora Support</h3>
              <p className="text-gray-600 font-body">How can we help you today?</p>
            </div>

            <div className="space-y-4">
              {!selectedQuestion ? (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-subheading text-gray-900 mb-2">Quick Questions</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleQuestionClick('How does the posture monitoring work?')}
                        className="w-full text-left text-sm text-gray-600 hover:text-cyan-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        • How does the posture monitoring work?
                      </button>
                      <button 
                        onClick={() => handleQuestionClick('What\'s the warranty coverage?')}
                        className="w-full text-left text-sm text-gray-600 hover:text-cyan-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        • What's the warranty coverage?
                      </button>
                      <button 
                        onClick={() => handleQuestionClick('How long does shipping take?')}
                        className="w-full text-left text-sm text-gray-600 hover:text-cyan-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        • How long does shipping take?
                      </button>
                      <button 
                        onClick={() => handleQuestionClick('Can I customize the chair?')}
                        className="w-full text-left text-sm text-gray-600 hover:text-cyan-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        • Can I customize the chair?
                      </button>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-xl p-4">
                    <h4 className="font-subheading text-cyan-900 mb-2">Need More Help?</h4>
                    <p className="text-sm text-cyan-700 mb-3">Our team is here to assist you with any questions about Flexora.</p>
                    <a 
                      href="#contact" 
                      onClick={closeChatbot}
                      className="inline-flex items-center bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-subheading hover:bg-cyan-500 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-subheading text-gray-900">Answer</h4>
                      <button 
                        onClick={() => setSelectedQuestion(null)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        ← Back to Questions
                      </button>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-subheading text-gray-900 mb-2">{selectedQuestion}</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">{getAnswer(selectedQuestion)}</p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-xl p-4">
                    <h4 className="font-subheading text-cyan-900 mb-2">Still Need Help?</h4>
                    <p className="text-sm text-cyan-700 mb-3">If you have more questions, please contact us at flexora41@gmail.com</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedQuestion(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-subheading hover:bg-gray-500 transition-colors"
                      >
                        Ask Another Question
                      </button>
                      <a 
                        href="mailto:flexora41@gmail.com"
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-subheading hover:bg-cyan-500 transition-colors"
                      >
                        Email Us
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy PDF Modal */}
      <PDFViewerModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pdfPath="/Flexora Privacy Policy.pdf"
        title="Privacy Policy"
      />

      {/* Terms of Service PDF Modal */}
      <PDFViewerModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        pdfPath="/Flexora Terms of Policy.pdf"
        title="Terms of Service"
      />
    </footer>
  );
};

export default Footer;