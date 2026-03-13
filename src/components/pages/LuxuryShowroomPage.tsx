import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CharacterDialog from '@/components/CharacterDialog';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useGameStore } from '@/store/gameStore';

export default function LuxuryShowroomPage() {
  const { playerLevel } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CharacterDialog />

      {/* Hero Section with Background Image */}
      <section 
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden pt-[60px] md:pt-0 px-3 md:px-4"
        style={{
          backgroundColor: '#0f141e',
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {/* Background Image positioned to the right */}
        <div
          className="absolute inset-0 right-0 w-full md:w-2/3 lg:w-3/5 hidden md:block"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/50f4bf_def07b5c61e349e690e31dcd9acd4861~mv2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Content centered on page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <h1 className="font-heading text-3xl md:text-5xl lg:text-7xl text-amber-100 mb-4 md:mb-6 drop-shadow-lg">
            Luxo {playerLevel}
          </h1>
          <p className="font-paragraph text-base md:text-lg lg:text-2xl text-amber-200/90 drop-shadow-md">
            Bem-vindo à nossa vitrine exclusiva de experiências premium
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
