
"use client"; // Marking the component as a client component

import React, { useEffect, useState } from 'react';
import "./imageslider.css";

// Define the props for the BackgroundSlider component
const BackgroundSlider: React.FC = () => {
     const images = [
    "assets/images/cdc-vo.jpg",
     "assets/images/cdc.jpg",
     "assets/images/chay.jpg",

 ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="background-slider" style={{ backgroundImage: `url(${images[currentIndex]})` }}>
      <div className="content">
        <h1>YOUR FREE DIGITAL VACCINE RECORDS FOR LIFE</h1>
        <p>The vaccine App is your digital vaccine record replacing all paper counterparts globally.</p>
      </div>
    </div>
  );
};

export default BackgroundSlider;
