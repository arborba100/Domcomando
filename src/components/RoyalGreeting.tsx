import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface RoyalGreetingProps {
  playerName?: string;
  onComplete?: () => void;
}

export default function RoyalGreeting({ playerName = 'Rei do Comando', onComplete }: RoyalGreetingProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Play audio on mount
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio autoplay might be blocked
        console.log('Audio autoplay blocked');
      });
      setIsPlaying(true);
    }

    // Auto-complete after 8 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Light particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-sm">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        onEnded={() => setIsPlaying(false)}
      />

      {/* Animated background lights */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.1,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Radial light effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Main content container */}
      <motion.div
        className="relative z-10 text-center space-y-6 px-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          duration: 0.8,
        }}
      >
        {/* Crown icon animation */}
        <motion.div
          className="text-8xl mb-4"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          👑
        </motion.div>

        {/* Main greeting text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="font-heading text-7xl font-bold mb-2">
            <motion.span
              className="bg-gradient-to-r from-primary via-logo-gradient-end to-primary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              HOMENAGEM REAL
            </motion.span>
          </h1>
        </motion.div>

        {/* Player name with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-logo-gradient-end blur-2xl opacity-50 rounded-full"></div>
          <p className="relative font-heading text-5xl font-bold text-subtitle-neon-blue">
            {playerName}
          </p>
        </motion.div>

        {/* Subtitle text with typewriter effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-2xl text-foreground font-heading">
            Você é o Rei do Comando!
          </p>
          <p className="text-lg text-subtitle-neon-blue">
            Sua jornada alcançou o pico da glória
          </p>
        </motion.div>

        {/* Decorative lines */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent to-primary"
            animate={{
              scaleX: [0, 1],
            }}
            transition={{
              duration: 0.8,
              delay: 1.2,
            }}
          />
          <motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 1.2,
            }}
          />
          <motion.div
            className="w-24 h-1 bg-gradient-to-l from-transparent to-primary"
            animate={{
              scaleX: [0, 1],
            }}
            transition={{
              duration: 0.8,
              delay: 1.2,
            }}
          />
        </motion.div>

        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-2xl"
          animate={{
            opacity: [0.5, 0.2, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Corner light effects */}
      {[
        { top: 0, left: 0, rotate: 0 },
        { top: 0, right: 0, rotate: 90 },
        { bottom: 0, right: 0, rotate: 180 },
        { bottom: 0, left: 0, rotate: 270 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 bg-gradient-to-br from-primary to-transparent opacity-30 blur-2xl"
          style={{
            ...pos,
            transform: `rotate(${pos.rotate}deg)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Close button hint */}
      <motion.div
        className="absolute bottom-8 text-center text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          Clique para continuar...
        </motion.p>
      </motion.div>
    </div>
  );
}
