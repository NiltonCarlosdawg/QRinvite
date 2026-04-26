import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Gift,
  Heart,
  MapPin,
  Printer,
  Sparkles,
  Users,
} from 'lucide-react';
import { useInvite } from '../hooks/useInvite';

function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }

    const existingScript = document.getElementById('html2canvas-cdn');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.html2canvas), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'html2canvas-cdn';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const themeStyles = {
  floral: {
    hero: 'from-rose-100 via-amber-50 to-pink-100',
    accent: '#9d5a62',
  },
  minimal: {
    hero: 'from-stone-100 via-white to-zinc-100',
    accent: '#4b5563',
  },
  classic: {
    hero: 'from-amber-100 via-amber-50 to-orange-100',
    accent: '#8a5b35',
  },
};

const guideEmoji = {
  clock: '⏰',
  users: '👥',
  sparkles: '✨',
  camera: '📸',
  heart: '💛',
};

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    invites,
    loading,
    fetchInviteById,
    markInviteAsViewed,
    submitRsvp,
    reserveGift,
  } = useInvite();
  const [exporting, setExporting] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [giftLoadingId, setGiftLoadingId] = useState('');
  const [feedback, setFeedback] = useState('');

  const invite = useMemo(
    () => invites.find((item) => String(item.id) === String(id)),
    [invites, id]
  );

  const [rsvpForm, setRsvpForm] = useState({
    rsvpStatus: 'Confirmado',
    acompanhantesConfirmados: 0,
    restricoesAlimentares: '',
    observacoesRsvp: '',
  });

  useEffect(() => {
    if (!invite) {
      fetchInviteById(id).catch(() => {});
    }
  }, [fetchInviteById, id, invite]);

  useEffect(() => {
    if (invite) {
      setRsvpForm({
        rsvpStatus: invite.rsvp_status || 'Confirmado',
        acompanhantesConfirmados: invite.acompanhantes_confirmados || 0,
        restricoesAlimentares: invite.restricoes_alimentares || '',
        observacoesRsvp: invite.observacoes_rsvp || '',
      });
      if (!invite.visualizado) {
        markInviteAsViewed(invite.id).catch(() => {});
      }
    }
  }, [invite, markInviteAsViewed]);

  const inviteUrl = useMemo(() => {
    if (!invite) return '';
    const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
    return `${publicAppUrl}/validar/${invite.qr_code}`;
  }, [invite]);

  const countdown = useMemo(() => {
    if (!invite?.data_evento) return null;
    const target = new Date(`${invite.data_evento}T${invite.hora_evento || '00:00'}`);
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { dias: 0, horas: 0, minutos: 0 };

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    return { dias, horas, minutos };
  }, [invite]);

  const theme = themeStyles[invite?.save_the_date_tema || 'floral'] || themeStyles.floral;

  const handleExport = async () => {
    const element = document.getElementById('invite-export');
    if (!element || !invite) return;

    try {
      setExporting(true);
      const html2canvas = await loadHtml2Canvas();
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fffaf5' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `convite-${invite.nome_convidado1.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    } catch (error) {
      window.alert('Não foi possível exportar o convite.');
    } finally {
      setExporting(false);
    }
  };

  const handleRsvpSubmit = async (event) => {
    event.preventDefault();
    if (!invite) return;

    try {
      setRsvpLoading(true);
      setFeedback('');
      await submitRsvp(invite.id, {
        ...rsvpForm,
        acompanhantesConfirmados: Math.min(
          Number(rsvpForm.acompanhantesConfirmados) || 0,
          Number(invite.limite_acompanhantes) || 0
        ),
      });
      setFeedback('Presença atualizada com sucesso.');
    } catch (error) {
      setFeedback(error.message || 'Não foi possível atualizar o RSVP.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleReserveGift = async (giftId) => {
    if (!invite) return;

    try {
      setGiftLoadingId(giftId);
      setFeedback('');
      await reserveGift(invite.id, giftId, {
        reservadoPor: [invite.nome_convidado1, invite.nome_convidado2].filter(Boolean).join(' & '),
      });
      setFeedback('Presente reservado com sucesso.');
    } catch (error) {
      setFeedback(error.message || 'Não foi possível reservar este presente.');
    } finally {
      setGiftLoadingId('');
    }
  };

  const handlePrint = () => window.print();

  if (loading && !invite) {
    return <div className="text-center py-16 text-olive-700">A carregar convite...</div>;
  }

  if (!invite) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-serif text-olive-800 mb-3">Convite não encontrado</h1>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full bg-olive-800 text-pearl-50">
          Voltar
        </button>
      </div>
    );
  }

  const convidados = [invite.nome_convidado1, invite.nome_convidado2].filter(Boolean);
  const eventDate = invite.data_evento
    ? new Date(invite.data_evento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data por definir';

  return (
    <main className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 no-print">
        <div>
          <h1 className="text-4xl md:text-5xl font-script text-olive-800 mb-2">Convite Digital Interativo</h1>
          <p className="text-olive-600/80">Versão otimizada para convidados em telemóvel e web.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/')} className="px-5 py-3 rounded-full border border-champagne-300 bg-white text-olive-800 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button onClick={handlePrint} className="px-5 py-3 rounded-full border border-champagne-300 bg-white text-olive-800 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button onClick={handleExport} disabled={exporting} className="px-5 py-3 rounded-full bg-olive-800 text-pearl-50 flex items-center gap-2 disabled:opacity-60">
            <Download className="w-4 h-4" />
            {exporting ? 'A exportar...' : 'Exportar PNG'}
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div id="invite-export" className="space-y-8">
        <section className={`overflow-hidden rounded-[32px] bg-gradient-to-br ${theme.hero} border border-champagne-200 shadow-xl`}>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
            <div className="p-8 md:p-12">
              <p className="uppercase tracking-[0.35em] text-xs mb-4" style={{ color: theme.accent }}>Save the Date</p>
              <h2 className="text-5xl md:text-6xl font-serif text-olive-900 mb-4">{invite.nome_evento}</h2>
              <p className="text-lg text-olive-700 max-w-xl leading-relaxed mb-8">
                {invite.versiculo || invite.descricao_evento || 'Reservem esta data para celebrar connosco este grande dia.'}
              </p>

              {countdown && (
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {[
                    { label: 'Dias', value: countdown.dias },
                    { label: 'Horas', value: countdown.horas },
                    { label: 'Min', value: countdown.minutos },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white/75 border border-white p-4 text-center">
                      <div className="text-3xl font-serif text-olive-900">{item.value}</div>
                      <div className="text-xs uppercase tracking-[0.3em] text-olive-500 mt-2">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-[340px] bg-white/30 flex items-center justify-center p-6">
              {invite.foto_casal_url ? (
                <img
                  src={invite.foto_casal_url}
                  alt="Casal"
                  className="w-full max-w-md h-[360px] object-cover rounded-[28px] border border-white/70 shadow-lg"
                />
              ) : (
                <div className="w-full max-w-md h-[360px] rounded-[28px] border border-dashed border-white/70 bg-white/40 flex items-center justify-center text-olive-600 text-center p-8">
                  Adicione a foto do casal no editor para personalizar o Save the Date.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-champagne-200 bg-[#fffaf5] shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-8 md:p-12 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-champagne-200 text-[#7b5a3d] text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {invite.utilizado ? 'Convite usado no check-in' : 'Convite válido para entrada'}
              </div>

              <div className="text-center">
                <p className="uppercase tracking-[0.35em] text-[#9d7a57] text-xs mb-4">Convite Formal</p>
                <h3 className="text-5xl md:text-6xl font-serif text-[#6f4c33] mb-4">{convidados.join(' & ')}</h3>
                <p className="text-lg text-[#6d5846] max-w-2xl mx-auto leading-relaxed">
                  {invite.descricao_evento || 'É com muito amor que partilhamos este momento inesquecível.'}
                </p>
                {invite.versiculo && <p className="mt-5 italic text-[#8d7258]">{invite.versiculo}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <InfoCard icon={<Calendar className="w-5 h-5" />} title="Data" content={eventDate} />
                <InfoCard icon={<Clock className="w-5 h-5" />} title="Hora" content={invite.hora_evento || 'Hora por definir'} />
                <InfoCard icon={<MapPin className="w-5 h-5" />} title="Local" content={invite.local_evento || 'Local por definir'} />
                <InfoCard icon={<Users className="w-5 h-5" />} title="Acesso" content={`Até ${invite.limite_acompanhantes || 0} acompanhante(s)`} />
              </div>

              {invite.local_mapa_url && (
                <a
                  href={invite.local_mapa_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-olive-800 text-pearl-50"
                >
                  <MapPin className="w-4 h-4" />
                  Abrir localização no Google Maps
                </a>
              )}
            </div>

            <aside className="border-t lg:border-t-0 lg:border-l border-champagne-200 bg-white p-8 md:p-10 flex flex-col items-center justify-between">
              <div className="w-full rounded-[28px] bg-pearl-50 border border-champagne-200 p-6 text-center">
                <QRCodeSVG value={inviteUrl} size={220} level="H" includeMargin className="mx-auto" />
                <p className="mt-5 text-sm uppercase tracking-[0.25em] text-[#9d7a57]">QR de Validação</p>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-[#7b5a3d] font-medium break-all">{invite.qr_code}</p>
                <p className="mt-3 text-xs text-[#8d7258] break-all">{inviteUrl}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <div className="rounded-[28px] border border-champagne-200 bg-white shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Heart className="w-5 h-5 text-champagne-600" />
              <h4 className="text-2xl font-serif text-olive-800">Confirmar presença</h4>
            </div>
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-olive-700 mb-2">Estado</label>
                <select
                  value={rsvpForm.rsvpStatus}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, rsvpStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-champagne-300"
                >
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Recusado">Recusado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-olive-700 mb-2">Número de acompanhantes</label>
                <input
                  type="number"
                  min="0"
                  max={invite.limite_acompanhantes || 0}
                  value={rsvpForm.acompanhantesConfirmados}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, acompanhantesConfirmados: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-champagne-300"
                />
              </div>
              <div>
                <label className="block text-sm text-olive-700 mb-2">Restrições alimentares</label>
                <textarea
                  rows={3}
                  value={rsvpForm.restricoesAlimentares}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, restricoesAlimentares: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-champagne-300 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-olive-700 mb-2">Observações</label>
                <textarea
                  rows={3}
                  value={rsvpForm.observacoesRsvp}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, observacoesRsvp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-champagne-300 resize-none"
                />
              </div>
              <button type="submit" disabled={rsvpLoading} className="w-full px-6 py-3 rounded-full bg-olive-800 text-pearl-50 disabled:opacity-60">
                {rsvpLoading ? 'A confirmar...' : 'Enviar RSVP'}
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-champagne-200 bg-white shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-5 h-5 text-champagne-600" />
              <h4 className="text-2xl font-serif text-olive-800">Itinerário Interativo</h4>
            </div>
            <div className="space-y-4">
              {(invite.cronograma || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-champagne-200 bg-pearl-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-serif text-olive-800">{item.titulo}</p>
                      <p className="text-sm text-olive-600 mt-1">{item.horario} • {item.local}</p>
                    </div>
                    {item.mapsUrl && (
                      <a href={item.mapsUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-white border border-champagne-200 text-olive-700 text-sm">
                        Ver local
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-[28px] border border-champagne-200 bg-white shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Heart className="w-5 h-5 text-champagne-600" />
              <h4 className="text-2xl font-serif text-olive-800">Manual do Convidado</h4>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(invite.manual_convidado || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-champagne-200 bg-pearl-50 p-5">
                  <div className="text-2xl mb-3">{guideEmoji[item.icone] || '💫'}</div>
                  <p className="font-serif text-lg text-olive-800 mb-2">{item.titulo}</p>
                  <p className="text-sm text-olive-600 leading-relaxed">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-champagne-200 bg-white shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Gift className="w-5 h-5 text-champagne-600" />
              <h4 className="text-2xl font-serif text-olive-800">Lista de Presentes</h4>
            </div>
            <div className="space-y-4">
              {(invite.lista_presentes || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-champagne-200 bg-pearl-50 p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-olive-500">{item.categoria}</p>
                      <p className="font-serif text-lg text-olive-800 mt-2">{item.nome}</p>
                      {item.reservado && <p className="text-sm text-green-700 mt-2">Reservado por {item.reservadoPor}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-white border border-champagne-200 text-olive-700 text-sm">
                          Loja
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleReserveGift(item.id)}
                        disabled={item.reservado || giftLoadingId === item.id}
                        className="px-4 py-2 rounded-full bg-olive-800 text-pearl-50 text-sm disabled:opacity-50"
                      >
                        {giftLoadingId === item.id ? 'A reservar...' : item.reservado ? 'Reservado' : 'Reservar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {invite.mensagem_personalizada && (
          <section className="rounded-[28px] border border-champagne-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Heart className="w-5 h-5 text-champagne-600" />
              <h4 className="text-2xl font-serif text-olive-800">Mensagem para Ti</h4>
            </div>
            <p className="text-lg text-olive-700 leading-relaxed max-w-4xl">{invite.mensagem_personalizada}</p>
          </section>
        )}

        {feedback && (
          <div className="no-print rounded-2xl border border-champagne-200 bg-white px-5 py-4 text-olive-700 shadow-sm">
            {feedback}
          </div>
        )}
      </div>
    </main>
  );
}

function InfoCard({ icon, title, content }) {
  return (
    <div className="rounded-[24px] border border-[#dbc3a8] bg-white/70 p-6">
      <div className="flex items-center gap-2 text-[#a1805c] mb-3">
        {icon}
        <p className="text-xs uppercase tracking-[0.3em]">{title}</p>
      </div>
      <p className="text-xl text-[#5d4634] font-serif leading-snug">{content}</p>
    </div>
  );
}
