import React from 'react';
import { Sparkles, Gift, Eye, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-champagne-300 bg-pearl-50 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-champagne-600" />
        </div>

        <h1 className="text-4xl md:text-6xl font-script text-olive-800 mb-4">
          Digital Invites
        </h1>
        <p className="text-2xl font-serif text-olive-700 mb-4">A elegância dos convites digitais</p>
        <div className="w-24 h-[1px] bg-champagne-400 mx-auto mb-6"></div>
        <p className="text-lg text-olive-600/80 font-sans max-w-2xl mx-auto leading-relaxed">
          Gerencie seus eventos com a sofisticação e segurança que momentos especiais merecem. Uma plataforma pensada para tornar o envio de convites uma experiência memorável.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { title: 'QR Code Único', desc: 'Cada convidado recebe um código exclusivo para acesso seguro e rápido.', icon: Gift },
          { title: 'Acompanhamento', desc: 'Controle de presença em tempo real na portaria do evento.', icon: Eye },
          { title: 'Gestão Completa', desc: 'Organize listas, acompanhantes e detalhes do local em um só lugar.', icon: Settings }
        ].map((feature, i) => (
          <div
            key={feature.title}
            className="bg-white border border-champagne-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive-50 flex items-center justify-center text-olive-600 border border-olive-100">
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-olive-800 mb-3">{feature.title}</h3>
            <p className="text-sm font-sans text-olive-600/80 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-pearl-50 border border-champagne-200 rounded-2xl p-12 text-center shadow-sm">
        <h2 className="text-3xl font-serif text-olive-800 mb-4">Comece a Planejar</h2>
        <p className="text-olive-600/80 mb-8 font-sans max-w-lg mx-auto">
          Crie o seu primeiro convite digital agora mesmo e surpreenda os seus convidados com uma experiência moderna e sofisticada.
        </p>
        <button
          onClick={() => navigate('/criar')}
          className="px-8 py-3 bg-olive-800 hover:bg-olive-700 text-pearl-50 rounded-full font-medium shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Criar Meu Primeiro Convite
        </button>
      </div>
    </div>
  );
}