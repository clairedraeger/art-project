"use client";
import { useEffect, useRef, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    const url = localStorage.getItem("blendImageUrl");
    if (url) setImageUrl(url);
  }, []);

  const handleCrop = async (index) => {
    setSelectedImageIndex(index);

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const xMid = width / 2;
    const yMid = height / 2;

    const positions = [
      { x: 0, y: 0 },         // top-left
      { x: xMid, y: 0 },      // top-right
      { x: 0, y: yMid },      // bottom-left
      { x: xMid, y: yMid },   // bottom-right
    ];

    const { x, y } = positions[index];
    canvas.width = xMid;
    canvas.height = yMid;
    ctx.drawImage(img, x, y, xMid, yMid, 0, 0, xMid, yMid);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "cropped.png");

      try {
        const res = await fetch("https://art-backend-6mu2.onrender.com/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const imageUrl = data.url; // image url returned by server

        // save the image URL to backend
        await fetch("https://art-backend-6mu2.onrender.com/imagehost/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            imageUrl: imageUrl, 
        }),
        });

        console.log("Image uploaded and URL saved:", imageUrl);
        // go back to draw screen
        window.location.href = '/';
      } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed");
      }
    }, "image/png");
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", overflowY: "auto", height: "100vh" }}>
      <button onClick={handleBack}>Back to Drawing</button>
      <h1>Pick a piece to display</h1>

      {imageUrl ? (
        <div style={{ position: "relative", display: "inline-block", marginTop: "2rem" }}>
          <img
            src={imageUrl}
            ref={imgRef}
            crossOrigin="anonymous"
            alt="Uploaded"
            style={{ maxWidth: "100%", display: "block" }}
          />
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              onClick={() => handleCrop(idx)}
              style={{
                position: "absolute",
                width: "50%",
                height: "50%",
                top: idx < 2 ? 0 : "50%",
                left: idx % 2 === 0 ? 0 : "50%",
                cursor: "pointer",
                border: selectedImageIndex === idx
                  ? "4px solid #4CAF50"
                  : "2px dashed rgba(255,255,255,0.5)",
                boxSizing: "border-box",
                transition: "border 0.2s ease-in-out",
              }}
            />
          ))}
        </div>
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}