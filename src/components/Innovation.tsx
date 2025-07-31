import React from 'react';
import { Heart, Wind, Brain, Thermometer } from 'lucide-react';

const Innovation = () => {
  const innovations = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Memory Foam Revolution",
      description: "Our proprietary gel-infused memory foam adapts to your unique body contours, providing personalized support that evolves with your movements throughout the day.",
      stats: "99% pressure point reduction"
    },
    {
      icon: <Wind className="w-12 h-12" />,
      title: "Breathable Mesh Technology",
      description: "Advanced 3D breathable mesh fabric promotes optimal airflow, keeping you cool and comfortable during extended sitting sessions.",
      stats: "40% better ventilation"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Smart Posture Alerts",
      description: "AI-powered sensors continuously monitor your posture and provide gentle haptic feedback to encourage healthy sitting habits and prevent long-term issues.",
      stats: "85% posture improvement"
    },
    {
      icon: <Thermometer className="w-12 h-12" />,
      title: "Temperature Regulation",
      description: "Intelligent climate control system maintains optimal seating temperature by adjusting to your body heat and environmental conditions.",
      stats: "Perfect temperature 24/7"
    }
  ];

  return (
    <section id="innovation" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading text-gray-900 mb-6">
            Comfort Meets <span className="text-cyan-600">Innovation</span>
          </h2>
          <p className="text-lg font-body text-gray-600 max-w-3xl mx-auto">
            Revolutionary technologies working together to transform how you experience seating comfort and productivity.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {innovations.map((innovation, index) => (
            <div key={index} className="group">
              <div className="flex items-start space-x-6">
                <div className="text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300 flex-shrink-0">
                  {innovation.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-heading text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors duration-300">
                    {innovation.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 font-body">
                    {innovation.description}
                  </p>
                  <div className="inline-block bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-full px-4 py-2 text-sm text-cyan-600 font-subheading">
                    {innovation.stats}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Innovation;