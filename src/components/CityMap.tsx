import { useEffect, useRef } from 'react';

export default function CityMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Three.js logic will be added here
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-4xl font-heading text-subtitle-neon-blue mb-4">
          Mapa do Complexo
        </h1>
        <p className="text-lg font-paragraph text-foreground opacity-75">
          Carregando mapa 3D...
        </p>
      </div>
    </div>
  );
}
