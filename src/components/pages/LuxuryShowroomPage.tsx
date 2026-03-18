import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CharacterDialog from '@/components/CharacterDialog';
import LuxuryShop from '@/components/LuxuryShop';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useGameStore } from '@/store/gameStore';
import { useLuxuryShopStore } from '@/store/luxuryShopStore';
import { useEffect } from 'react';

export default function LuxuryShowroomPage() {
  const { playerLevel } = useGameStore();
  const { openShop } = useLuxuryShopStore();

  // Automatically open the shop when this page loads
  useEffect(() => {
    openShop();
  }, [openShop]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CharacterDialog />
      <LuxuryShop />

      <Footer />
    </div>
  );
}
