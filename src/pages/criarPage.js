// src/pages/criarPage.js
import React, { useState } from 'react';
import Modal from '../components/Common/Modal';
import { useModal } from '../hooks/useModal';
import { criarConvite } from '../services/api';
import './criarPage.css';

const CreateInvitePage = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    guestName1: '',
    guestName2: '',
    description: '',
  });

  const [invites, setInvites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInvite = async () => {
    if (!formData.eventName || !formData.eventDate || !formData.eventTime) {
      modal.openModal({
        title: 'Campos Obrigatórios',
        message: 'Preencha os campos obrigatórios: Nome do Evento, Data e Hora',
        type: 'danger',
        confirmText: 'OK',
      });
      return;
    }

    if (!formData.guestName1) {
      modal.openModal({
        title: 'Convidado Obrigatório',
        message: 'Adicione pelo menos o primeiro convidado',
        type: 'danger',
        confirmText: 'OK',
      });
      return;
    }

    try {
      setLoading(true);

      // Chama o backend para criar o convite com todos os dados do evento
const resultado = await criarConvite({
  nomeEvento: formData.eventName,
  data: formData.eventDate,
  hora: formData.eventTime,
  local: formData.eventLocation,
  descricao: formData.description,
  nome1: formData.guestName1,
  nome2: formData.guestName2 || null,
});


      // Adiciona informações do evento ao convite criado
      const newInvite = {
        id: resultado.convite.id,
        uuid: resultado.convite.uuid,
        qrCode: resultado.convite.qrCode,
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventLocation: formData.eventLocation,
        description: formData.description,
        nome_convidado1: resultado.convite.nome_convidado1,
        nome_convidado2: resultado.convite.nome_convidado2,
        guests: [resultado.convite.nome_convidado1, resultado.convite.nome_convidado2].filter(g => g),
      };

      setInvites(prev => [...prev, newInvite]);
      setShowSuccess(true);
      
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        guestName1: '',
        guestName2: '',
        description: '',
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      modal.openModal({
        title: 'Erro ao Criar Convite',
        message: error.message || 'Não foi possível criar o convite. Tente novamente.',
        type: 'danger',
        confirmText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-page">
      <div className="criar-container">
        {showSuccess && (
          <div className="success-alert">
            <span className="alert-icon">✓</span>
            <span className="alert-text">Convite criado com sucesso!</span>
            <button 
              className="alert-close"
              onClick={() => setShowSuccess(false)}
            >
              ×
            </button>
          </div>
        )}

        <div className="form-section">
          <h2 className="form-title">Criar Novo Convite</h2>
          <p className="form-subtitle">Preencha os dados do seu evento</p>
          
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="eventName" className="form-label">Nome do Evento *</label>
              <input
                id="eventName"
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Ex: Casamento, Aniversário, Formatura..."
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate" className="form-label">Data *</label>
                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventTime" className="form-label">Hora *</label>
                <input
                  id="eventTime"
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventLocation" className="form-label">Local do Evento</label>
              <input
                id="eventLocation"
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                placeholder="Ex: Salão de Festas ABC, Rua X..."
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detalhes adicionais sobre o evento..."
                rows="3"
                className="form-textarea"
                disabled={loading}
              />
            </div>

            <div className="guests-section">
              <h3 className="guests-title">Convidados (até 2) *</h3>
              <p className="guests-subtitle">Adicione pelo menos um convidado</p>
              
              <div className="form-group">
                <label htmlFor="guestName1" className="form-label">Primeiro Convidado *</label>
                <input
                  id="guestName1"
                  type="text"
                  name="guestName1"
                  value={formData.guestName1}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestName2" className="form-label">Segundo Convidado (Opcional)</label>
                <input
                  id="guestName2"
                  type="text"
                  name="guestName2"
                  value={formData.guestName2}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={handleCreateInvite}
                className="btn btn-primary"
                disabled={loading}
              >
                <span>{loading ? '⏳' : '✓'}</span>
                {loading ? 'Criando...' : 'Criar Convite'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setFormData({
                  eventName: '',
                  eventDate: '',
                  eventTime: '',
                  eventLocation: '',
                  guestName1: '',
                  guestName2: '',
                  description: '',
                })}
                disabled={loading}
              >
                <span>✕</span>
                Limpar
              </button>
            </div>
          </div>
        </div>

        {invites.length > 0 && (
          <div className="invites-history">
            <h3 className="history-title">Convites Criados Nesta Sessão</h3>
            <div className="invites-list">
              {invites.map(invite => (
                <div key={invite.id} className="invite-item">
                  <div className="invite-item-header">
                    <h4 className="invite-item-name">{invite.eventName}</h4>
                    <span className="invite-item-date">
                      {new Date(invite.eventDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="invite-item-time">
                    <span className="time-icon">🕐</span>
                    {invite.eventTime}
                    {invite.guests.length > 0 && (
                      <span className="guests-badge">{invite.guests.length} convidado{invite.guests.length > 1 ? 's' : ''}</span>
                    )}
                  </p>
                  <p className="invite-qr">
                    <strong>QR Code:</strong> <code>{invite.qrCode.substring(0, 16)}...</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onCancel={modal.closeModal}
      />
    </div>
  );
};

export default CreateInvitePage;