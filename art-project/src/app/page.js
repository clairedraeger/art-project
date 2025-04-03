"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef(null);
  const toolbarRef = useRef(null);
  const ctxRef = useRef(null);
  const lineWidthRef = useRef(5);
  const strokeStyleRef = useRef("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;

    // Scale for high-resolution displays
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(devicePixelRatio, devicePixelRatio); // Scale the drawing context

    let isPainting = false;

    const draw = (e) => {
      if (!isPainting) return;
      ctx.lineWidth = lineWidthRef.current;
      ctx.strokeStyle = strokeStyleRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round"; // Improves line smoothness
      ctx.lineTo(e.offsetX, e.offsetY); // Fixes alignment issues
      ctx.stroke();
    };

    canvas.addEventListener("mousedown", () => {
      isPainting = true;
      ctx.beginPath();
    });

    canvas.addEventListener("mouseup", () => {
      isPainting = false;
      ctx.stroke();
      ctx.beginPath();
    });

    canvas.addEventListener("mousemove", draw);

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

  return (
    <div className="container">
      <div id="toolbar" ref={toolbarRef}>
        <h1>Draw.</h1>
        <label htmlFor="stroke">stroke</label>
        <input id="stroke" name="stroke" type="color" onChange={handleColorChange} />
        <label htmlFor="line-width">line width</label>
        <input id="line-width" name="line-width" type="number" defaultValue="5" onChange={handleLineWidthChange} />
        <button id="clear" onClick={handleClear}>clear</button>
      </div>
      <div className="sketchboard">
        <canvas id="sketchboard" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
