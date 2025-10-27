import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { listarConvites } from '../services/api.js';
import { 
    SearchIcon, UsersIcon, CheckCircleIcon, XCircleIcon, TicketIcon, 
    InboxIcon, EyeIcon, XIcon, ClipboardCopyIcon, TrashIcon 
} from '../components/icons.jsx';
import './ManageInvitesPage.css';

// QR Code Generator Component
// This component relies on the qrcode.js library being loaded globally via a <script> tag.
const QRCode = ({ text, size = 160 }) => {
    const qrCodeRef = useRef(null);

    useEffect(() => {
        // Ensure the global QRCode library is available
        if (qrCodeRef.current && typeof window.QRCode !== 'undefined') {
            // Clear any previous QR code
            qrCodeRef.current.innerHTML = '';
            
            // Generate the new QR code
            new window.QRCode(qrCodeRef.current, {
                text: text,
                width: size,
                height: size,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: window.QRCode.CorrectLevel.H
            });
        }
    }, [text, size]);

    return <div ref={qrCodeRef} className="qr-code-container"></div>;
};

const FilterStatus = {
  ALL: 'all',
  VALID: 'valid',
  USED: 'used',
};

const Header = () => (
    <header className="page-header">
      <h1 className="header-title">Gerenciamento de Convites</h1>
      <nav className="header-subnav">
        <a href="#" className="header-subnav-link header-subnav-link--active">Dashboard</a>
        <a href="#" className="header-subnav-link">Eventos</a>
        <a href="#" className="header-subnav-link">Configurações</a>
      </nav>
      <p className="header-subtitle">
        Acompanhe, pesquise e filtre todos os convites do seu evento em um só lugar.
      </p>
    </header>
);

const StatCard = ({ icon, value, label, type }) => (
  <div className={`stat-card stat-card--${type}`}>
    <div className="stat-card-icon-wrapper">
      {icon}
    </div>
    <div className="stat-card-info">
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  </div>
);

