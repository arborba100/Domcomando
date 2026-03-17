import { useEffect, useState } from 'react';
import { useSpinVaultStore } from '@/store/spinVaultStore';
import { usePlayerStore } from '@/store/playerStore';

export const useSpinVault = () => {
  const { spins, addSpins, deductSpins, initializeVault, getTimeUntilNextGain } = useSpinVaultStore();
  const { barracoLevel } = usePlayerStore();
  const [timeUntilNextGain, setTimeUntilNextGain] = useState(0);
  const [lastGainAmount, setLastGainAmount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Initialize vault on first login
  useEffect(() => {
    initializeVault(barracoLevel);
  }, [initializeVault, barracoLevel]);

  // Handle spin gain every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const gainAmount = Math.max(1, barracoLevel);
      addSpins(gainAmount);
      setLastGainAmount(gainAmount);
      setShowNotification(true);

      // Hide notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }, 60000);

    return () => clearInterval(interval);
  }, [barracoLevel, addSpins]);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNextGain(getTimeUntilNextGain());
    }, 100);

    return () => clearInterval(interval);
  }, [getTimeUntilNextGain]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  return {
    spins,
    barracoLevel,
    timeUntilNextGain,
    formatTime,
    deductSpins,
    lastGainAmount,
    showNotification,
  };
};
