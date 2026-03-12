// HPI 1.7-V - 9:16 Vertical Layout
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Bell, Settings, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import LoginModal from '@/components/LoginModal';
import { usePlayerStore } from '@/store/playerStore';

// --- Constants ---
const DEFAULT_AVATAR = "https://static.wixstatic.com/media/50f4bf_4961bf11271c41cbba4e316b5143e24e~mv2.png?originWidth=128&originHeight=128";
const DEFAULT_NAME = "COMANDANTE_LEO";

export default function HomePage() {
  const { playerId } = usePlayerStore();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to game if already logged in
  useEffect(() => {
    if (playerId && isMounted) {
      navigate('/game');
    }
  }, [playerId, navigate, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0d14] relative" style={{
      aspectRatio: '9/16',
      backgroundImage: 'url(https://static.wixstatic.com/media/50f4bf_1e5ca7c3774d48e6b010a1a723fd4c9f~mv2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Main Content Container - 9:16 Vertical Layout */}
      <div className="relative w-full h-full flex flex-col items-center justify-between py-8 px-4 text-white font-paragraph selection:bg-[#00eaff] selection:text-black overflow-y-auto">
        
        {/* TOP SECTION - Logo & Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center flex-shrink-0"
        >
          {/* Icon/Crest */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-lg bg-black/40 border border-[#FF4500]/30 shadow-[0_0_15px_rgba(255,69,0,0.2)]">
            <Crown className="w-8 h-8 text-[#FF4500] drop-shadow-[0_0_8px_rgba(255,69,0,0.8)]" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-6 border-l-2 border-t-2 border-[#FF4500]/50 rounded-tl-md" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-6 border-r-2 border-t-2 border-[#FF4500]/50 rounded-tr-md" />
          </div>

          {/* Typography */}
          <div className="flex flex-col gap-1">
            <h1
              className="font-heading font-black text-2xl tracking-[2px] uppercase m-0 leading-tight"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #FF0000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 0px 8px rgba(255,69,0,0.6))'
              }}
            >
              DOMÍNIO DO
            </h1>
            <h1
              className="font-heading font-black text-2xl tracking-[2px] uppercase m-0 leading-tight"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #FF0000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 0px 8px rgba(255,69,0,0.6))'
              }}
            >
              COMANDO
            </h1>
          </div>
          <span className="font-heading font-bold text-sm tracking-[3px] uppercase text-[#00eaff] drop-shadow-[0_0_5px_rgba(0,234,255,0.8)]">
            GIRO NO ASFALTO
          </span>
        </motion.div>

        {/* MIDDLE SECTION - Avatar & Player Info */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6 flex-shrink-0"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 relative">
            {/* Decorative HUD Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[110px] h-[110px] rounded-full border border-[#00eaff]/30 border-dashed pointer-events-none"
            />

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('avatar-input')?.click()}
              className="relative w-[90px] h-[90px] rounded-full cursor-pointer group z-10"
            >
              {/* Neon Border & Glow */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#00eaff] shadow-[0_0_15px_rgba(0,234,255,0.6),inset_0_0_10px_rgba(0,234,255,0.4)] z-10 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,234,255,0.8),inset_0_0_15px_rgba(0,234,255,0.6)]" />

              {/* Image */}
              <Image 
                src={DEFAULT_AVATAR} 
                alt="Avatar do Jogador" 
                className="w-full h-full object-cover rounded-full relative z-0" 
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </div>
            </motion.div>

            {/* Hidden File Input */}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
            />

            {/* Decorative bracket below avatar */}
            <div className="w-24 h-1 bg-gradient-to-r from-[#00eaff] to-transparent relative overflow-hidden rounded-full shadow-[0_0_10px_rgba(0,234,255,0.6)]">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-[#00eaff] animate-pulse rounded-full" />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-[#00eaff] animate-pulse rounded-full" />
            </div>
          </div>

          {/* Player Info */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs text-[#00eaff]/70 font-paragraph tracking-widest uppercase">
              Status: Online
            </span>
            <div className="flex items-center gap-2 justify-center">
              <span className="font-heading font-bold text-lg text-white tracking-wider drop-shadow-[0_0_5px_rgba(0,234,255,0.5)]">
                {playerId ? 'COMANDANTE' : 'NOVO JOGADOR'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM SECTION - Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4 w-full max-w-xs flex-shrink-0"
        >
          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#FF4500] to-[#FF0000] text-white font-heading font-bold text-base tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(255,69,0,0.4)] hover:shadow-[0_0_30px_rgba(255,69,0,0.6)] transition-all duration-300 border border-[#FF4500]/50"
          >
            Entrar no Jogo
          </motion.button>

          {/* Secondary Info */}
          <div className="text-center text-xs text-[#00eaff]/60 font-paragraph">
            <p>Bem-vindo ao Domínio do Comando</p>
            <p className="mt-1">Prepare-se para a batalha</p>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-4 mt-4 border-t border-white/10 pt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-white/80 hover:text-white transition-colors group"
            >
              <Bell className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4500] rounded-full shadow-[0_0_5px_rgba(255,69,0,0.8)]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white transition-all duration-300 group"
            >
              <Settings className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(0,234,255,0.8)]" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
