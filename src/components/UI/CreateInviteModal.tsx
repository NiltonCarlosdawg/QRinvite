import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, MapPin, Calendar, Clock, Gift, FileText } from 'lucide-react';

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvite: (inviteData: any) => Promise<void>;
}

export function CreateInviteModal({ isOpen, onClose, onCreateInvite }: CreateInviteModalProps) {
  const [formData, setFormData] = useState({
    nomeEvento: '',
    data: '',
    hora: '',
    local: '',
    descricao: '',
    nome1: '',
    nome2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onCreateInvite(formData);
      setFormData({
        nomeEvento: '',
        data: '',
        hora: '',
        local: '',
        descricao: '',
        nome1: '',
        nome2: ''
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar convite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive-900/40 backdrop-blur-sm z-50 overflow-y-auto"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto pt-20 pb-20">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="relative bg-pearl-50 rounded-2xl border border-champagne-300 overflow-hidden shadow-xl">
                
                {/* Header */}
                <div className="bg-olive-800 p-6 md:p-8 text-pearl-50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  }} />
                  <div className="relative flex items-center justify-between z-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif mb-1 flex items-center gap-3">
                        <Gift className="w-6 h-6 md:w-8 md:h-8 text-champagne-400" />
                        Criar Novo Convite
                      </h2>
                      <p className="text-olive-200 text-sm md:text-base font-sans">Preencha os detalhes do evento e do convidado</p>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full bg-olive-700/50 flex items-center justify-center hover:bg-olive-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Event Section */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-serif text-olive-800 border-b border-champagne-200 pb-2">Detalhes do Evento</h3>
                      
                      <div>
                        <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                          Nome do Evento *
                        </label>
                        <input
                          type="text"
                          value={formData.nomeEvento}
                          onChange={(e) => setFormData({ ...formData, nomeEvento: e.target.value })}
                          required
                          placeholder="Ex: Casamento Cleyton & Victoria"
                          className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-olive-500" />
                            Data *
                          </label>
                          <input
                            type="date"
                            value={formData.data}
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-olive-500" />
                            Hora *
                          </label>
                          <input
                            type="time"
                            value={formData.hora}
                            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-olive-500" />
                          Local do Evento *
                        </label>
                        <input
                          type="text"
                          value={formData.local}
                          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                          required
                          placeholder="Ex: Salão de Festas Ouro Branco"
                          className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-olive-500" />
                          Observações
                        </label>
                        <textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                          placeholder="Ex: Traje a rigor"
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm resize-none"
                        />
                      </div>
                    </div>

                    {/* Guests Section */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-serif text-olive-800 border-b border-champagne-200 pb-2">Convidados</h3>
                      
                      <div>
                        <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-olive-500" />
                          Convidado Principal *
                        </label>
                        <input
                          type="text"
                          value={formData.nome1}
                          onChange={(e) => setFormData({ ...formData, nome1: e.target.value })}
                          required
                          placeholder="Nome do convidado"
                          className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-olive-700 font-medium mb-1.5 text-sm flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-olive-300" />
                          Acompanhante (Opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.nome2}
                          onChange={(e) => setFormData({ ...formData, nome2: e.target.value })}
                          placeholder="Nome do acompanhante"
                          className="w-full px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 mt-8 border-t border-champagne-200">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-white border border-champagne-300 text-olive-700 rounded-lg font-medium hover:bg-pearl-100 transition-colors disabled:opacity-50 text-sm"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-olive-800 text-pearl-50 rounded-lg font-medium shadow-sm hover:bg-olive-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-pearl-100/30 border-t-pearl-100 rounded-full animate-spin" />
                      ) : (
                        <>Confirmar criação</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}