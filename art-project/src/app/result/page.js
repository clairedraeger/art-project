"use client";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [splitImages, setSplitImages] = useState([]);

  useEffect(() => {
    const url = localStorage.getItem('uploadedImageUrl');
    setImageUrl(url);
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const images = [];
        const xMid = width / 2;
        const yMid = height / 2;

        const regions = [
          { x: 0, y: 0, w: xMid, h: yMid },   // top left
          { x: xMid, y: 0, w: xMid, h: yMid }, // top right
          { x: 0, y: yMid, w: xMid, h: yMid }, // bottom left
          { x: xMid, y: yMid, w: xMid, h: yMid } // bottom right
        ];

        regions.forEach(region => {
          const { x, y, w, h } = region;
          const partCanvas = document.createElement('canvas');
          partCanvas.width = w;
          partCanvas.height = h;
          const partCtx = partCanvas.getContext('2d');
          partCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
          images.push(partCanvas.toDataURL());
        });
        setSplitImages(images);
      };

      img.onerror = () => {
        console.error("Failed to load image:", img.src);
      };
    }
  }, [imageUrl]);

  const handleImageClick = (index) => {
    console.log(`Selected image number: ${index + 1}`);
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <button onClick={handleBack}>
        Back to Drawing
      </button>
      <h1>Pick a piece to display</h1>
      {splitImages.length > 0 ? (
        <div className="images-container">
          {splitImages.map((src, index) => (
            <img 
              key={index} 
              src={src} 
              alt={`Blended Part ${index + 1}`} 
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover', cursor: 'pointer' }} // Add pointer cursor
              onClick={() => handleImageClick(index)} // Add onClick handler
            />
          ))}
        </div>
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}