import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as api from '../services/api';

export const InviteContext = createContext();

const normalizeInvite = (invite) => ({
  ...invite,
  utilizado: Number(invite?.utilizado) === 1 ? 1 : 0,
  visualizado: Number(invite?.visualizado) === 1 ? 1 : 0,
  limite_acompanhantes: Number(invite?.limite_acompanhantes) || 0,
  acompanhantes_confirmados: Number(invite?.acompanhantes_confirmados) || 0,
  cronograma: invite?.cronograma || [],
  manual_convidado: invite?.manual_convidado || [],
  lista_presentes: invite?.lista_presentes || [],
});

const initialState = {
  invites: [],
  loading: false,
  error: null,
};

function inviteReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_INVITES':
      return { ...state, invites: action.payload.map(normalizeInvite), error: null };
    case 'ADD_INVITE':
      return { ...state, invites: [...state.invites, normalizeInvite(action.payload)], error: null };
    case 'UPSERT_INVITE':
      return {
        ...state,
        invites: state.invites.some((invite) => invite.id === action.payload.id)
          ? state.invites.map((invite) => (invite.id === action.payload.id ? normalizeInvite(action.payload) : invite))
          : [normalizeInvite(action.payload), ...state.invites],
        error: null,
      };
    case 'DELETE_INVITE':
      return {
        ...state,
        invites: state.invites.filter((invite) => invite.id !== action.payload),
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function InviteProvider({ children }) {
  const [state, dispatch] = useReducer(inviteReducer, initialState);

  const refreshInvites = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const invites = await api.listarConvites();
      dispatch({ type: 'SET_INVITES', payload: invites || [] });
      return invites || [];
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar convites do servidor' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    refreshInvites().catch(() => {});
  }, [refreshInvites]);

  const upsertInvite = useCallback((invite) => {
    dispatch({ type: 'UPSERT_INVITE', payload: invite });
  }, []);

  const fetchInviteById = useCallback(async (id) => {
    const invite = await api.buscarConvitePorId(id);
    dispatch({ type: 'UPSERT_INVITE', payload: invite });
    return invite;
  }, []);

  const createInvite = useCallback(async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await api.criarConvite(formData);
      dispatch({ type: 'ADD_INVITE', payload: response.convite });
      return response.convite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const markInviteAsViewed = useCallback(async (id) => {
    try {
      const response = await api.marcarConviteComoVisualizado(id);
      dispatch({ type: 'UPSERT_INVITE', payload: response.convite });
      return response.convite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const submitRsvp = useCallback(async (id, dados) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.atualizarRsvp(id, dados);
      dispatch({ type: 'UPSERT_INVITE', payload: response.convite });
      return response.convite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const reserveGift = useCallback(async (id, presenteId, dados) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.reservarPresente(id, presenteId, dados);
      dispatch({ type: 'UPSERT_INVITE', payload: response.convite });
      return response.convite;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const markAsUsed = useCallback(async (qrCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.utilizarConvite(qrCode);
      await refreshInvites();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [refreshInvites]);

  const verifyInvite = useCallback(async (qrCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.validarConvite(qrCode);
      if (response?.convite) {
        dispatch({ type: 'UPSERT_INVITE', payload: response.convite });
      } else {
        await refreshInvites();
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [refreshInvites]);

  const deleteInvite = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.eliminarConvite(id);
      dispatch({ type: 'DELETE_INVITE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    invites: state.invites,
    loading: state.loading,
    error: state.error,
    createInvite,
    refreshInvites,
    fetchInviteById,
    upsertInvite,
    markInviteAsViewed,
    submitRsvp,
    reserveGift,
    markAsUsed,
    verifyInvite,
    deleteInvite,
    clearError,
  };

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
}
