# Image Carousel

A responsive image carousel built with React and Vite, without third-party carousel libraries.

## Features

- Responsive: adjusts visible items based on viewport width via `ResizeObserver`
- Infinite scrolling with smooth `translateX` transitions
- Image selection with a list of selected URLs below the carousel
- Pure CSS animations and transitions

## Tech Stack

- React + Vite
- Pure CSS (no frameworks)
- [Picsum Photos API](https://picsum.photos/)

## Project Structure

```
src/
├── components/
│   └── Carousel/
│       ├── Carousel.jsx
│       └── Carousel.css
├── App.jsx
├── App.css
└── index.css
```

## Setup

```bash
git clone [your-repository-link]
npm install
npm run dev
```

