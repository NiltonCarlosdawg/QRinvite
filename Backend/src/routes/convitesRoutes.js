const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/convitesController');

// Listar todos
router.get('/convites', ctrl.listarConvites);

// Criar
router.post('/convites', ctrl.criarConvite);

// Validar por QR (UUID)
router.get('/convites/validar/:qrCode', ctrl.validarConvite);

// Utilizar por QR (UUID)
router.patch('/convites/utilizar/:qrCode', ctrl.utilizarConvite);

// Buscar por ID
router.get('/convites/:id', ctrl.buscarConvitePorId);

// Marcar visualizado por ID
router.patch('/convites/:id/visualizado', ctrl.marcarVisualizacao);

// RSVP por ID
router.patch('/convites/:id/rsvp', ctrl.atualizarRSVP);

// Reservar presente por ID
router.patch('/convites/:id/presentes/:presenteId/reservar', ctrl.reservarPresente);

// Eliminar por ID
router.delete('/convites/:id', ctrl.eliminarConvite);

module.exports = router;
