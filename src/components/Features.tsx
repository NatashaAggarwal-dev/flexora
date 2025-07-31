import React, { useState } from 'react';
import { Wifi, Smartphone, Fingerprint, Lightbulb, Zap, Shield, Settings, Brain, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Features = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Adjustable Support",
      description: "Adjustable lumbar and neck support maintain healthy posture and reduce pain during extended sitting sessions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tech Integration",
      description: "Built-in USB and wireless charging ports with rechargeable battery powering all chair functions seamlessly."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Posture Sensors",
      description: "Smart posture sensors detect poor posture and provide alerts to help you maintain correct sitting position."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Productivity Features",
      description: "Foldable writing pad, book stand, leg rest, and timer with soft alerts support focused work or study sessions."
    }
  ];

  const allFeatures = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Ergonomic Comfort",
      description: "Fully cushioned, temperature-adaptive memory foam seat and breathable mesh back keep you comfortable and cool for long hours."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Adjustable Support",
      description: "Adjustable lumbar and neck support maintain healthy posture and reduce pain during extended sitting sessions."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Smart Controls",
      description: "Touchpad control panel on the armrest for easy customization of settings and personalized comfort preferences."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tech Integration",
      description: "Built-in USB and wireless charging ports with rechargeable battery powering all chair functions seamlessly."
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Security",
      description: "Fingerprint-secured drawer provides safe storage for valuables with biometric authentication technology."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Posture Sensors",
      description: "Smart posture sensors detect poor posture and provide alerts to help you maintain correct sitting position."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Productivity Features",
      description: "Foldable writing pad, book stand, leg rest, and timer with soft alerts support focused work or study sessions."
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Connectivity",
      description: "Bluetooth and Wi-Fi capabilities for seamless syncing with smart devices and home automation systems."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Noise Reduction",
      description: "Padded head panels reduce distractions and create a focused environment for better concentration."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Aesthetic Design",
      description: "Sleek matte black and grey color scheme with ambient LED accents for a modern and futuristic appearance."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allFeatures.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allFeatures.length) % allFeatures.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentSlide(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading text-gray-900 mb-6">
            Features & <span className="text-cyan-600">Technology</span>
          </h2>
          <p className="text-lg font-body text-gray-600 max-w-3xl mx-auto">
            Every feature is engineered with precision to enhance your productivity, comfort, and well-being through cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group hover:transform hover:scale-105 shadow-sm"
            >
              <div className="text-cyan-600 mb-4 group-hover:text-cyan-700 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-subheading text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-body">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={openModal}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-subheading text-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Explore All Features
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-heading text-gray-900">All Features</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Slider Content */}
              <div className="relative p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center max-w-2xl">
                    <div className="text-cyan-600 mb-6 flex justify-center">
                      {allFeatures[currentSlide].icon}
                    </div>
                    <h3 className="text-3xl font-heading text-gray-900 mb-4">
                      {allFeatures[currentSlide].title}
                    </h3>
                    <p className="text-lg font-body text-gray-600 leading-relaxed">
                      {allFeatures[currentSlide].description}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <button 
                    onClick={prevSlide}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {allFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-cyan-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={nextSlide}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;