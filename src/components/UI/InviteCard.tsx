import { motion, AnimatePresence } from 'motion/react';
import { Eye, Copy, Check, QrCode, Mail, User, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Invite {
  id: string;
  name: string;
  email: string;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
  createdAt: string;
  used: boolean;
}

interface InviteCardProps {
  invite: Invite;
  index: number;
}

export function InviteCard({ invite, index }: InviteCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    valid: { bg: 'bg-olive-50', border: 'border-olive-200', text: 'text-olive-700' },
    used: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
    expired: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' }
  };

  const colors = statusColors[invite.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-white border border-champagne-300 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-champagne-400 transition-all group"
    >
      <div className="relative z-10">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className={`px-3 py-1 ${colors.bg} border ${colors.border} rounded-full`}>
            <span className={`text-xs font-medium ${colors.text} flex items-center gap-1.5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
              {invite.status === 'valid' ? 'Válido' : invite.status === 'used' ? 'Utilizado' : 'Expirado'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setShowQR(!showQR); }}
              className="w-8 h-8 rounded-full bg-pearl-50 border border-champagne-200 hover:bg-champagne-50 flex items-center justify-center transition-colors"
            >
              <QrCode className="w-4 h-4 text-olive-600" />
            </button>

            <button
              className="w-8 h-8 rounded-full bg-pearl-50 border border-champagne-200 hover:bg-champagne-50 flex items-center justify-center transition-colors"
            >
              <Eye className="w-4 h-4 text-olive-600" />
            </button>
          </div>
        </div>

        {/* Guest Info */}
        <div className="space-y-1 mb-5 text-center">
          <p className="font-script text-3xl text-olive-800">{invite.name}</p>
          <p className="text-sm font-sans text-olive-500 uppercase tracking-widest">{invite.email}</p>
        </div>

        {/* QR Code Section */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-pearl-50 rounded-lg p-4 border border-champagne-200 flex flex-col items-center">
                <div className="w-24 h-24 bg-white border border-champagne-100 flex items-center justify-center mb-2">
                  <QrCode className="w-20 h-20 text-olive-900" />
                </div>
                <p className="text-xs text-olive-500 font-mono tracking-widest">{invite.qrCode.slice(0, 12)}...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code with Copy */}
        <div className="bg-pearl-50 rounded-lg p-3 mb-4 border border-champagne-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              <QrCode className="w-4 h-4 text-olive-400 flex-shrink-0" />
              <span className="text-sm text-olive-600 font-mono truncate">{invite.qrCode}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(invite.qrCode); }}
              className="w-7 h-7 rounded-md bg-white border border-champagne-200 hover:bg-champagne-50 flex items-center justify-center transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-olive-600" />
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-olive-400 font-sans border-t border-champagne-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Criado em {invite.createdAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
