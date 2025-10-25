import { useState, useEffect } from 'react';

interface MobileDetectionOptions {
  breakpoint?: number;
  debounceMs?: number;
}

export const useMobileDetection = (options: MobileDetectionOptions = {}) => {
  const { breakpoint = 1024, debounceMs = 100 } = options;
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const checkMobile = () => {
      const isMobileView = window.innerWidth < breakpoint;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      console.log('Mobile detection:', { 
        width: window.innerWidth, 
        breakpoint, 
        isMobileView, 
        isTouch,
        maxTouchPoints: navigator.maxTouchPoints,
        timestamp: new Date().toISOString()
      });
      
      setIsMobile(isMobileView);
      setIsTouchDevice(isTouch);
    };

    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, debounceMs);
    };

    // Initial check
    checkMobile();
    
    // Add event listeners
    window.addEventListener('resize', debouncedCheckMobile);
    window.addEventListener('orientationchange', debouncedCheckMobile);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheckMobile);
      window.removeEventListener('orientationchange', debouncedCheckMobile);
    };
  }, [breakpoint, debounceMs]);

  return { isMobile, isTouchDevice };
};
