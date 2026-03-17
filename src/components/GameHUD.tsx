import { useGameStore } from '@/store/gameStore';
import { Zap, ShoppingBag, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameHUD() {
  const { playerLevel, dirtMoney, spins } = useGameStore();

  const handleSpinSlot = () => {
    // Implementar lógica de girar slot
    console.log('Girar Slot');
  };

  const handleOpenShop = () => {
    // Implementar lógica de abrir loja
    console.log('Abrir Loja');
  };

  const handleOpenGang = () => {
    // Implementar lógica de abrir quadrilha
    console.log('Abrir Quadrilha');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top HUD - Player Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 right-6 pointer-events-auto"
      >
        <div className="backdrop-blur-md bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
          <div className="grid grid-cols-3 gap-8">
            {/* Level */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-paragraph text-cyan-400/70 uppercase tracking-widest mb-2">
                Nível
              </div>
              <div className="text-3xl font-heading text-cyan-400 drop-shadow-lg">
                {playerLevel}
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mt-2 rounded-full"></div>
            </div>

            {/* Dirty Money */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-paragraph text-red-400/70 uppercase tracking-widest mb-2">
                Dinheiro Sujo
              </div>
              <div className="text-3xl font-heading text-red-400 drop-shadow-lg">
                ${dirtMoney.toLocaleString()}
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 mt-2 rounded-full"></div>
            </div>

            {/* Clean Money (Spins) */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-paragraph text-green-400/70 uppercase tracking-widest mb-2">
                Dinheiro Limpo
              </div>
              <div className="text-3xl font-heading text-green-400 drop-shadow-lg">
                ${spins.toLocaleString()}
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Right Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-6 right-6 pointer-events-auto flex flex-col gap-3"
      >
        {/* Girar Slot Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpinSlot}
          className="group relative px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg backdrop-blur-sm hover:border-yellow-400/80 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            <span className="font-paragraph text-sm font-medium text-yellow-400 group-hover:text-yellow-300 transition-colors uppercase tracking-wide">
              Girar Slot
            </span>
          </div>
          <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 rounded-lg transition-colors duration-300"></div>
        </motion.button>

        {/* Abrir Loja Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenShop}
          className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-lg backdrop-blur-sm hover:border-cyan-400/80 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="font-paragraph text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-wide">
              Loja
            </span>
          </div>
          <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/10 rounded-lg transition-colors duration-300"></div>
        </motion.button>

        {/* Quadrilha Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenGang}
          className="group relative px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg backdrop-blur-sm hover:border-purple-400/80 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="font-paragraph text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors uppercase tracking-wide">
              Quadrilha
            </span>
          </div>
          <div className="absolute inset-0 bg-purple-400/0 group-hover:bg-purple-400/10 rounded-lg transition-colors duration-300"></div>
        </motion.button>
      </motion.div>
    </div>
  );
}
