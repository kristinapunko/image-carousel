import React, { useState, useRef, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ images, onSelect, selectedUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const viewportRef = useRef(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    // Calculate single item width based on computed CSS
    const measure = () => {
      const firstItem = el.querySelector('.carousel-item');
      if (!firstItem) return;
      setItemWidth(firstItem.getBoundingClientRect().width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Determine how many items are fully visible in the viewport
  const visibleCount = itemWidth > 0
    ? Math.max(1, Math.round(viewportRef.current.getBoundingClientRect().width / itemWidth))
    : 1;

  // Last valid index so the final slide fills the viewport
  const maxIndex = Math.max(0, images.length - visibleCount);

  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  return (
    <div className="carousel-wrapper">
      <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous">‹</button>

      <div className="carousel-viewport" ref={viewportRef}>
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * itemWidth}px)` }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className={`carousel-item ${selectedUrls.includes(img.download_url) ? 'selected' : ''}`}
              onClick={() => onSelect(img.download_url)}
              aria-label={`Select image ${img.author}`}
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