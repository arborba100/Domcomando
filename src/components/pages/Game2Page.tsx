import { useState, useEffect, useRef } from 'react';
import { Image } from '@/components/ui/image';
import { X, Plus, Trash2, Copy } from 'lucide-react';

interface ClickPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  timestamp: number;
}

export default function Game2Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([
    'https://static.wixstatic.com/media/50f4bf_8ad82d29d0444efcb381c4cdb3e2fbd7~mv2.png',
  ]);
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [pointLabel, setPointLabel] = useState('');
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Method to update the image during gameplay
  const updateGameImage = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
    setCurrentImageIndex(prev => prev + 1);
    setClickPoints([]);
  };

  // Expose the update method globally for game logic to use
  useEffect(() => {
    (window as any).updateGame2Image = updateGameImage;
    return () => {
      delete (window as any).updateGame2Image;
    };
  }, []);

  // Handle image click to create points
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return;

    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Ensure coordinates are within bounds
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newPoint: ClickPoint = {
      id: `point-${Date.now()}`,
      x,
      y,
      label: `Ponto ${clickPoints.length + 1}`,
      timestamp: Date.now(),
    };

    setClickPoints(prev => [...prev, newPoint]);
    setSelectedPointId(newPoint.id);
    setPointLabel(newPoint.label || '');
  };

  // Remove a point
  const removePoint = (id: string) => {
    setClickPoints(prev => prev.filter(p => p.id !== id));
    if (selectedPointId === id) {
      setSelectedPointId(null);
      setPointLabel('');
    }
  };

  // Update point label
  const updatePointLabel = (id: string, newLabel: string) => {
    setClickPoints(prev =>
      prev.map(p => (p.id === id ? { ...p, label: newLabel } : p))
    );
    setPointLabel(newLabel);
  };

  // Export points as JSON
  const exportPoints = () => {
    const data = {
      imageUrl: images[currentImageIndex],
      points: clickPoints,
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game2-points-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy points to clipboard
  const copyToClipboard = () => {
    const data = {
      imageUrl: images[currentImageIndex],
      points: clickPoints,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('Pontos copiados para a área de transferência!');
  };

  // Clear all points
  const clearAllPoints = () => {
    if (confirm('Tem certeza que deseja limpar todos os pontos?')) {
      setClickPoints([]);
      setSelectedPointId(null);
      setPointLabel('');
    }
  };

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <div className="w-full h-screen flex flex-col bg-black overflow-hidden">
      {/* Control Panel */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isEditMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {isEditMode ? '✓ Modo Edição Ativo' : 'Ativar Modo Edição'}
          </button>
          <span className="text-gray-400 text-sm">
            {clickPoints.length} ponto{clickPoints.length !== 1 ? 's' : ''} criado{clickPoints.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            disabled={clickPoints.length === 0}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
            title="Copiar pontos para área de transferência"
          >
            <Copy size={16} />
            Copiar
          </button>
          <button
            onClick={exportPoints}
            disabled={clickPoints.length === 0}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            title="Baixar pontos como JSON"
          >
            Exportar
          </button>
          <button
            onClick={clearAllPoints}
            disabled={clickPoints.length === 0}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 size={16} />
            Limpar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center relative">
          <div
            ref={imageContainerRef}
            onClick={handleImageClick}
            className={`relative w-full h-full flex items-center justify-center ${
              isEditMode ? 'cursor-crosshair' : 'cursor-default'
            }`}
          >
            <Image
              src={currentImage}
              alt="Game 2 Scene"
              className="w-full h-full object-contain"
              width={1080}
              height={1920}
            />

            {/* Click Points Overlay */}
            {clickPoints.map(point => (
              <div
                key={point.id}
                className="absolute group"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Point Circle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPointId(point.id);
                    setPointLabel(point.label || '');
                  }}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                    selectedPointId === point.id
                      ? 'bg-orange-500 border-orange-300 scale-125'
                      : 'bg-blue-500 border-blue-300 hover:scale-110'
                  }`}
                  title={point.label}
                />

                {/* Label Tooltip */}
                {point.label && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-700">
                    {point.label}
                  </div>
                )}

                {/* Delete Button */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePoint(point.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Deletar ponto"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}

            {/* Edit Mode Indicator */}
            {isEditMode && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                Clique na imagem para criar pontos
              </div>
            )}
          </div>
        </div>

        {/* Points List Sidebar */}
        <div className="w-80 bg-gray-900 rounded border border-gray-700 flex flex-col overflow-hidden">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Plus size={18} />
              Pontos Clicáveis
            </h3>
          </div>

          {/* Points List */}
          <div className="flex-1 overflow-y-auto">
            {clickPoints.length === 0 ? (
              <div className="p-4 text-gray-400 text-sm text-center">
                Nenhum ponto criado ainda.
                <br />
                Ative o modo edição e clique na imagem.
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {clickPoints.map((point, index) => (
                  <div
                    key={point.id}
                    onClick={() => {
                      setSelectedPointId(point.id);
                      setPointLabel(point.label || '');
                    }}
                    className={`p-3 rounded border-2 cursor-pointer transition-all ${
                      selectedPointId === point.id
                        ? 'bg-orange-900 border-orange-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">
                        #{index + 1}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePoint(point.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="text-gray-300 text-xs mb-2">
                      X: {point.x.toFixed(1)}% | Y: {point.y.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Selected Point */}
          {selectedPointId && (
            <div className="border-t border-gray-700 p-4 bg-gray-800">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Editar Rótulo
              </label>
              <input
                type="text"
                value={pointLabel}
                onChange={(e) => {
                  setPointLabel(e.target.value);
                  updatePointLabel(selectedPointId, e.target.value);
                }}
                placeholder="Nome do ponto..."
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
