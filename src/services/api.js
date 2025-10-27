import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Criar novo convite
export const criarConvite = async (dados) => {
  try {
    const response = await axios.post(`${API_URL}/convites`, dados);
    return response.data; // o backend retorna o objeto do convite criado
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Erro ao criar convite no servidor.'
    );
  }
};

// Validar convite por QR Code
export const validarConvite = async (qrCode) => {
  try {
    const response = await fetch(`${API_URL}/convites/${qrCode}`);

    if (!response.ok) {
      throw new Error('Erro ao validar convite');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// Marcar convite como utilizado
export const utilizarConvite = async (qrCode) => {
  try {
    const response = await fetch(`${API_URL}/convites/${qrCode}/utilizar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao utilizar convite');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// Listar todos os convites (desenvolvimento)
export const listarConvites = async () => {
  try {
    const response = await fetch(`${API_URL}/convites`);

    if (!response.ok) {
      throw new Error('Erro ao listar convites');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// ========================================
// EXEMPLO DE USO NO COMPONENTE:
// ========================================
/*
import { criarConvite, validarConvite, utilizarConvite, listarConvites } from '../services/api';

// No seu componente CreatePage:
const handleCreateInvite = async () => {
  try {
    const resultado = await criarConvite(
      formData.guestName1,
      formData.guestName2 || null
    );
    
    console.log('Convite criado:', resultado);
    // resultado.convite.qrCode -> use isso para gerar o QR Code
    
  } catch (error) {
    console.error('Erro ao criar:', error);
  }
};

// Para validar um convite:
const handleValidarConvite = async (qrCode) => {
  try {
    const resultado = await validarConvite(qrCode);
    
    if (resultado.valido) {
      console.log('Convite válido:', resultado.convite);
    } else {
      console.log('Convite inválido:', resultado.mensagem);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Para marcar como utilizado:
const handleUtilizarConvite = async (qrCode) => {
  try {
    const resultado = await utilizarConvite(qrCode);
    console.log(resultado.message);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Para listar todos:
const handleListarConvites = async () => {
  try {
    const convites = await listarConvites();
    console.log('Todos os convites:', convites);
  } catch (error) {
    console.error('Erro:', error);
  }
};
*/