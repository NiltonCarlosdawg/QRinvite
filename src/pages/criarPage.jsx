import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, Clock, FileText, Gift, Heart, Image, MapPin, MessageSquare, Plus, Sparkles, User, X } from 'lucide-react';
import { useInvite } from '../hooks/useInvite';

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultTimeline = [
  { id: createId(), titulo: 'Cerimónia na Igreja', horario: '15:00', local: '', mapsUrl: '' },
  { id: createId(), titulo: 'Copo-d\'água', horario: '18:00', local: '', mapsUrl: '' },
];

const defaultGuide = [
  { id: createId(), titulo: 'Seja pontual!', descricao: 'Chegue com antecedência para aproveitar cada momento.', icone: 'clock' },
  { id: createId(), titulo: 'Convidado não convida!', descricao: 'Respeite o limite definido no seu convite.', icone: 'users' },
  { id: createId(), titulo: 'Branco é a cor da noiva!', descricao: 'Prefira outras cores para manter o destaque da noiva.', icone: 'sparkles' },
  { id: createId(), titulo: 'Faça muitas fotos e Stories!', descricao: 'Celebre connosco e partilhe lembranças bonitas.', icone: 'camera' },
];

const defaultGifts = [
  { id: createId(), categoria: 'Sala', nome: 'Jogo de taças', link: '', reservado: false },
  { id: createId(), categoria: 'Cozinha', nome: 'Batedeira', link: '', reservado: false },
  { id: createId(), categoria: 'Lua de Mel', nome: 'Cota especial', link: '', reservado: false },
];

const themeOptions = [
  { value: 'floral', label: 'Floral Romântico' },
  { value: 'minimal', label: 'Minimal Elegante' },
  { value: 'classic', label: 'Clássico' },
];

const sectionCard = 'rounded-2xl border border-champagne-300 bg-white p-5 shadow-sm';

