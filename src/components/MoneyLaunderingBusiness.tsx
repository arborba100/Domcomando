import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { MoneyLaunderingBusinesses } from '@/entities';
import { Zap, TrendingUp } from 'lucide-react';

interface MoneyLaunderingBusinessProps {
  business?: MoneyLaunderingBusinesses;
  businessId?: string;
  businessName?: string;
  initialValue?: number;
  initialRate?: number;
  baseTime?: number;
  businessImage?: string;
  currentRate?: number;
  currentMaxValue?: number;
  currentTimeMultiplier?: number;
  onOperationComplete?: () => void;
  onPurchase?: (business: MoneyLaunderingBusinesses) => void;
  isPurchased?: boolean;
}

export default function MoneyLaunderingBusiness({
  business,
  businessId,
  businessName,
  initialValue = 1000,
  initialRate = 10,
  baseTime = 1,
  businessImage,
  currentRate = 10,
  currentMaxValue = 0,
  currentTimeMultiplier = 1,
  onOperationComplete,
  onPurchase,
  isPurchased = false,
}: MoneyLaunderingBusinessProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [operationProgress, setOperationProgress] = useState(0);

  const formatMoney = (value: number) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return value.toString();
  };

  // Use business object if provided, otherwise use individual props
  const displayName = business?.businessName || businessName || 'Negócio';
  const displayValue = business?.initialValue || initialValue;
  const displayRate = business?.initialRate || initialRate;
  const displayTime = business?.baseTime || baseTime;
  const displayImage = business?.businessImage || businessImage;

  const handleStartOperation = () => {
    if (isOperating) return;
    setIsOperating(true);
    setOperationProgress(0);

    const duration = displayTime * 1000 * currentTimeMultiplier;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setOperationProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsOperating(false);
        setOperationProgress(0);
        if (onOperationComplete) {
          onOperationComplete();
        }
      }
    };

    updateProgress();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-lg overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm hover:border-cyan-400/60 transition-all"
    >
      {/* Business Image */}
      <div className="relative h-48 overflow-hidden bg-black/40">
        {displayImage && (
          <Image
            src={displayImage}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Status Badge */}
        {isPurchased && (
          <div className="absolute top-3 right-3 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-bold">
            ✓ Adquirido
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="text-lg font-black text-cyan-300 uppercase tracking-wide">
          {displayName}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Initial Value */}
          <div className="bg-black/40 rounded-md p-2 border border-cyan-500/20">
            <div className="text-[10px] uppercase text-cyan-400/70 font-bold tracking-wider">
              Valor Inicial
            </div>
            <div className="text-sm font-black text-cyan-300 mt-1">
              ${formatMoney(displayValue)}
            </div>
          </div>

          {/* Initial Rate */}
          <div className="bg-black/40 rounded-md p-2 border border-cyan-500/20">
            <div className="text-[10px] uppercase text-cyan-400/70 font-bold tracking-wider">
              Taxa Inicial
            </div>
            <div className="text-sm font-black text-cyan-300 mt-1">
              {displayRate.toFixed(1)}%
            </div>
          </div>

          {/* Base Time */}
          <div className="bg-black/40 rounded-md p-2 border border-cyan-500/20">
            <div className="text-[10px] uppercase text-cyan-400/70 font-bold tracking-wider">
              Tempo Base
            </div>
            <div className="text-sm font-black text-cyan-300 mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {displayTime}s
            </div>
          </div>

          {/* Efficiency */}
          <div className="bg-black/40 rounded-md p-2 border border-cyan-500/20">
            <div className="text-[10px] uppercase text-cyan-400/70 font-bold tracking-wider">
              Eficiência
            </div>
            <div className="text-sm font-black text-cyan-300 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {(displayValue / displayTime).toFixed(0)}/s
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isOperating && (
          <div className="w-full bg-black/40 rounded-md h-2 overflow-hidden border border-cyan-500/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${operationProgress}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>
        )}

        {/* Action Button */}
        {onPurchase && !isPurchased && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPurchase(business || { _id: businessId || '', businessName: displayName, initialValue: displayValue, initialRate: displayRate, baseTime: displayTime, businessImage: displayImage })}
            className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-2 rounded-md uppercase text-xs tracking-wider transition-all"
          >
            Adquirir Negócio
          </motion.button>
        )}

        {isPurchased && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartOperation}
            disabled={isOperating}
            className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-black py-2 rounded-md uppercase text-xs tracking-wider transition-all"
          >
            {isOperating ? `Operando... ${operationProgress.toFixed(0)}%` : 'Iniciar Operação'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
