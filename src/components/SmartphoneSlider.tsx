import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SmartphoneSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Array of screenshot paths from the public folder
  const screenshots = [
    '/app_screens/screen1.jpg',
    '/app_screens/screen2.jpg',
    '/app_screens/screen3.jpg',
    '/app_screens/screen4.jpg',
    '/app_screens/screen5.jpg'
  ];

  // Auto-slide every 3 seconds unless hovered
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, screenshots.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <div 
      className="relative w-[280px] h-[580px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Smartphone frame */}
      <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl">
        {/* Screen bezel */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-[3%] bg-black rounded-b-3xl" />
        
        {/* Screenshot container with mask for rounded corners */}
        <div className="absolute top-[2%] left-[4%] right-[4%] bottom-[2%] rounded-[2.5rem] overflow-hidden bg-white">
          {/* Screenshots */}
          <div className="relative w-full h-full">
            {screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`App Screenshot ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {isHovered && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-2">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-teal-600 w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartphoneSlider;