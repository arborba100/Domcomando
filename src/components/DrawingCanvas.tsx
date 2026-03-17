import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDrawingStore } from '../store/drawingStore';

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool, color, lineWidth, _clearTrigger } = useDrawingStore();
  const [isDrawing, setIsDrawing] = useState(false);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = tool === 'pen' ? color : 'rgba(0,0,0,1)';
      ctx.lineWidth = lineWidth;
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    return ctx;
  }, [tool, color, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = getContext();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getContext]);

  useEffect(() => {
    const ctx = getContext();
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, [_clearTrigger, getContext]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const ctx = getContext();
    if (!ctx) return;

    setIsDrawing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
  }, [getContext]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = getContext();
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX, clientY);
    ctx.stroke();
  }, [isDrawing, getContext]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const ctx = getContext();
    if (ctx) {
      ctx.closePath();
    }
  }, [getContext]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        cursor: tool === 'pen' ? 'crosshair' : 'cell',
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      onTouchCancel={stopDrawing}
    />
  );
}
