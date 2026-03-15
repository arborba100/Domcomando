import { useEffect, useRef } from 'react';

export default function GameMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamically load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      if (mapContainer.current && (window as any).L) {
        const L = (window as any).L;
        const urlMapaFundo = 'https://static.wixstatic.com/media/50f4bf_9dbf16b020134b02adc81709d1e774b9~mv2.png';
        
        const map = L.map(mapContainer.current, {
          crs: L.CRS.Simple,
          minZoom: -2,
          zoomControl: false,
          attributionControl: false,
        });
        
        const bounds = [[0, 0], [1000, 1000]];
        L.imageOverlay(urlMapaFundo, bounds).addTo(map);
        map.fitBounds(bounds);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      id="map"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        margin: 0,
        padding: 0,
      }}
    />
  );
}
