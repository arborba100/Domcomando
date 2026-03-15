import { useGameScreenStore } from '@/store/gameScreenStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, Menu } from 'lucide-react';

export default function GameMapScreen() {
  const setScreen = useGameScreenStore((state) => state.setScreen);
  const setSelectedLocation = useGameScreenStore((state) => state.setSelectedLocation);

  const locations = [
    { id: 'qg', name: 'Seu QG', desc: 'Domínio da Favela', x: 300, y: 250 },
    { id: 'viatura', name: 'Viatura PM', desc: 'NPC: Sgt. Rocha', x: 500, y: 500 },
    { id: 'boca', name: 'Boca de Fumo', desc: 'Ponto de Venda', x: 700, y: 300 },
    { id: 'banco', name: 'Banco', desc: 'Lavar Dinheiro', x: 200, y: 700 },
  ];

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    setScreen('location');
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* Map background */}
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/50f4bf_9dbf16b020134b02adc81709d1e774b9~mv2.png)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Location markers */}
        <div className="absolute inset-0">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${(location.x / 1000) * 100}%`,
                top: `${(location.y / 1000) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLocationClick(location.id)}
                className="relative"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-orange-500/50 cursor-pointer hover:shadow-orange-500/80 transition-all"
                >
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-50"
                ></motion.div>
              </motion.button>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 bg-gray-900 border-2 border-cyan-400 rounded-lg p-3 whitespace-nowrap text-center shadow-lg opacity-0 hover:opacity-100 pointer-events-none hover:pointer-events-auto"
              >
                <p className="font-heading text-cyan-400 font-bold">{location.name}</p>
                <p className="font-paragraph text-xs text-gray-300">{location.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-6 z-20">
        <div className="flex justify-between items-center">
          <div className="font-heading text-cyan-400 text-2xl font-bold">MAPA DA CIDADE</div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen('menu')}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-cyan-400 text-cyan-400"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-20">
        <p className="font-paragraph text-gray-400 text-center">Clique em um local para interagir</p>
      </div>
    </div>
  );
}
