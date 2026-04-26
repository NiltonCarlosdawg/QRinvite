import { motion, AnimatePresence } from 'motion/react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export function NotificationToast({ message, type, isVisible, onClose }: NotificationToastProps) {
  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: { bg: 'from-emerald-500 to-green-500', border: 'border-emerald-500/50' },
    error: { bg: 'from-red-500 to-rose-500', border: 'border-red-500/50' },
    warning: { bg: 'from-orange-500 to-amber-500', border: 'border-orange-500/50' },
    info: { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-500/50' },
  };

  const Icon = icons[type];
  const color = colors[type];

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-6 right-6 z-[100]"
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${color.bg} opacity-30 rounded-2xl blur-xl`} />
            <div className={`relative bg-slate-900/95 backdrop-blur-xl border-2 ${color.border} rounded-2xl p-4 pr-12 min-w-[300px] shadow-2xl`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${color.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-medium">{message}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}