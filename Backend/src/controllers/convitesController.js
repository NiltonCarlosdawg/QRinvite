const Convite = require('../models/Convite');

exports.listarConvites = (req, res) => {
  try {
    const convites = Convite.listarTodos();
    res.json(convites);
  } catch (err) {
    console.error('Erro ao listar convites:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.buscarConvitePorId = (req, res) => {
  try {
    const convite = Convite.buscarPorId(req.params.id);

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    res.json(convite);
  } catch (err) {
    console.error('Erro ao buscar convite:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.criarConvite = (req, res) => {
  try {
    const {
      nomeEvento,
      data,
      hora,
      local,
      descricao,
      nome1,
      nome2,
      fotoCasalUrl,
      versiculo,
      saveTheDateTema,
      localMapaUrl,
      cronograma,
      manualConvidado,
      listaPresentes,
      mensagemPersonalizada,
      limiteAcompanhantes,
    } = req.body;

    if (!nome1) {
      return res.status(400).json({ error: 'O nome do primeiro convidado é obrigatório.' });
    }

    const convite = Convite.criar({
      nomeEvento,
      data,
      hora,
      local,
      descricao,
      nome1,
      nome2,
      fotoCasalUrl,
      versiculo,
      saveTheDateTema,
      localMapaUrl,
      cronograma,
      manualConvidado,
      listaPresentes,
      mensagemPersonalizada,
      limiteAcompanhantes,
    });

    res.status(201).json({
      message: 'Convite criado com sucesso!',
      convite,
    });
  } catch (err) {
    console.error('Erro ao criar convite:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.marcarVisualizacao = (req, res) => {
  try {
    const affected = Convite.marcarComoVisualizado(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    const convite = Convite.buscarPorId(req.params.id);
    res.json({ message: 'Visualização registada.', convite });
  } catch (err) {
    console.error('Erro ao marcar visualização:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarRSVP = (req, res) => {
  try {
    const convite = Convite.atualizarRSVP(req.params.id, req.body);

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    res.json({ message: 'RSVP atualizado com sucesso.', convite });
  } catch (err) {
    console.error('Erro ao atualizar RSVP:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.reservarPresente = (req, res) => {
  try {
    const convite = Convite.reservarPresente(
      req.params.id,
      req.params.presenteId,
      req.body?.reservadoPor
    );

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    res.json({ message: 'Presente reservado com sucesso.', convite });
  } catch (err) {
    console.error('Erro ao reservar presente:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.validarConvite = (req, res) => {
  try {
    const { qrCode } = req.params;
    const convite = Convite.buscarPorQRCode(qrCode);

    if (!convite) {
      return res.status(404).json({ valido: false, usado: false, mensagem: 'Convite não encontrado.' });
    }

    if (convite.utilizado) {
      return res.json({
        valido: false,
        usado: true,
        mensagem: 'Convite já foi utilizado.',
        convite,
      });
    }

    Convite.marcarComoUtilizado(qrCode);
    const conviteAtualizado = Convite.buscarPorQRCode(qrCode);

    res.json({
      valido: true,
      usado: true,
      utilizadoAgora: true,
      mensagem: 'Convite validado com sucesso.',
      convite: conviteAtualizado,
    });
  } catch (err) {
    console.error('Erro ao validar convite:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.utilizarConvite = (req, res) => {
  try {
    const { qrCode } = req.params;
    const affected = Convite.marcarComoUtilizado(qrCode);

    if (affected === 0) {
      return res.status(404).json({ error: 'Convite não encontrado ou já utilizado.' });
    }

    res.json({ message: 'Convite marcado como utilizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao utilizar convite:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarConvite = (req, res) => {
  try {
    const { id } = req.params;
    const affected = Convite.eliminar(id);

    if (affected === 0) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    res.json({ message: 'Convite eliminado com sucesso.' });
  } catch (err) {
    console.error('Erro ao eliminar convite:', err.message);
    res.status(500).json({ error: err.message });
  }
};
