import { motion, AnimatePresence } from 'framer-motion';

interface SpinVaultNotificationProps {
  show: boolean;
  amount: number;
}

export default function SpinVaultNotification({ show, amount }: SpinVaultNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg shadow-lg border-2 border-yellow-300">
            <p className="text-white font-heading text-xl font-bold">
              + {amount} Giros
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
