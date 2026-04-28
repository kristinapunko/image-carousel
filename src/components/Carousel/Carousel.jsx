import React, { useState, useRef, useEffect } from 'react';
import './Carousel.css';

const CLONES_COUNT = 4;

const Carousel = ({ images, onSelect, selectedUrls }) => {
  if (!images.length) return null;

  // Build cloned list: last N + originals + first N for seamless loop
  const slides = [
    ...images.slice(-CLONES_COUNT),
    ...images,
    ...images.slice(0, CLONES_COUNT),
  ];

  const [currentIndex, setCurrentIndex] = useState(CLONES_COUNT);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const viewportRef = useRef(null);

  // Calculate single item width based on computed CSS
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const firstItem = el.querySelector('.carousel-item');
      if (firstItem) setItemWidth(firstItem.getBoundingClientRect().width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [images]);

  // Enable transition only after itemWidth is measured to avoid initial jump
  useEffect(() => {
    if (itemWidth > 0) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [itemWidth]);

  // Jump to real item instantly after landing on a clone
  const handleTransitionEnd = () => {
    if (currentIndex >= images.length + CLONES_COUNT) {
      setIsTransitioning(false);
      setCurrentIndex(CLONES_COUNT);
    } else if (currentIndex <= CLONES_COUNT - 1) {
      setIsTransitioning(false);
      setCurrentIndex(images.length + CLONES_COUNT - 1);
    }

    setIsLocked(false);
  };

  // Re-enable transition after silent jump
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    if (isLocked || !isTransitioning) return;

    setIsLocked(true);
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isLocked || !isTransitioning) return;

    setIsLocked(true);
    setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="carousel-wrapper">
      <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous">‹</button>

      <div className="carousel-viewport" ref={viewportRef}>
        <div
          className="carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,
            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
          }}
        >
          {slides.map((img, index) => (
            <div
              key={`${img.id}-${index}`}
              className={`carousel-item ${selectedUrls.includes(img.download_url) ? 'selected' : ''}`}
              onClick={() => onSelect(img.download_url)}
              aria-label={`Select image by ${img.author}`}
            >
              <img src={`https://picsum.photos/id/${img.id}/600/400`} alt={img.author} />
            </div>
          ))}
        </div>
      </div>

      <button className="nav-btn next" onClick={nextSlide} aria-label="Next">›</button>
    </div>
  );
};

export default Carousel;