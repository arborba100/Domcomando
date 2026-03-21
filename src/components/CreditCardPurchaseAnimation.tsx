import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CreditCardPurchaseAnimationProps {
  isVisible: boolean;
  itemName: string;
  price: number;
  onComplete?: () => void;
}

export default function CreditCardPurchaseAnimation({
  isVisible,
  itemName,
  price,
  onComplete,
}: CreditCardPurchaseAnimationProps) {
  const [stage, setStage] = useState<'card' | 'processing' | 'success'>('card');

  useEffect(() => {
    if (isVisible) {
      setStage('card');
      
      // Transição para processamento após 1.5s
      const processingTimer = setTimeout(() => {
        setStage('processing');
      }, 1500);

      // Transição para sucesso após 3.5s
      const successTimer = setTimeout(() => {
        setStage('success');
      }, 3500);

      // Callback de conclusão após 5s
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 5000);

      return () => {
        clearTimeout(processingTimer);
        clearTimeout(successTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
        >
          {/* CARTÃO DE CRÉDITO */}
          {stage === 'card' && (
            <motion.div
              initial={{ scale: 0.8, rotateY: -90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-80 h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 rounded-2xl shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Efeito de brilho */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Chip do cartão */}
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Número do cartão */}
              <div className="relative z-10 space-y-2">
                <div className="flex gap-2 text-white/80 font-mono text-sm tracking-widest">
                  <span>•••• •••• •••• 2024</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-xs">TITULAR</p>
                    <p className="text-white font-bold text-sm">LUXURY BUYER</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">VÁLIDO ATÉ</p>
                    <p className="text-white font-bold text-sm">12/26</p>
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="relative z-10 text-right">
                <p className="text-white/80 font-bold text-lg">MASTERCARD</p>
              </div>
            </motion.div>
          )}

          {/* PROCESSAMENTO */}
          {stage === 'processing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Cartão em movimento */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-80 h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 rounded-2xl shadow-2xl p-6 flex flex-col justify-between relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                    <div className="w-2 h-2 bg-yellow-900 rounded-sm" />
                  </div>
                </div>
              </motion.div>

              {/* Spinner de processamento */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full"
              />

              {/* Texto de processamento */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-center"
              >
                <p className="text-white font-bold text-lg">Processando Pagamento</p>
                <p className="text-yellow-400 text-sm mt-2">{itemName}</p>
                <p className="text-white/60 text-sm mt-1">R$ {price.toLocaleString('pt-BR')}</p>
              </motion.div>
            </motion.div>
          )}

          {/* SUCESSO */}
          {stage === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Checkmark animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
              >
                <motion.svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <path d="M16 32L28 44L48 20" />
                </motion.svg>
              </motion.div>

              {/* Confete */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  animate={{
                    opacity: 0,
                    y: 100,
                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}

              {/* Texto de sucesso */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-white font-bold text-2xl">Compra Realizada!</p>
                <p className="text-yellow-400 text-lg mt-2 font-bold">{itemName}</p>
                <p className="text-green-400 text-sm mt-2">R$ {price.toLocaleString('pt-BR')}</p>
                <p className="text-white/60 text-xs mt-4">Transação aprovada</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
