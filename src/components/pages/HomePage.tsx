import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Chrome, Facebook, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { usePlayerStore } from '@/store/playerStore';
import { BaseCrudService } from '@/integrations';

export default function HomePage() {
  const navigate = useNavigate();
  const { actions, member } = useMember();

  const { setPlayerId, setPlayerName, setIsGuest, setLevel } = usePlayerStore();

  const [introSeen, setIntroSeen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    const alreadyLogged = localStorage.getItem('playerLoggedIn') === 'true';
    const hasSeenIntro = localStorage.getItem('hasSeenHomeIntro') === 'true';

    if (alreadyLogged) {
      navigate('/star-map');
      return;
    }

    setIntroSeen(hasSeenIntro);
    setShowIntro(!hasSeenIntro);
    setShowLogin(hasSeenIntro);
  }, [navigate]);

  useEffect(() => {
    if (!showIntro) return;

    const t1 = setTimeout(() => {}, 1200);
    const t2 = setTimeout(() => {}, 2500);
    const t3 = setTimeout(() => {}, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showIntro]);

  useEffect(() => {
    if (!member) return;

    const memberNickname =
      member.profile?.nickname ||
      member.contact?.firstName ||
      member.loginEmail?.split('@')[0] ||
      'COMANDANTE';

    setPlayerName(memberNickname);
    setPlayerId(member._id || '');
    setIsGuest(false);
    setLevel(1);

    localStorage.setItem('playerLoggedIn', 'true');
    localStorage.setItem('playerName', memberNickname);
    localStorage.setItem('memberId', member._id || '');
    localStorage.setItem('isGuest', 'false');

    savePlayerData(member._id || '', memberNickname, false).finally(() => {
      navigate('/star-map');
    });
  }, [member, navigate, setIsGuest, setLevel, setPlayerId, setPlayerName]);

  const savePlayerData = async (memberId: string, playerNameValue: string, isGuest = false) => {
    try {
      const existingPlayers = await BaseCrudService.getAll<any>('players');
      const existingPlayer = existingPlayers.items?.find((p: any) => p.memberId === memberId);

      if (existingPlayer) {
        await BaseCrudService.update('players', {
          _id: existingPlayer._id,
          memberId,
          playerName: playerNameValue,
          lastSeen: new Date().toISOString(),
          isOnline: true,
          isGuest,
        });
      } else {
        await BaseCrudService.create('players', {
          _id: crypto.randomUUID(),
          memberId,
          playerName: playerNameValue,
          cleanMoney: 0,
          dirtyMoney: 0,
          level: 1,
          progress: 0,
          isGuest,
          isOnline: true,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
    }
  };

  const finishIntro = () => {
    localStorage.setItem('hasSeenHomeIntro', 'true');
    setShowIntro(false);
    setTimeout(() => setShowLogin(true), 250);
  };

  const handleMemberLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(provider);
      await actions.login();
    } catch (error) {
      console.error(`Falha no login ${provider}:`, error);
      setIsLoading(null);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading('guest');

      const guestName = `CONVIDADO_${Math.floor(Math.random() * 999999)}`;
      const guestId = `guest_${crypto.randomUUID()}`;

      setPlayerName(guestName);
      setPlayerId(guestId);
      setIsGuest(true);
      setLevel(1);

      localStorage.setItem('playerLoggedIn', 'true');
      localStorage.setItem('playerName', guestName);
      localStorage.setItem('memberId', guestId);
      localStorage.setItem('isGuest', 'true');

      await savePlayerData(guestId, guestName, true);
      navigate('/star-map');
    } catch (error) {
      console.error('Falha no login visitante:', error);
      setIsLoading(null);
    }
  };

  const overlayClass = useMemo(
    () =>
      'absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,0,0,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,190,0,0.15),transparent_22%),linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.25),rgba(0,0,0,0.82))]',
    [],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <style>{`
        .logo-gold {
          text-shadow:
            0 0 14px rgba(255,215,0,0.28),
            0 0 34px rgba(255,180,0,0.38),
            0 0 70px rgba(255,70,0,0.18);
        }
        .logo-red {
          text-shadow:
            0 0 14px rgba(255,0,0,0.30),
            0 0 30px rgba(255,70,0,0.42);
        }
        .glass-heavy {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .gold-frame {
          box-shadow:
            0 0 0 1px rgba(212,175,55,0.16),
            0 0 30px rgba(212,175,55,0.12),
            inset 0 0 24px rgba(212,175,55,0.05);
        }
        .cinema-vignette {
          background:
            radial-gradient(circle at center, transparent 18%, rgba(0,0,0,0.35) 56%, rgba(0,0,0,0.78) 100%);
        }
      `}</style>

      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center scale-[1.03]"
        >
          <source src="/gemini_generated_video_a5b427be.mp4" type="video/mp4" />
        </video>

        <div className={overlayClass} />
        <div className="absolute inset-0 cinema-vignette" />

        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.14, 0.28, 0.14],
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            background:
              'radial-gradient(circle at 10% 70%, rgba(255,0,0,0.18), transparent 18%), radial-gradient(circle at 88% 18%, rgba(0,110,255,0.14), transparent 16%)',
          }}
        />

        <motion.div
          className="absolute -left-1/4 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl"
          animate={{ x: ['-20%', '220%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/25" />

            <div className="relative flex min-h-screen items-center justify-center px-6">
              <div className="text-center max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: '0.6em' }}
                    animate={{ opacity: 1, letterSpacing: '0.35em' }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="text-[11px] md:text-sm uppercase tracking-[0.35em] text-white/55"
                  >
                    Rio de Janeiro // São Paulo
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="logo-gold mt-8 text-5xl md:text-8xl font-black uppercase tracking-[0.18em] text-yellow-400"
                  >
                    DOMÍNIO
                  </motion.h1>

                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 1.65 }}
                    className="logo-red mt-3 text-3xl md:text-6xl font-black uppercase tracking-[0.24em] text-red-500"
                  >
                    DO COMANDO
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 2.2 }}
                    className="mx-auto mt-10 max-w-4xl"
                  >
                    <p className="text-sm md:text-lg uppercase tracking-[0.24em] text-white/72">
                      Favela. Ostentação. Polícia. Perseguição. Tiros. Poder.
                    </p>
                    <p className="mt-4 text-[11px] md:text-sm uppercase tracking-[0.26em] text-white/38">
                      Quem domina o complexo, domina a cidade.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 3.1 }}
                    onClick={finishIntro}
                    whileHover={{ scale: 1.035, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-14 rounded-2xl border border-yellow-500/45 bg-gradient-to-r from-yellow-700 via-yellow-500 to-orange-600 px-10 py-4 md:px-14 md:py-5 text-sm md:text-base font-black uppercase tracking-[0.26em] text-black gold-frame"
                  >
                    Entrar na operação
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLogin && !showIntro && (
        <div className="relative z-30 flex min-h-screen items-end justify-center px-4 pb-12 pt-24 md:items-center md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[720px]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-yellow-500/10 blur-[120px]" />

            <div className="glass-heavy gold-frame relative overflow-hidden rounded-[34px] border border-yellow-500/28 bg-black/62 p-8 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.08),transparent_34%),radial-gradient(circle_at_100%_40%,rgba(255,0,0,0.05),transparent_25%)]" />

              <div className="relative z-10">
                <div className="text-center">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.42em] text-white/42">
                    Acesso multiplayer
                  </p>
                  <h1 className="logo-gold mt-4 text-3xl md:text-5xl font-black uppercase tracking-[0.16em] text-yellow-400">
                    DOMÍNIO DO COMANDO
                  </h1>
                  <p className="mt-5 text-xs md:text-sm uppercase tracking-[0.22em] text-white/52">
                    Escolha sua entrada no sistema.
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  <motion.button
                    whileHover={{ scale: 1.012, x: 2 }}
                    whileTap={{ scale: 0.988 }}
                    onClick={() => handleMemberLogin('google')}
                    disabled={!!isLoading}
                    className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-white transition-all hover:bg-white/10 disabled:opacity-50"
                  >
                    <Chrome className="h-5 w-5" />
                    <span className="font-black uppercase tracking-[0.18em]">
                      {isLoading === 'google' ? 'Conectando...' : 'Entrar com Google'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.012, x: 2 }}
                    whileTap={{ scale: 0.988 }}
                    onClick={() => handleMemberLogin('facebook')}
                    disabled={!!isLoading}
                    className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-blue-500/24 bg-blue-500/10 px-6 py-5 text-white transition-all hover:bg-blue-500/18 disabled:opacity-50"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="font-black uppercase tracking-[0.18em]">
                      {isLoading === 'facebook' ? 'Conectando...' : 'Entrar com Facebook'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.012, x: 2 }}
                    whileTap={{ scale: 0.988 }}
                    onClick={handleGuestLogin}
                    disabled={!!isLoading}
                    className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-red-500/24 bg-red-500/10 px-6 py-5 text-white transition-all hover:bg-red-500/18 disabled:opacity-50"
                  >
                    <UserCircle2 className="h-5 w-5" />
                    <span className="font-black uppercase tracking-[0.18em]">
                      {isLoading === 'guest' ? 'Entrando...' : 'Entrar como Visitante'}
                    </span>
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.24em] text-white/40">
                    A introdução acontece só no primeiro acesso. Depois entra direto no jogo até logout.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
