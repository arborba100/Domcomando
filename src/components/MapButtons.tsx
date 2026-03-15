import { useEffect, useRef, useState } from 'react';
import { useMapButtonsStore } from '@/store/mapButtonsStore';
import { Image } from '@/components/ui/image';

interface MapButtonsProps {
  mapInstance: any; // Instância do Leaflet map
  mapContainer: React.RefObject<HTMLDivElement>;
}

export default function MapButtons({ mapInstance, mapContainer }: MapButtonsProps) {
  const buttons = useMapButtonsStore((state) => state.buttons);
  const [zoomLevel, setZoomLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapInstance || !mapContainer.current) return;

    // Atualizar zoom quando o mapa muda
    const handleZoom = () => {
      setZoomLevel(mapInstance.getZoom());
    };

    mapInstance.on('zoom', handleZoom);
    setZoomLevel(mapInstance.getZoom());

    return () => {
      mapInstance.off('zoom', handleZoom);
    };
  }, [mapInstance, mapContainer]);

  // Calcular escala baseada no zoom
  const getScale = () => {
    // Zoom -1 = 0.5x, Zoom 0 = 1x, Zoom 1 = 1.5x, Zoom 2 = 2x
    return 0.5 + (zoomLevel + 1) * 0.5;
  };

  const scale = getScale();

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 500,
      }}
    >
      {buttons.map((button) => {
        if (button.visible === false) return null;

        // Converter coordenadas do mapa para coordenadas da tela
        const latLng = [button.y, button.x];
        const point = mapInstance.latLngToContainerPoint(latLng);

        const scaledWidth = button.width * scale;
        const scaledHeight = button.height * scale;

        return (
          <button
            key={button.id}
            onClick={(e) => {
              e.stopPropagation();
              button.onClick();
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-200 hover:scale-110 active:scale-95 ${
              button.color || 'bg-cyan-500 hover:bg-cyan-400'
            } text-white font-bold rounded-lg shadow-lg border-2 border-cyan-300 hover:border-cyan-200 flex items-center justify-center gap-2 px-3 py-2`}
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              fontSize: `${Math.max(10, 12 * scale)}px`,
              boxShadow: `0 0 ${10 * scale}px rgba(0, 234, 255, 0.6)`,
            }}
            title={button.label}
          >
            {button.icon && (
              <Image src={button.icon} alt={button.label} style={{
                  width: `${Math.max(16, 20 * scale)}px`,
                  height: `${Math.max(16, 20 * scale)}px`,
                }} />
            )}
            <span className="truncate">{button.label}</span>
          </button>
        );
      })}
    </div>
  );
}
