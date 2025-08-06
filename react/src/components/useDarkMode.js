import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Local storage-dan əvvəlki seçimi oxu
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Əgər heç bir seçim yoxdursa, sistem preferences-i yoxla
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Local storage-a yaz
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // HTML element-ə class əlavə et/çıxart
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};