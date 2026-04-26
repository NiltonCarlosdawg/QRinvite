import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Settings, Gift, Facebook, Instagram, Youtube, Twitter, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative">
      
      {/* Elegante fundo subtil com textura floral ou gradiente suave */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0" style={{
        backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(184, 149, 106, 0.15), transparent 60%), radial-gradient(ellipse at 80% 120%, rgba(74, 93, 35, 0.1), transparent 50%)',
      }}></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-champagne-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 border border-champagne-400 rounded-full flex items-center justify-center bg-pearl-50">
                  <Sparkles className="w-5 h-5 text-champagne-600" />
                </div>
                <span className="text-2xl font-script tracking-wider text-olive-800">
                  Digital Invites
                </span>
              </motion.div>
            </Link>

            <nav className="flex gap-2">
              {[
                { path: '/', label: 'Meus Convites', icon: Gift },
                { path: '/criar', label: 'Criar Convite', icon: Plus },
                { path: '/gerenciar', label: 'Gerenciar', icon: Settings },
                { path: '/sobre', label: 'Sobre', icon: Sparkles }
              ].map((tab) => {
                const isActive = currentPath === tab.path || (currentPath !== '/' && tab.path !== '/' && currentPath.startsWith(tab.path));
                return (
                  <Link key={tab.path} to={tab.path}>
                    <button
                      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? 'bg-olive-800 text-pearl-50 shadow-md hover:shadow-lg hover:bg-olive-700'
                          : 'bg-transparent text-olive-700 hover:bg-olive-100/80'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden md:inline font-medium text-sm">{tab.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer base no layout de referência */}
      <footer className="relative z-10 bg-olive-800 text-pearl-100 border-t border-olive-900 mt-auto shadow-inner">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* Redes Sociais */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-pearl-100 flex items-center justify-center hover:bg-pearl-100 hover:text-olive-800 hover:scale-110 transition-all shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-pearl-100 flex items-center justify-center hover:bg-pearl-100 hover:text-olive-800 hover:scale-110 transition-all shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-pearl-100 flex items-center justify-center hover:bg-pearl-100 hover:text-olive-800 hover:scale-110 transition-all shadow-sm">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-pearl-100 flex items-center justify-center hover:bg-pearl-100 hover:text-olive-800 hover:scale-110 transition-all shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-pearl-100 flex items-center justify-center hover:bg-pearl-100 hover:text-olive-800 hover:scale-110 transition-all shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>

            <h3 className="text-sm tracking-[0.2em] uppercase font-semibold">Nossas Redes</h3>
            
            <div className="w-16 h-[1px] bg-champagne-400/50 mt-2"></div>
            
            <p className="text-olive-200/60 text-xs mt-2">
              &copy; {new Date().getFullYear()} Digital Invites. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}