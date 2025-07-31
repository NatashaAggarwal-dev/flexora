import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import '@google/model-viewer';

const Hero = () => {
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      const handleLoad = () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
          loadingOverlay.style.display = 'none';
        }
      };

      modelViewer.addEventListener('load', handleLoad);
      
      // Also hide loading after a timeout as fallback
      const timeout = setTimeout(() => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
          loadingOverlay.style.display = 'none';
        }
      }, 5000);

      return () => {
        modelViewer.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-heading text-gray-900 mb-6 leading-tight">
            Flex in
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent block">
              Comfort
            </span>
          </h1>
          
          <p className="text-lg font-body text-gray-600 mb-8 max-w-2xl">
            Flexora is a smart, comfy chair with tech features and posture support—perfect for students, professionals, and gamers who sit for long hours. It helps you stay comfortable, connected, and focused every day.
          </p>
          
          <div className="flex justify-center lg:justify-start space-x-4">
            <button 
              onClick={() => {
                const ctaSection = document.getElementById('cta');
                if (ctaSection) {
                  ctaSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-full font-subheading text-lg hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
            >
              Experience the Comfort
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            

          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start space-x-12 text-sm font-body text-gray-500">
            <div className="flex flex-col items-center group">
              <img 
                src="/images/Feautres logo/noise.png" 
                alt="Noise Reduction" 
                className="w-12 h-12 mb-2 object-contain transition-all duration-700 ease-in-out group-hover:scale-110 animate-bounce"
                style={{ animationDelay: '0s', animationDuration: '3s' }}
              />
              <div className="text-center">Noise Reduction</div>
            </div>
            <div className="flex flex-col items-center group">
              <img 
                src="/images/Feautres logo/posture_Sensor.png" 
                alt="Posture Sensor" 
                className="w-12 h-12 mb-2 object-contain transition-all duration-700 ease-in-out group-hover:scale-110 animate-bounce"
                style={{ animationDelay: '0.5s', animationDuration: '3s' }}
              />
              <div className="text-center">Posture Sensor</div>
            </div>
            <div className="flex flex-col items-center group">
              <img 
                src="/images/Feautres logo/seating.png" 
                alt="Seating Posture" 
                className="w-12 h-12 mb-2 object-contain transition-all duration-700 ease-in-out group-hover:scale-110 animate-bounce"
                style={{ animationDelay: '1s', animationDuration: '3s' }}
              />
              <div className="text-center">Seating Posture</div>
            </div>
          </div>
        </div>
        
        {/* 3D Prototype - Right Side */}
        <div className="relative w-full h-[600px]">
          <model-viewer 
            ref={modelViewerRef}
            src="/Futuristic_Workspace__0730124314_texture.glb"
            alt="Futuristic Workspace Prototype"
            camera-controls
            auto-rotate
            camera-orbit="0deg 75deg 4m"
            min-camera-orbit="auto auto 4m"
            max-camera-orbit="auto auto 4m"
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '24px',
              transition: 'all 0.3s ease-in-out'
            }}
            shadow-intensity="2"
            environment-image="neutral"
            exposure="1.5"
            ar
            ar-modes="webxr scene-viewer quick-look"
            field-of-view="45deg"
            min-field-of-view="45deg"
            max-field-of-view="45deg"
            interaction-prompt="auto"
            loading="eager"
            reveal="auto"
            camera-target="0m 0m 0m"
            interpolation-decay="200"
            touch-action="pan-x pan-y"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none" id="loading-overlay">
              <div className="text-white text-center bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-lg mb-2 font-subheading">Loading 3D Model...</div>
                <div className="text-sm text-gray-300 font-body">Drag to rotate • Fixed size</div>
              </div>
            </div>
          </model-viewer>
          
          {/* Floating elements */}
          <div className="absolute -top-8 -right-8 bg-cyan-50 backdrop-blur-sm border border-cyan-200 rounded-2xl p-4 text-sm text-cyan-600 animate-float z-20">
            <div className="font-subheading">Smart Posture</div>
            <div className="font-body text-gray-600">Real-time alerts</div>
          </div>
          
          <div className="absolute -bottom-8 -left-8 bg-blue-50 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-sm text-blue-600 animate-float-delayed z-20">
            <div className="font-subheading">AI Comfort</div>
            <div className="font-body text-gray-600">Learns your needs</div>
          </div>
          
          <div className="absolute -bottom-8 -right-8 bg-purple-50 backdrop-blur-sm border border-purple-200 rounded-2xl p-4 text-sm text-purple-600 animate-float z-20">
            <div className="font-subheading">Wireless Charging</div>
            <div className="font-body text-gray-600">Qi-compatible</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;