import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chrome, Facebook, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    const logged = localStorage.getItem('playerLoggedIn');
    const intro = localStorage.getItem('hasSeenHomeIntro');

    if (logged === 'true') {
      navigate('/star-map');
      return;
    }

    if (!intro) {
      setShowIntro(true);
    } else {
      setReady(true);
    }
  }, []);

  const finishIntro = () => {
    localStorage.setItem('hasSeenHomeIntro', 'true');
    setShowIntro(false);
    setTimeout(() => setReady(true), 300);
  };

  const login = (type: string) => {
    setIsLoading(type);
    setTimeout(() => {
      localStorage.setItem('playerLoggedIn', 'true');
      navigate('/star-map');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* 🎥 VIDEO FUNDO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://cdn.coverr.co/videos/coverr-night-driving-traffic-5176/1080p.mp4" type="video/mp4" />
      </video>

      {/* ESCURECIMENTO */}
      <div className="absolute inset-0 bg-black/70" />

      {/* 🚨 LUZ POLÍCIA */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255,0,0,0.2), transparent)',
            'radial-gradient(circle at 80% 50%, rgba(0,0,255,0.2), transparent)',
          ],
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* 🚁 HELICÓPTERO LIGHT */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{
          backgroundPosition: ['-20% 0%', '120% 0%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          backgroundSize: '40% 100%',
        }}
      />

      {/* 💸 DINHEIRO VOANDO */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-400 text-2xl"
          initial={{ y: 600, x: Math.random() * 1000 }}
          animate={{ y: -100 }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          💸
        </motion.div>
      ))}

      {/* 🎬 INTRO */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <h1 className="text-6xl font-black text-yellow-400 mb-4">
                DOMÍNIO
              </h1>
              <h2 className="text-4xl text-red-500 font-bold">
                DO COMANDO
              </h2>

              <button
                onClick={finishIntro}
                className="mt-10 px-8 py-4 bg-yellow-500 text-black font-bold rounded"
              >
                ENTRAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔐 LOGIN */}
      {ready && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">

          <h1 className="text-5xl font-black text-yellow-400 mb-10">
            DOMÍNIO DO COMANDO
          </h1>

          <div className="bg-black/70 p-8 rounded-xl backdrop-blur-md border border-yellow-500/30">

            <button
              onClick={() => login('google')}
              className="w-full flex items-center gap-3 mb-4 px-6 py-4 bg-white/10 hover:bg-white/20 rounded"
            >
              <Chrome /> Entrar com Google
            </button>

            <button
              onClick={() => login('facebook')}
              className="w-full flex items-center gap-3 mb-4 px-6 py-4 bg-blue-600/30 hover:bg-blue-600/50 rounded"
            >
              <Facebook /> Entrar com Facebook
            </button>

            <button
              onClick={() => login('guest')}
              className="w-full flex items-center gap-3 px-6 py-4 bg-red-600/30 hover:bg-red-600/50 rounded"
            >
              <User /> Entrar como Visitante
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
