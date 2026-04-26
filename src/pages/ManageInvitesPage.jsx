import React, { useMemo, useState } from 'react';
import { Calendar, Check, QrCode, Search, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInvite } from '../hooks/useInvite';

export default function ManageInvitesPage() {
  const { invites, deleteInvite, verifyInvite } = useInvite();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [validatingCode, setValidatingCode] = useState('');

  const mappedInvites = invites.map((invite) => ({
    ...invite,
    status: Number(invite.utilizado) === 1 ? 'used' : 'valid',
    rsvpStatus: invite.rsvp_status || 'Pendente',
    viewed: Number(invite.visualizado) === 1,
    fullName: invite.nome_convidado1 + (invite.nome_convidado2 ? ` & ${invite.nome_convidado2}` : ''),
  }));

  const filteredInvites = useMemo(() => {
    return mappedInvites
      .filter((invite) => {
        if (filterStatus === 'used') return invite.status === 'used';
        if (filterStatus === 'valid') return invite.status === 'valid';
        return true;
      })
      .filter((invite) => {
        const lower = searchTerm.toLowerCase();
        return (
          invite.fullName.toLowerCase().includes(lower) ||
          invite.qr_code.toLowerCase().includes(lower) ||
          invite.nome_evento.toLowerCase().includes(lower)
        );
      });
  }, [mappedInvites, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const events = new Set(mappedInvites.map((invite) => invite.nome_evento));
    const viewedCount = mappedInvites.filter((invite) => invite.viewed).length;
    const confirmedCount = mappedInvites.filter((invite) => invite.rsvpStatus === 'Confirmado').length;
    return { events: events.size, viewedCount, confirmedCount };
  }, [mappedInvites]);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este convite?')) {
      deleteInvite(id);
    }
  };

  const handleManualValidate = async (qrCode) => {
    try {
      setValidatingCode(qrCode);
      const result = await verifyInvite(qrCode);
      window.alert(result?.mensagem || 'Convite validado com sucesso.');
    } catch (error) {
      window.alert(error.message || 'Não foi possível validar o convite.');
    } finally {
      setValidatingCode('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-script text-olive-800 mb-2">Gerenciamento</h1>
        <div className="w-16 h-[1px] bg-champagne-400 mx-auto mb-4"></div>
        <p className="text-lg text-olive-600/80 font-sans">Acompanhe convites, RSVP, visualizações e check-in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Calendar className="w-5 h-5" />} value={stats.events} label="Eventos Ativos" />
        <StatCard icon={<Users className="w-5 h-5" />} value={stats.viewedCount} label="Visualizados" />
        <StatCard icon={<Check className="w-5 h-5" />} value={stats.confirmedCount} label="RSVP Confirmado" />
      </div>

      <div className="bg-pearl-50 border border-champagne-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-olive-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, QR code ou evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 placeholder-olive-400/60 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-champagne-300 rounded-lg text-olive-800 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 transition-colors text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="valid">Válidos</option>
            <option value="used">Utilizados</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-champagne-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pearl-100 border-b border-champagne-200">
              <tr>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm">Convidado(s)</th>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm">Evento</th>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm">QR Code</th>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm">RSVP</th>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm">Status</th>
                <th className="px-6 py-4 font-serif text-olive-800 tracking-wide text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-100">
              {filteredInvites.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-olive-500/70 font-sans">
                    Nenhum convite encontrado.
                  </td>
                </tr>
              ) : (
                filteredInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-pearl-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-olive-800">{invite.nome_convidado1}</div>
                      {invite.nome_convidado2 && <div className="text-xs text-olive-500 mt-1">{invite.nome_convidado2}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-olive-700">{invite.nome_evento}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-champagne-500" />
                        <span className="font-mono text-xs text-olive-600">{invite.qr_code.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-pearl-50 text-olive-700 border border-champagne-200 text-xs font-medium">
                        {invite.rsvpStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invite.status === 'valid' ? (
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium">Válido</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">Utilizado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => handleManualValidate(invite.qr_code)}
                          disabled={invite.status === 'used' || validatingCode === invite.qr_code}
                          className="px-3 py-1.5 rounded-md bg-green-700 text-white text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {validatingCode === invite.qr_code ? 'Validando...' : 'Confirmar uso'}
                        </button>
                        <Link
                          to={`/validar/${invite.qr_code}`}
                          className="px-3 py-1.5 rounded-md bg-olive-800 text-pearl-50 text-xs font-medium hover:bg-olive-700 transition-colors"
                        >
                          Abrir link
                        </Link>
                        <button
                          onClick={() => handleDelete(invite.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-pearl-50 border border-champagne-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-serif text-olive-800">{value}</div>
        <div className="text-xs uppercase tracking-wider text-olive-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
