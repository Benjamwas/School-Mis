import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
const heroImages = ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'];
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState('');
  const fullText = 'Where young minds grow and flourish';
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    let index = 0;
    const textInterval = setInterval(() => {
      if (index <= fullText.length) {
        setAnimatedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(textInterval);
      }
    }, 100);
    return () => clearInterval(textInterval);
  }, []);
  return <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {heroImages.map((img, index) => <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} style={{
      backgroundImage: `url(${img})`
    }} />)}
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block">
              Welcome to <span className="text-red-500">Bright</span>Future
              Schools
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 h-8">{animatedText}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/campuses" variant="primary" size="lg">
              Explore Our Campuses
            </Button>
            <Button href="/contact#enroll" variant="outline" size="lg" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white">
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;