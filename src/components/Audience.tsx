import React, { useState } from 'react';
import { GraduationCap, Briefcase, Gamepad2 } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

const Audience = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const audiences = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Students",
      subtitle: "Study Smarter, Sit Better",
      description: "Perfect for long study sessions with features that enhance focus and reduce fatigue.",
      benefits: [
        "Posture alerts during marathon study sessions",
        "Built-in LED lighting for late-night reading",
        "Wireless charging keeps devices powered",
        "Noise-reduction for better concentration",
        "Affordable student pricing available"
      ],
      image: "/images/products/students.png"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Office Workers",
      subtitle: "Elevate Your Work Experience",
      description: "Boost productivity with smart features tailored for the modern professional workspace.",
      benefits: [
        "Smart posture monitoring prevents back pain",
        "Touchpad armrest for seamless multitasking",
        "Secure fingerprint drawer for documents",
        "Temperature-regulating gel seat",
        "Professional aesthetic for any office"
      ],
      image: "/images/products/Office workers.png"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Gamers",
      subtitle: "Level Up Your Setup",
      description: "Engineered for extended gaming sessions with performance-focused features.",
      benefits: [
        "Anti-fatigue gel prevents gaming soreness",
        "RGB-compatible LED lighting system",
        "Noise-reducing panels for streaming",
        "Multiple device charging capabilities",
        "Ergonomic design for marathon sessions"
      ],
      image: "/images/products/gamers.png"
    }
  ];

  return (
    <section id="audience" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-gray-900 mb-4 sm:mb-6">
            Who is <span className="text-cyan-600">Flexora</span> For?
          </h2>
          <p className="text-base sm:text-lg font-body text-gray-600 max-w-3xl mx-auto px-4">
            Perfect for anyone who spends long hours at a desk—students, job holders, and gamers. Flexora keeps you comfortable, healthy, and focused.
          </p>
        </div>

        {/* Switcher Navigation - Three Separate Bars */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl">
            {audiences.map((audience, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex flex-col items-center space-y-2 px-4 sm:px-6 lg:px-8 py-4 rounded-2xl transition-all duration-300 font-body border-2 flex-1 ${
                  activeTab === index
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/25 transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-300 hover:text-gray-900 hover:shadow-md'
                }`}
              >
                <div className={`p-2 sm:p-3 rounded-full ${
                  activeTab === index ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {audience.icon}
                </div>
                <span className="font-subheading text-xs sm:text-sm text-center">{audience.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-cyan-600">
                {audiences[activeTab].icon}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-heading text-gray-900">{audiences[activeTab].title}</h3>
                <p className="text-cyan-600 font-subheading text-sm sm:text-base">{audiences[activeTab].subtitle}</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed font-body">
              {audiences[activeTab].description}
            </p>
            
            <ul className="space-y-3 sm:space-y-4">
              {audiences[activeTab].benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 font-body text-sm sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8">
              <AddToCartButton
                item={{
                  id: activeTab + 1,
                  name: `Flexora ${audiences[activeTab].title} Chair`,
                  price: 899,
                  image: audiences[activeTab].image,
                  color: "Classic Black"
                }}
                variant="primary"
                size="md"
                className="flex-1"
              />
              <button className="bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-subheading text-sm sm:text-base hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden relative group">
              <img 
                src={audiences[activeTab].image} 
                alt={audiences[activeTab].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;