import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className='fixed bottom-5 right-5'>
      {isVisible && (
        <div className="flex justify-center items-center bg-green-800 rounded-full py-5 w-12 h-12" onClick={scrollToTop}>
          <FaArrowUp className='text-3xl text-white cursor-pointer' />
        </div>
      )}
    </div>
  );
};

export default ScrollToTopButton;