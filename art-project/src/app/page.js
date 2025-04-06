"use client";

import { FaTrash, FaUndo, FaRedo } from 'react-icons/fa';
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef(null);
  const toolbarRef = useRef(null);
  const ctxRef = useRef(null);
  const lineWidthRef = useRef(10);
  const strokeStyleRef = useRef("#000000");
  const brushTypeRef = useRef("round");
  const rainbowHueRef = useRef(0);
  const [lastImage, setLastImage] = useState(null);
  const [redoImage, setRedoImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    let isPainting = false;

    const draw = (e) => {
      if (!isPainting) return;
    
      ctx.lineWidth = lineWidthRef.current;
      ctx.strokeStyle = strokeStyleRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    
      const x = e.offsetX;
      const y = e.offsetY;
      const brush = brushTypeRef.current;
    
      if (brush === "round") {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      else if (brush === "spray") {
        for (let i = 0; i < 10; i++) {
          const offsetX = (Math.random() - 0.5) * lineWidthRef.current * 4;
          const offsetY = (Math.random() - 0.5) * lineWidthRef.current * 4;
          ctx.fillStyle = strokeStyleRef.current;
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      else if (brush === "calligraphy") {
        const angle = Math.PI / 6;
        const width = lineWidthRef.current;
        const length = 10;
      
        const x1 = x + Math.cos(angle) * width;
        const y1 = y + Math.sin(angle) * width;
        const x2 = x - Math.cos(angle) * width;
        const y2 = y - Math.sin(angle) * width;
      
        ctx.strokeStyle = strokeStyleRef.current;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      else if (brush === "fuzzy") {
        const radius = lineWidthRef.current * 2;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, strokeStyleRef.current);
        gradient.addColorStop(1, 'transparent');
      
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
      else if (brush === "paint") {
        const bristleCount = 20;
        const radius = lineWidthRef.current / 2;
      
        for (let i = 0; i < bristleCount; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * radius;
          const offsetX = Math.cos(angle) * distance;
          const offsetY = Math.sin(angle) * distance;
      
          ctx.beginPath();
          ctx.strokeStyle = strokeStyleRef.current;
          ctx.globalAlpha = 0.1 + Math.random() * 0.15;
          ctx.lineWidth = 1 + Math.random() * 2.5; 
      
          ctx.moveTo(x + offsetX, y + offsetY);
          ctx.lineTo(x + offsetX + 2, y + offsetY + 2);
          ctx.stroke();
        }
      
        ctx.globalAlpha = 1;
      }
      else if (brush === "eraser") {
        ctx.strokeStyle = "#faf6e4";
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    canvas.addEventListener("mousedown", () => {
      isPainting = true;
      ctx.beginPath();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setLastImage(imageData);
      setRedoImage(null);
    });

    canvas.addEventListener('mouseup', (e) => {
      isPainting = false;
    });

    canvas.addEventListener("mousemove", draw);
    ctxRef.current = ctx;

    return () => {
      canvas.removeEventListener("mousedown", () => {});
      canvas.removeEventListener("mouseup", () => {});
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  const handleColorChange = (e) => {
    strokeStyleRef.current = e.target.value;
  };

  const handleLineWidthChange = (e) => {
    lineWidthRef.current = Number(e.target.value);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleBrushChange = (e) => {
    brushTypeRef.current = e.target.value;
  };

  const handleUndo = () => {
    if (lastImage && ctxRef.current) {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
  
      const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setRedoImage(currentImage); // store for redo
      ctx.putImageData(lastImage, 0, 0);
      setLastImage(null);
    }
  };
  
  const handleRedo = () => {
    if (redoImage && ctxRef.current) {
      const ctx = ctxRef.current;
      ctx.putImageData(redoImage, 0, 0);
      setRedoImage(null);
    }
  };

  return (
    <div className="container">
      <div id="toolbar" ref={toolbarRef}>
        <h1>Draw.</h1>
        <div></div>
        <label htmlFor="brush">brush style</label>
        <select id="brush" name="brush" onChange={handleBrushChange}>
          <option value="round">Round</option>
          <option value="spray">Spray</option>
          <option value="calligraphy">Calligraphy</option>
          <option value="fuzzy">Fuzzy</option>
          <option value="paint">Paint Brush</option>
          <option value="eraser">Eraser</option>
        </select>
        <label htmlFor="stroke">stroke</label>
        <input id="stroke" name="stroke" type="color" onChange={handleColorChange} />
        <label htmlFor="line-width">line width</label>
        <input id="line-width" name="line-width" type="number" defaultValue="10" onChange={handleLineWidthChange} />
        <div id="icon-row">
          <button id="icon" onClick={handleClear}><FaTrash style={{ color: 'black' }} /></button>
          <button id="icon" onClick={handleUndo}><FaUndo style={{ color: 'black' }} /></button>
          <button id="icon" onClick={handleRedo}><FaRedo style={{ color: 'black' }} /></button>
        </div>
      </div>
      <div className="sketchboard">
        <canvas id="sketchboard" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
