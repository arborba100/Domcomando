import React from 'react';
import { useDrawingStore } from '../store/drawingStore';

export default function DrawingToolbar() {
  const { tool, color, setTool, setColor, clearCanvas } = useDrawingStore();

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 10000,
    }}>
      <button
        onClick={() => setColor('red')}
        style={{
          backgroundColor: tool === 'pen' && color === 'red' ? 'red' : 'lightgray',
          color: tool === 'pen' && color === 'red' ? 'white' : 'black',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Caneta Vermelha
      </button>
      <button
        onClick={() => setColor('blue')}
        style={{
          backgroundColor: tool === 'pen' && color === 'blue' ? 'blue' : 'lightgray',
          color: tool === 'pen' && color === 'blue' ? 'white' : 'black',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Caneta Azul
      </button>
      <button
        onClick={() => setTool('eraser')}
        style={{
          backgroundColor: tool === 'eraser' ? 'gray' : 'lightgray',
          color: tool === 'eraser' ? 'white' : 'black',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Apagar
      </button>
      <button
        onClick={clearCanvas}
        style={{
          backgroundColor: 'orange',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Limpar Tudo
      </button>
    </div>
  );
}
