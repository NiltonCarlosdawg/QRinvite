import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Mock data (em produção viria de props) ---
const mockInvite = {
  id: 1,
  eventName: 'Casamento de Ana e Carlos',
  eventDate: '2025-12-20',
  eventTime: '19:30',
  eventLocation: 'Salão de Festas Ouro Branco - Rua das Flores, 123',
  description: 'Você está convidado para celebrar conosco este momento especial!',
  guestName1: 'João Silva',
  guestName2: 'Maria Silva',
  guests: ['João Silva', 'Maria Silva'],
  parents1: ['MÁRIO AMADO', 'DÁRIO GIOVANNY'],
  parents2: ['BRUNO EVANDRO', 'EUGÊNIO VALERY'],
  mainNames: 'Dedalo Silva & Rosa Amadel',
  ceremony: 'Realizar-se-á na Paróquia Nossa Senhora de Fátima (Ex São Domingo), às 14h00.',
  reception: 'Terá Lugar no Salão de Festas Silv Place\nLocalizado no Nova Vida Rua 45, às 16h00.',
  contact: '+Info: +244 923 923 965 | 930076341',
  quote: 'MULHERES, SEJAM SUBMISSAS CADA UMA A SEU MARIDO, COMO AO SENHOR, POIS O MARIDO É O CABEÇA DA MULHER, COMO TAMBÉM CRISTO É O CABEÇA DA IGREJA, QUE É O SEU CORPO, DO QUAL ELE É O SALVADOR.\nEFÉSIOS 5:23-24'
};

// --- SVG Icons ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// --- Input Components ---
const commonInputStyles = "bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-[#b8956a] focus:bg-white/30 rounded-md p-1 transition-all";

const EditableInput = ({ name, value, isEditing, onChange, className = '' }) => (
  <input
    type="text"
    name={name}
    value={value}
    disabled={!isEditing}
    onChange={onChange}
    className={`${commonInputStyles} ${isEditing ? 'cursor-text' : 'cursor-default'} ${className}`}
  />
);

const EditableTextarea = ({ name, value, isEditing, onChange, className = '' }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={value}
      disabled={!isEditing}
      onChange={onChange}
      rows={1}
      className={`${commonInputStyles} resize-none overflow-hidden ${isEditing ? 'cursor-text' : 'cursor-default'} ${className}`}
    />
  );
};

const ControlButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-4 py-2 bg-[#e9e0d7] text-[#5a3a2e] border border-[#d4bca9] rounded-lg shadow-sm hover:bg-[#d4bca9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a1806b] transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

// --- Main Component ---
const PreviewInvitePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  
  const [invitationData, setInvitationData] = useState({
    quote: mockInvite.quote,
    parents1: mockInvite.parents1,
    parents2: mockInvite.parents2,
    mainNames: mockInvite.mainNames,
    date: mockInvite.eventDate ? new Date(mockInvite.eventDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase().replace(/ DE /g, ' | ') : '',
    ceremony: mockInvite.ceremony,
    reception: mockInvite.reception,
    contact: mockInvite.contact,
  });

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js';
      script.onload = () => {
        const container = document.createElement('div');
        new window.QRCode(container, {
          text: JSON.stringify(mockInvite),
          width: 120,
          height: 120,
        });
        setTimeout(() => {
          const img = container.querySelector('img');
          if (img) setQrImage(img.src);
        }, 100);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInvitationData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleArrayChange = useCallback((arrayName, index, value) => {
    setInvitationData(prevData => {
      const newArray = [...prevData[arrayName]];
      newArray[index] = value;
      return {
        ...prevData,
        [arrayName]: newArray,
      };
    });
  }, []);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleSave = useCallback(() => setIsEditing(false), []);

  const handleDownload = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => {
        const element = document.getElementById('convite');
        window.html2canvas(element, { scale: 2, backgroundColor: '#faf7f2' }).then(canvas => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `Convite_${mockInvite.eventName}_${Date.now()}.png`;
          link.click();
        });
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Erro ao fazer download:', err);
    }
  };

  const handlePrint = useCallback(() => {
    setIsEditing(false);
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  const getInitials = (names) => {
    return names.split('&').map(n => n.trim()[0]).join('');
  };

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .invitation-container { 
            transform: scale(1) !important; 
            box-shadow: none !important;
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&display=swap');
        .font-great-vibes { font-family: 'Great Vibes', cursive; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* Header */}
      <div className="no-print w-full max-w-2xl mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Digital Invites</h1>
        <p className="text-gray-600">Pré-visualização do Convite</p>
      </div>

      {/* Controls */}
      <div className="no-print w-full max-w-2xl p-4 mb-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {isEditing ? (
            <ControlButton onClick={handleSave}><SaveIcon /> Concluído</ControlButton>
          ) : (
            <ControlButton onClick={handleEdit}><EditIcon /> Editar</ControlButton>
          )}
          <ControlButton onClick={handleDownload}><DownloadIcon /> Download</ControlButton>
          <ControlButton onClick={handlePrint}><PrintIcon /> Imprimir</ControlButton>
        </div>
      </div>

      {/* Invitation Card */}
      <div id="convite" className="invitation-container relative w-full max-w-2xl aspect-[9/16] shadow-2xl overflow-hidden flex flex-col items-center text-center font-cormorant" style={{
        background: 'linear-gradient(135deg, #f5ebe0 0%, #ecdcc8 25%, #f0e6d8 50%, #e8d5bf 75%, #f2e8db 100%)',
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(205, 180, 150, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(195, 165, 135, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(210, 185, 160, 0.08) 0%, transparent 70%),
          linear-gradient(135deg, #f5ebe0 0%, #ecdcc8 25%, #f0e6d8 50%, #e8d5bf 75%, #f2e8db 100%)
        `
      }}>
        
        {/* Floral Background Image Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url(https://i.imgur.com/8X9vK3m.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }}></div>

        <div className="relative z-10 flex flex-col items-center w-full h-full p-8 md:p-12">
          
          {/* Initials Logo */}
          <div className="font-great-vibes text-7xl text-[#b8956a] mb-4">
            {getInitials(invitationData.mainNames)}
          </div>

          {/* Quote */}
          <div className="text-[10px] leading-relaxed text-[#8b7355] max-w-md mb-6 px-4">
            <EditableTextarea 
              name="quote" 
              value={invitationData.quote} 
              isEditing={isEditing} 
              onChange={handleInputChange}
              className="text-[10px] leading-relaxed"
            />
          </div>

          {/* Blessing Header */}
          <div className="text-sm font-semibold text-[#8b6f47] tracking-wide mb-4">
            COM A BÊNÇÃO DE DEUS E DE SEUS FILHOS,
          </div>

          {/* Parents Names */}
          <div className="flex justify-center gap-16 mb-4 text-xs text-[#8b6f47]">
            <div className="text-center space-y-1">
              <EditableInput 
                name="parent1_1" 
                value={invitationData.parents1[0]} 
                isEditing={isEditing} 
                onChange={(e) => handleArrayChange('parents1', 0, e.target.value)}
                className="text-xs font-semibold"
              />
              <EditableInput 
                name="parent1_2" 
                value={invitationData.parents1[1]} 
                isEditing={isEditing} 
                onChange={(e) => handleArrayChange('parents1', 1, e.target.value)}
                className="text-xs font-semibold"
              />
            </div>
            <div className="text-center space-y-1">
              <EditableInput 
                name="parent2_1" 
                value={invitationData.parents2[0]} 
                isEditing={isEditing} 
                onChange={(e) => handleArrayChange('parents2', 0, e.target.value)}
                className="text-xs font-semibold"
              />
              <EditableInput 
                name="parent2_2" 
                value={invitationData.parents2[1]} 
                isEditing={isEditing} 
                onChange={(e) => handleArrayChange('parents2', 1, e.target.value)}
                className="text-xs font-semibold"
              />
            </div>
          </div>

          {/* Couple Names */}
          <div className="font-great-vibes text-5xl text-[#b8956a] mb-3">
            <EditableInput 
              name="mainNames" 
              value={invitationData.mainNames} 
              isEditing={isEditing} 
              onChange={handleInputChange}
              className="font-great-vibes text-5xl"
            />
          </div>

          {/* Invitation Text */}
          <div className="text-base text-[#6b5a47] mb-4">
            Convidam para o seu Enlace Matrimonial
          </div>

          {/* Divider */}
          <div className="w-64 h-[1px] bg-[#b8956a] mb-4"></div>

          {/* Date Section */}
          <div className="text-sm text-[#6b5a47] mb-2">A realizar-se no dia</div>
          <div className="text-2xl font-bold text-[#b8956a] tracking-widest mb-6">
            <EditableInput 
              name="date" 
              value={invitationData.date} 
              isEditing={isEditing} 
              onChange={handleInputChange}
              className="text-2xl font-bold tracking-widest"
            />
          </div>

          {/* Ceremony */}
          <div className="w-full mb-5">
            <div className="text-sm font-semibold text-[#8b6f47] tracking-wide mb-2">CERIMÔNIA RELIGIOSA</div>
            <div className="text-sm text-[#6b5a47] leading-relaxed">
              <EditableTextarea 
                name="ceremony" 
                value={invitationData.ceremony} 
                isEditing={isEditing} 
                onChange={handleInputChange}
                className="text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Reception */}
          <div className="w-full mb-8">
            <div className="text-sm font-semibold text-[#8b6f47] tracking-wide mb-2">COPO-D'ÁGUA</div>
            <div className="text-sm text-[#6b5a47] leading-relaxed">
              <EditableTextarea 
                name="reception" 
                value={invitationData.reception} 
                isEditing={isEditing} 
                onChange={handleInputChange}
                className="text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto w-full flex flex-col items-center">
            {/* Contact info */}
            <div className="text-center text-[10px] text-[#8b6f47] leading-tight mb-4">
              <strong>Por gentileza, não leve crianças<br/>É confirmar a Presença</strong>
              <div className="mt-1">
                <EditableInput 
                  name="contact" 
                  value={invitationData.contact} 
                  isEditing={isEditing} 
                  onChange={handleInputChange}
                  className="text-[10px]"
                />
              </div>
            </div>
            
            {/* QR Code centered */}
            <div className="flex flex-col items-center mb-4">
              {qrImage ? (
                <img src={qrImage} alt="QR Code" className="w-28 h-28 mb-1" />
              ) : (
                <div className="w-28 h-28 mb-1 bg-gray-200 flex items-center justify-center text-xs">
                  Carregando...
                </div>
              )}
              <div className="text-xs text-[#8b6f47] font-semibold">Endereço</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Details */}
      <div className="no-print mt-8 w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Detalhes do Convite</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Evento</p>
            <p className="font-semibold text-gray-800">{mockInvite.eventName}</p>
          </div>
          <div>
            <p className="text-gray-600">Data</p>
            <p className="font-semibold text-gray-800">{mockInvite.eventDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Hora</p>
            <p className="font-semibold text-gray-800">{mockInvite.eventTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Local</p>
            <p className="font-semibold text-gray-800">{mockInvite.eventLocation || 'Não especificado'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Convidados</p>
            <p className="font-semibold text-gray-800">{mockInvite.guests.join(', ') || 'Sem convidados específicos'}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PreviewInvitePage;