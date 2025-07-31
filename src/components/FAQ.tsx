import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes Flexora different from other office chairs?",
      answer: "Flexora combines cutting-edge ergonomic design with smart technology. Unlike traditional chairs, it features real-time posture monitoring, temperature-regulating gel seats, built-in LED lighting, and wireless charging capabilities. It's designed to keep you comfortable, healthy, and productive during long work sessions."
    },
    {
      question: "How does the posture monitoring work?",
      answer: "Flexora uses advanced sensors embedded in the chair to detect your sitting position. When it detects poor posture, it gently alerts you through subtle vibrations and LED indicators. The system learns your habits and provides personalized recommendations for better ergonomics."
    },
    {
      question: "Is the wireless charging compatible with all devices?",
      answer: "Yes! Flexora's wireless charging pad supports Qi-compatible devices including iPhones, Samsung phones, and other smartphones. It also includes USB-C and USB-A ports for additional charging options. The charging area is conveniently located in the armrest for easy access."
    },
    {
      question: "What's the warranty on Flexora chairs?",
      answer: "Flexora comes with a comprehensive 2-year warranty covering all parts and labor. This includes the smart technology components, mechanical parts, and upholstery. We also offer extended warranty options for additional peace of mind."
    },
    {
      question: "Can I customize the chair colors and materials?",
      answer: "Absolutely! Flexora offers multiple color options including classic black, modern gray, and premium leather finishes. You can also choose from different fabric types and cushion densities to match your office aesthetic and comfort preferences."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days within the continental US. We also offer expedited shipping options (2-3 days) and white-glove delivery service for professional installation. International shipping is available to select countries."
    },
    {
      question: "Is assembly required?",
      answer: "Flexora comes 95% pre-assembled. You'll only need to attach the base to the seat, which takes about 5 minutes with the included tools. For an additional fee, we offer professional assembly and setup services."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We offer a 15-day money-back guarantee. If you're not completely satisfied with your Flexora chair, you can return it for a full refund. We'll even cover the return shipping costs. Your satisfaction is our top priority."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading text-gray-900 mb-6">
            Frequently Asked <span className="text-cyan-600">Questions</span>
          </h2>
          <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Flexora. Can't find what you're looking for? 
            <a href="#contact" className="text-cyan-600 hover:text-cyan-500 font-subheading ml-1">
              Contact us directly.
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-subheading text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-cyan-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 font-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 font-body mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 