export default function CreateInvitePage() {
  const { createInvite } = useInvite();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastInvite, setLastInvite] = useState(null);
  const [formData, setFormData] = useState({
    nomeEvento: '',
    data: '',
    hora: '',
    local: '',
    localMapaUrl: '',
    descricao: '',
    nome1: '',
    nome2: '',
    fotoCasalUrl: '',
    versiculo: '',
    saveTheDateTema: 'floral',
    mensagemPersonalizada: '',
    limiteAcompanhantes: 0,
  });
  const [cronograma, setCronograma] = useState(defaultTimeline);
  const [manualConvidado, setManualConvidado] = useState(defaultGuide);
  const [listaPresentes, setListaPresentes] = useState(defaultGifts);

  const canAddCompanion = useMemo(() => Number(formData.limiteAcompanhantes) > 0, [formData.limiteAcompanhantes]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const invite = await createInvite({
        ...formData,
        nome2: formData.nome2 || null,
        cronograma,
        manualConvidado,
        listaPresentes,
        limiteAcompanhantes: Number(formData.limiteAcompanhantes) || 0,
      });

      setLastInvite(invite);
      setSuccess('Convite completo criado com sucesso.');
      setFormData({
        nomeEvento: '',
        data: '',
        hora: '',
        local: '',
        localMapaUrl: '',
        descricao: '',
        nome1: '',
        nome2: '',
        fotoCasalUrl: '',
        versiculo: '',
        saveTheDateTema: 'floral',
        mensagemPersonalizada: '',
        limiteAcompanhantes: 0,
      });
      setCronograma(defaultTimeline.map((item) => ({ ...item, id: createId() })));
      setManualConvidado(defaultGuide.map((item) => ({ ...item, id: createId() })));
      setListaPresentes(defaultGifts.map((item) => ({ ...item, id: createId() })));
    } catch (err) {
      setError(err.message || 'Erro ao criar convite.');
    } finally {
      setLoading(false);
    }
  };

  const updateListItem = (setter, list, id, field, value) => {
    setter(list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (setter, list, id) => {
    setter(list.filter((item) => item.id !== id));
  };

  const addTimelineItem = () => {
    setCronograma([...cronograma, { id: createId(), titulo: '', horario: '', local: '', mapsUrl: '' }]);
  };

  const addGuideItem = () => {
    setManualConvidado([...manualConvidado, { id: createId(), titulo: '', descricao: '', icone: 'heart' }]);
  };

  const addGiftItem = () => {
    setListaPresentes([...listaPresentes, { id: createId(), categoria: '', nome: '', link: '', reservado: false }]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-script text-olive-800 mb-2">Editor de Convite</h1>
        <div className="w-16 h-[1px] bg-champagne-400 mx-auto mb-4"></div>
        <p className="text-lg text-olive-600/80 font-sans">Monte a experiência completa do convidado em web e mobile.</p>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`mb-8 rounded-2xl border p-5 shadow-sm ${error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl mb-1">{error ? 'Falha ao criar convite' : 'Convite criado com sucesso'}</p>
                <p className="text-sm">{error || success}</p>
                {lastInvite && !error && (
                  <p className="mt-3 text-sm font-mono break-all">QR: {lastInvite.qr_code}</p>
                )}
              </div>
              <button onClick={() => { setError(''); setSuccess(''); }} className="p-1 rounded-full hover:bg-black/5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`${sectionCard} bg-pearl-50`}>
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-champagne-600" />
            <h2 className="text-xl font-serif text-olive-800">Save the Date</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-olive-700 mb-2">Tema visual</label>
              <select
                value={formData.saveTheDateTema}
                onChange={(e) => setFormData({ ...formData, saveTheDateTema: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-champagne-300"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-olive-700 mb-2">
                <Image className="w-4 h-4" />
                URL da foto do casal
              </label>
              <input
                value={formData.fotoCasalUrl}
                onChange={(e) => setFormData({ ...formData, fotoCasalUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-champagne-300"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center gap-3 mb-5">
            <Gift className="w-5 h-5 text-champagne-600" />
            <h2 className="text-xl font-serif text-olive-800">Informações Principais</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-olive-700 mb-2">Nome do Evento</label>
              <input required value={formData.nomeEvento} onChange={(e) => setFormData({ ...formData, nomeEvento: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="block text-sm text-olive-700 mb-2">Versículo / Citação</label>
              <input value={formData.versiculo} onChange={(e) => setFormData({ ...formData, versiculo: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-olive-700 mb-2"><Calendar className="w-4 h-4" />Data</label>
              <input type="date" required value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-olive-700 mb-2"><Clock className="w-4 h-4" />Hora</label>
              <input type="time" required value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-olive-700 mb-2"><MapPin className="w-4 h-4" />Local</label>
              <input required value={formData.local} onChange={(e) => setFormData({ ...formData, local: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="block text-sm text-olive-700 mb-2">Link do Google Maps</label>
              <input value={formData.localMapaUrl} onChange={(e) => setFormData({ ...formData, localMapaUrl: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" placeholder="https://maps.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-olive-700 mb-2"><FileText className="w-4 h-4" />Descrição / Dress code</label>
              <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg border border-champagne-300 resize-none" />
            </div>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-champagne-600" />
            <h2 className="text-xl font-serif text-olive-800">Convidados e RSVP</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-olive-700 mb-2">Convidado principal</label>
              <input required value={formData.nome1} onChange={(e) => setFormData({ ...formData, nome1: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="block text-sm text-olive-700 mb-2">Acompanhante</label>
              <input value={formData.nome2} onChange={(e) => setFormData({ ...formData, nome2: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
            </div>
            <div>
              <label className="block text-sm text-olive-700 mb-2">Limite de acompanhantes</label>
              <input type="number" min="0" max="10" value={formData.limiteAcompanhantes} onChange={(e) => setFormData({ ...formData, limiteAcompanhantes: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
              <p className="text-xs text-olive-500 mt-2">{canAddCompanion ? 'O convidado poderá indicar acompanhantes no RSVP.' : 'Sem acompanhante extra permitido.'}</p>
            </div>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-champagne-600" />
              <h2 className="text-xl font-serif text-olive-800">Itinerário do Dia</h2>
            </div>
            <button type="button" onClick={addTimelineItem} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-olive-800 text-pearl-50 text-sm">
              <Plus className="w-4 h-4" />
              Adicionar evento
            </button>
          </div>
          <div className="space-y-4">
            {cronograma.map((item) => (
              <div key={item.id} className="grid md:grid-cols-[1.1fr_0.6fr_1.1fr_1.2fr_auto] gap-3 items-end rounded-xl border border-champagne-200 p-4">
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Título</label>
                  <input value={item.titulo} onChange={(e) => updateListItem(setCronograma, cronograma, item.id, 'titulo', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Hora</label>
                  <input value={item.horario} onChange={(e) => updateListItem(setCronograma, cronograma, item.id, 'horario', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Local</label>
                  <input value={item.local} onChange={(e) => updateListItem(setCronograma, cronograma, item.id, 'local', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Link de mapa</label>
                  <input value={item.mapsUrl} onChange={(e) => updateListItem(setCronograma, cronograma, item.id, 'mapsUrl', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <button type="button" onClick={() => removeItem(setCronograma, cronograma, item.id)} className="px-3 py-3 rounded-lg border border-red-200 text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-champagne-600" />
              <h2 className="text-xl font-serif text-olive-800">Manual do Convidado</h2>
            </div>
            <button type="button" onClick={addGuideItem} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-olive-800 text-pearl-50 text-sm">
              <Plus className="w-4 h-4" />
              Adicionar dica
            </button>
          </div>
          <div className="space-y-4">
            {manualConvidado.map((item) => (
              <div key={item.id} className="grid md:grid-cols-[0.9fr_1fr_1.8fr_auto] gap-3 items-end rounded-xl border border-champagne-200 p-4">
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Ícone</label>
                  <input value={item.icone} onChange={(e) => updateListItem(setManualConvidado, manualConvidado, item.id, 'icone', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Título</label>
                  <input value={item.titulo} onChange={(e) => updateListItem(setManualConvidado, manualConvidado, item.id, 'titulo', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Descrição</label>
                  <input value={item.descricao} onChange={(e) => updateListItem(setManualConvidado, manualConvidado, item.id, 'descricao', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <button type="button" onClick={() => removeItem(setManualConvidado, manualConvidado, item.id)} className="px-3 py-3 rounded-lg border border-red-200 text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-champagne-600" />
              <h2 className="text-xl font-serif text-olive-800">Lista de Presentes</h2>
            </div>
            <button type="button" onClick={addGiftItem} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-olive-800 text-pearl-50 text-sm">
              <Plus className="w-4 h-4" />
              Adicionar item
            </button>
          </div>
          <div className="space-y-4">
            {listaPresentes.map((item) => (
              <div key={item.id} className="grid md:grid-cols-[1fr_1.4fr_1.8fr_auto] gap-3 items-end rounded-xl border border-champagne-200 p-4">
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Categoria</label>
                  <input value={item.categoria} onChange={(e) => updateListItem(setListaPresentes, listaPresentes, item.id, 'categoria', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Presente</label>
                  <input value={item.nome} onChange={(e) => updateListItem(setListaPresentes, listaPresentes, item.id, 'nome', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <div>
                  <label className="block text-sm text-olive-700 mb-2">Link externo</label>
                  <input value={item.link} onChange={(e) => updateListItem(setListaPresentes, listaPresentes, item.id, 'link', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-champagne-300" />
                </div>
                <button type="button" onClick={() => removeItem(setListaPresentes, listaPresentes, item.id)} className="px-3 py-3 rounded-lg border border-red-200 text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center gap-3 mb-5">
            <MessageSquare className="w-5 h-5 text-champagne-600" />
            <h2 className="text-xl font-serif text-olive-800">Mensagem para Ti</h2>
          </div>
          <textarea
            value={formData.mensagemPersonalizada}
            onChange={(e) => setFormData({ ...formData, mensagemPersonalizada: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-champagne-300 resize-none"
            placeholder="Uma mensagem íntima e personalizada para os convidados..."
          />
        </div>

        <div className="pb-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 rounded-2xl bg-olive-800 text-pearl-50 text-lg font-medium shadow-md hover:bg-olive-700 disabled:opacity-60"
          >
            {loading ? 'A criar convite...' : 'Criar Experiência Completa do Convite'}
          </button>
        </div>
      </form>
    </div>
  );
}
