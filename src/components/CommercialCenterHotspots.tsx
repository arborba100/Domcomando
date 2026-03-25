import { useState } from 'react';

interface Hotspot {
  id: string;
  name: string;
  left: string;
  top: string;
  width: string;
  height: string;
}

interface CommercialCenterHotspotsProps {
  onCommerceClick: (commerceId: string) => void;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'pizzaria',
    name: 'Pizzaria da Mama',
    left: '10%',
    top: '15%',
    width: '22%',
    height: '28%',
  },
  {
    id: 'admBens',
    name: 'ADM. de Bens',
    left: '38%',
    top: '10%',
    width: '24%',
    height: '30%',
  },
  {
    id: 'templo',
    name: 'Templo Ungí-vos',
    left: '68%',
    top: '12%',
    width: '26%',
    height: '32%',
  },
  {
    id: 'academia',
    name: 'Academia Músculos',
    left: '12%',
    top: '55%',
    width: '28%',
    height: '26%',
  },
  {
    id: 'lavanderia',
    name: 'Lavanderia Povão',
    left: '68%',
    top: '53%',
    width: '25%',
    height: '24%',
  },
];

export default function CommercialCenterHotspots({
  onCommerceClick,
}: CommercialCenterHotspotsProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 w-full h-full">
      {HOTSPOTS.map((hotspot) => (
        <button
          key={hotspot.id}
          onClick={() => onCommerceClick(hotspot.id)}
          onMouseEnter={() => setHoveredHotspot(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          className={`absolute transition-all duration-200 cursor-pointer group ${
            hoveredHotspot === hotspot.id
              ? 'bg-cyan-400/30 border-2 border-cyan-300'
              : 'bg-transparent border-2 border-transparent hover:border-cyan-300/50'
          }`}
          style={{
            left: hotspot.left,
            top: hotspot.top,
            width: hotspot.width,
            height: hotspot.height,
          }}
          title={hotspot.name}
          aria-label={hotspot.name}
        >
          {/* Tooltip on hover */}
          {hoveredHotspot === hotspot.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-cyan-900/90 text-cyan-100 text-sm rounded whitespace-nowrap pointer-events-none z-50">
              {hotspot.name}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
