import { useEffect, useState } from 'react'
import './App.css'
import Carousel from './components/Carousel/Carousel'

function App() {
  const [images, setImages] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?limit=12')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(err => console.error("Error loading images:", err));
  }, []);

  const handleSelect = (url) => {
    setSelectedUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  return (
    <main className="App-container">
      <h1 className="main-title">Image Carousel</h1>

      <Carousel
        images={images}
        onSelect={handleSelect}
        selectedUrls={selectedUrls}
      />

      {selectedUrls.length > 0 && (
        <section className="selected-section">
          <h3>Selected images ({selectedUrls.length})</h3>
          <ul className="selected-list">
            {selectedUrls.map(url => (
              <li key={url} className="selected-item">
                <a href={url} target="_blank" rel="noreferrer">{url}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export default App