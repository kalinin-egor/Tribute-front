import React, { useState, useEffect, useCallback } from 'react';
import styles from './StoryViewer.module.css';

interface StoryViewerProps {
  slides: string[];
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ slides, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Auto-advance logic could be added here if needed
  }, [currentSlide]);

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose(); // Close when the last slide is finished
    }
  }, [currentSlide, slides.length, onClose]);

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  return (
    <div className={styles.overlay}>
      <div className={styles.storyContainer}>
        <div className={styles.progressBars}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressBar} ${index <= currentSlide ? styles.progressBarActive : ''}`}
            />
          ))}
        </div>
        <div className={styles.closeButton} onClick={onClose}>&times;</div>

        <div className={styles.storyContent}>
          <img src={slides[currentSlide]} alt={`Story slide ${currentSlide + 1}`} className={styles.storyImage} />
          <div className={`${styles.navArea} ${styles.navAreaLeft}`} onClick={goToPrevious}></div>
          <div className={`${styles.navArea} ${styles.navAreaRight}`} onClick={goToNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer; 