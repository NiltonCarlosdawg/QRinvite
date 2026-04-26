import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Gift, Check, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInvite } from '../hooks/useInvite';
import { AnimatedCounter } from '../components/UI/AnimatedCounter';
import { InviteCard } from '../components/UI/InviteCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { invites, error, clearError } = useInvite();

  const handlePreviewClick = (inviteId) => {
    navigate(`/convite/${inviteId}`);
  };

  const mappedInvites = invites.map(invite => ({
    id: invite.id.toString(),
    name: invite.nome_convidado1 + (invite.nome_convidado2 ? ` & ${invite.nome_convidado2}` : ''),
    email: invite.nome_evento,
    qrCode: invite.qr_code,
    status: invite.utilizado === 1 ? 'used' : 'valid',
    createdAt: invite.data_criacao,
    used: invite.utilizado === 1
  }));

  const stats = [
    { label: 'Total de Convites', value: mappedInvites.length, icon: Gift },
    { label: 'Convites Válidos', value: mappedInvites.filter(i => i.status === 'valid').length, icon: Check },
    { label: 'Convites Utilizados', value: mappedInvites.filter(i => i.used).length, icon: Users }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-script text-olive-800 mb-2">
          Meus Convites
        </h1>
        <div className="w-24 h-[1px] bg-champagne-400 mx-auto mb-6"></div>
        <p className="text-lg text-olive-600/80 font-sans max-w-2xl mx-auto">
          Crie, gerencie e compartilhe convites digitais de forma elegante e memorável.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 transition">Fechar</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-pearl-50 border border-champagne-200 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-olive-50 flex items-center justify-center mb-4 text-olive-600">
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-4xl font-serif text-olive-800 mb-2">
              <AnimatedCounter value={stat.value} />
            </div>
            <p className="text-sm font-medium text-olive-600/70 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Invites Grid */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-champagne-200 pb-4">
          <h2 className="text-2xl font-serif text-olive-800">Convites Recentes</h2>
          <button
            onClick={() => navigate('/criar')}
            className="px-6 py-2.5 bg-olive-800 hover:bg-olive-700 text-pearl-50 rounded-full font-medium shadow-sm flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Novo Convite
          </button>
        </div>

        {mappedInvites.length === 0 ? (
          <div className="text-center py-24 bg-pearl-50 rounded-2xl border border-champagne-200 border-dashed">
            <div className="w-20 h-20 mx-auto mb-4 bg-olive-50 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-champagne-500" />
            </div>
            <h3 className="text-xl font-serif text-olive-800 mb-2">Nenhum convite criado ainda</h3>
            <p className="text-olive-600/60 mb-6 font-sans">O seu primeiro evento inesquecível começa aqui.</p>
            <button
              onClick={() => navigate('/criar')}
              className="px-8 py-3 bg-olive-800 hover:bg-olive-700 text-pearl-50 rounded-full font-medium shadow-sm transition-colors"
            >
              Criar Meu Primeiro Convite
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedInvites.map((invite, index) => (
              <div key={invite.id} onClick={() => handlePreviewClick(invite.id)} className="cursor-pointer">
                <InviteCard invite={invite} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}