const InviteModal = ({ invite, onClose }) => {
    if (!invite) return null;

    const handleModalContentClick = (e) => e.stopPropagation();

    return (
        <div 
            className="modal-overlay"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="modal-content"
                onClick={handleModalContentClick}
            >
                <button 
                    onClick={onClose} 
                    className="modal-close-button"
                    aria-label="Close modal"
                >
                    <XIcon className="icon-sm" />
                </button>
                
                <div className="modal-header">
                    <div className="modal-status-icon-wrapper">
                        {invite.utilizado ? (
                            <div className="icon-background icon-background--danger">
                                <XCircleIcon className="modal-status-icon modal-status-icon--danger" />
                            </div>
                        ) : (
                            <div className="icon-background icon-background--success">
                                <CheckCircleIcon className="modal-status-icon modal-status-icon--success" />
                            </div>
                        )}
                    </div>
                    <h2 className="modal-title">Detalhes do Convite</h2>
                    <p className="modal-subtitle">Informações completas do convite selecionado.</p>
                </div>
                
                <div className="modal-details">
                    <div className="detail-item">
                        <span className="detail-label">Convidado Principal:</span>
                        <span className="detail-value">{invite.nome_convidado1}</span>
                    </div>
                    {invite.nome_convidado2 && (
                         <div className="detail-item">
                            <span className="detail-label">Acompanhante:</span>
                            <span className="detail-value">{invite.nome_convidado2}</span>
                        </div>
                    )}
                    <div className="qr-code-section">
                        <QRCode text={invite.qr_code} />
                        <p className="qr-code-value">{invite.qr_code}</p>
                    </div>
                     <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${invite.utilizado ? 'status-badge--used' : 'status-badge--valid'}`}>
                            {invite.utilizado ? 'Utilizado' : 'Válido'}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Data de Criação:</span>
                        <span className="detail-value--small">{new Date(invite.data_criacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                
                 <div className="modal-footer">
                    <button 
                        onClick={onClose}
                        className="button button--primary button--full"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

const InviteRow = ({ invite, onView, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(invite.qr_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <tr className="table-row">
        <td className="table-cell">
          <div className="guest-name">{invite.nome_convidado1}</div>
          {invite.nome_convidado2 && <div className="guest-companion">{invite.nome_convidado2}</div>}
        </td>
        <td className="table-cell">
            <button 
                onClick={handleCopy}
                className="qr-code-button"
                title="Copiar QR Code"
            >
                {invite.qr_code}
                {copied ? <CheckCircleIcon className="icon-copy icon-copy--success"/> : <ClipboardCopyIcon className="icon-copy" />}
            </button>
        </td>
        <td className="table-cell">
          <span className={`status-badge ${invite.utilizado ? 'status-badge--used' : 'status-badge--valid'}`}>
            {invite.utilizado ? 'Utilizado' : 'Válido'}
          </span>
        </td>
        <td className="table-cell date-cell">
          {new Date(invite.data_criacao).toLocaleDateString('pt-BR')}
        </td>
        <td className="table-cell actions-cell">
            <div className="actions-container">
                 <button onClick={() => onView(invite)} className="action-button" title="Visualizar Detalhes">
                    <EyeIcon className="icon-xs" />
                </button>
                <button onClick={() => onDelete(invite.id)} className="action-button action-button--danger" title="Excluir Convite">
                    <TrashIcon className="icon-xs" />
                </button>
            </div>
        </td>
      </tr>
    );
};


const ManageInvitesPage = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.ALL);
  const [selectedInvite, setSelectedInvite] = useState(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listarConvites();
        setInvites(data);
      } catch (err) {
        setError(err.message || 'Ocorreu um erro.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);
  
  const handleDeleteInvite = useCallback((inviteId) => {
    if (window.confirm('Tem certeza que deseja excluir este convite? Esta ação não pode ser desfeita.')) {
        setInvites(prevInvites => prevInvites.filter(invite => invite.id !== inviteId));
    }
  }, []);

  const filteredInvites = useMemo(() => {
    return invites
      .filter(invite => {
        if (filterStatus === FilterStatus.USED) return invite.utilizado;
        if (filterStatus === FilterStatus.VALID) return !invite.utilizado;
        return true;
      })
      .filter(invite => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          invite.nome_convidado1.toLowerCase().includes(searchTermLower) ||
          (invite.nome_convidado2 && invite.nome_convidado2.toLowerCase().includes(searchTermLower)) ||
          invite.qr_code.toLowerCase().includes(searchTermLower)
        );
      });
  }, [invites, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = invites.length;
    const used = invites.filter(i => i.utilizado).length;
    const valid = total - used;
    return { total, used, valid };
  }, [invites]);
  
  const handleViewInvite = useCallback((invite) => {
    setSelectedInvite(invite);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedInvite(null);
  }, []);
  
  const FilterButton = ({ status, label }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`filter-button ${filterStatus === status ? 'filter-button--active' : '' }`}
    >
      {label}
    </button>
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="table-message-cell">
            <div className="loading-state">
               <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              <span>Carregando convites...</span>
            </div>
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan="5" className="table-message-cell">
            <div className="error-state">
              <XCircleIcon className="error-icon"/>
              <p className="error-title">Erro ao carregar os dados</p>
              <p className="error-message">{error}</p>
            </div>
          </td>
        </tr>
      );
    }
    if (filteredInvites.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="table-message-cell empty-cell">
            <div className="empty-state">
              <InboxIcon className="empty-icon"/>
              <p className="empty-title">Nenhum convite encontrado</p>
              <p className="empty-message">Tente ajustar sua busca/filtros ou adicione um novo convite para começar.</p>
               <button className="button button--primary">
                Criar Novo Convite
              </button>
            </div>
          </td>
        </tr>
      );
    }
    return filteredInvites.map(invite => (
      <InviteRow 
        key={invite.id} 
        invite={invite} 
        onView={handleViewInvite} 
        onDelete={handleDeleteInvite} 
      />
    ));
  };

  return (
    <div className="manage-invites-page">
      <div className="container">
        <Header />

        <section className="stats-grid">
          <StatCard icon={<TicketIcon className="icon-md" />} value={stats.total} label="Total de Convites" type="total" />
          <StatCard icon={<CheckCircleIcon className="icon-md" />} value={stats.valid} label="Convites Válidos" type="valid" />
          <StatCard icon={<UsersIcon className="icon-md" />} value={stats.used} label="Convites Utilizados" type="used" />
        </section>

        <main className="content-card">
          <div className="content-card-header">
            <div className="search-container">
                <div className="search-icon-wrapper">
                    <SearchIcon className="search-icon" />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou QR code..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="filter-controls">
                <FilterButton status={FilterStatus.ALL} label="Todos" />
                <FilterButton status={FilterStatus.VALID} label="Válidos" />
                <FilterButton status={FilterStatus.USED} label="Utilizados" />
            </div>
          </div>
          <div className="table-container">
            <table className="invites-table">
              <thead className="table-header">
                <tr>
                  <th scope="col" className="table-heading">Convidado(s)</th>
                  <th scope="col" className="table-heading">QR Code</th>
                  <th scope="col" className="table-heading">Status</th>
                  <th scope="col" className="table-heading">Data de Criação</th>
                  <th scope="col" className="table-heading text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {renderTableContent()}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <InviteModal invite={selectedInvite} onClose={handleCloseModal} />
    </div>
  );
};

export default ManageInvitesPage;