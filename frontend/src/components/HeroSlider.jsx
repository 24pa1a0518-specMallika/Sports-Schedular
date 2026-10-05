import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const slides = [
  {
    title: 'FIND YOUR GAME. FIND YOUR TEAM.',
    description: 'Create or join a sports session and play with others.',
    buttonText: 'Create Session',
    buttonLink: '/sessions/create',
    icon: PlusCircle,
  },
  {
    title: 'CREATE YOUR OWN MATCH',
    description: 'Choose your sport, date, time, venue and players.',
    buttonText: 'Create Session',
    buttonLink: '/sessions/create',
    icon: PlusCircle,
  },
  {
    title: 'JOIN THE GAME',
    description: 'Find an available session and join other players.',
    buttonText: 'Find Sessions',
    buttonLink: '/sessions',
    icon: Search,
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAction = (link) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(link);
    }
  };

  return (
    <div className="hero-slider-container">
      {slides.map((slide, index) => {
        const IconComponent = slide.icon;
        return (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <button
              onClick={() => handleAction(slide.buttonLink)}
              className="btn btn-primary"
              style={{ width: 'auto', padding: '0.7rem 1.5rem', borderRadius: '9999px' }}
            >
              <IconComponent size={18} />
              {slide.buttonText}
            </button>
          </div>
        );
      })}

      <button onClick={handlePrev} className="slider-btn prev" aria-label="Previous Slide">
        <ChevronLeft size={22} />
      </button>

      <button onClick={handleNext} className="slider-btn next" aria-label="Next Slide">
        <ChevronRight size={22} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
