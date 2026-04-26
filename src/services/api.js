import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const criarConvite = async (dados) => {
  try {
    const response = await axios.post(`${API_URL}/convites`, dados);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar convite no servidor.');
  }
};

export const listarConvites = async () => {
  try {
    const response = await axios.get(`${API_URL}/convites`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao listar convites.');
  }
};

export const buscarConvitePorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/convites/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar convite.');
  }
};

export const marcarConviteComoVisualizado = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/convites/${id}/visualizado`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao registar visualização.');
  }
};

export const atualizarRsvp = async (id, dados) => {
  try {
    const response = await axios.patch(`${API_URL}/convites/${id}/rsvp`, dados);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar RSVP.');
  }
};

export const reservarPresente = async (id, presenteId, dados) => {
  try {
    const response = await axios.patch(`${API_URL}/convites/${id}/presentes/${presenteId}/reservar`, dados);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao reservar presente.');
  }
};

export const validarConvite = async (qrCode) => {
  try {
    const response = await axios.get(`${API_URL}/convites/validar/${qrCode}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.mensagem ||
      error.response?.data?.error ||
      'Erro ao validar convite.'
    );
  }
};

export const utilizarConvite = async (qrCode) => {
  try {
    const response = await axios.patch(`${API_URL}/convites/utilizar/${qrCode}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao utilizar convite.');
  }
};

export const eliminarConvite = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/convites/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao eliminar convite.');
  }
};

export { API_URL };
