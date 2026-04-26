const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const parseJson = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeInvite = (invite) => {
  if (!invite) return null;

  return {
    ...invite,
    utilizado: Number(invite.utilizado) === 1 ? 1 : 0,
    visualizado: Number(invite.visualizado) === 1 ? 1 : 0,
    limite_acompanhantes: Number(invite.limite_acompanhantes) || 0,
    acompanhantes_confirmados: Number(invite.acompanhantes_confirmados) || 0,
    cronograma: parseJson(invite.cronograma_json, []),
    manual_convidado: parseJson(invite.manual_json, []),
    lista_presentes: parseJson(invite.presentes_json, []),
  };
};

class Convite {
  static criar(dados) {
    const {
      nomeEvento = null,
      data = null,
      hora = null,
      local = null,
      descricao = null,
      nome1,
      nome2 = null,
      fotoCasalUrl = null,
      versiculo = null,
      saveTheDateTema = 'floral',
      localMapaUrl = null,
      cronograma = [],
      manualConvidado = [],
      listaPresentes = [],
      mensagemPersonalizada = null,
      limiteAcompanhantes = 0,
    } = dados;

    if (!nome1) throw new Error('O nome do primeiro convidado é obrigatório.');

    const uuid = uuidv4();
    const qrCode = uuid;

    const stmt = db.prepare(`
      INSERT INTO convites (
        uuid, nome_evento, data_evento, hora_evento,
        local_evento, descricao_evento, nome_convidado1, nome_convidado2,
        qr_code, foto_casal_url, versiculo, save_the_date_tema,
        local_mapa_url, cronograma_json, manual_json, presentes_json,
        mensagem_personalizada, limite_acompanhantes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      uuid,
      nomeEvento,
      data,
      hora,
      local,
      descricao,
      nome1,
      nome2,
      qrCode,
      fotoCasalUrl,
      versiculo,
      saveTheDateTema,
      localMapaUrl,
      JSON.stringify(cronograma),
      JSON.stringify(manualConvidado),
      JSON.stringify(listaPresentes),
      mensagemPersonalizada,
      Number(limiteAcompanhantes) || 0
    );

    return this.buscarPorId(result.lastInsertRowid);
  }

  static listarTodos() {
    return db
      .prepare('SELECT * FROM convites ORDER BY data_criacao DESC')
      .all()
      .map(normalizeInvite);
  }

  static buscarPorId(id) {
    const convite = db.prepare('SELECT * FROM convites WHERE id = ?').get(id);
    return normalizeInvite(convite);
  }

  static buscarPorQRCode(qrCode) {
    const convite = db.prepare('SELECT * FROM convites WHERE qr_code = ?').get(qrCode);
    return normalizeInvite(convite);
  }

  static marcarComoVisualizado(id) {
    const result = db.prepare(`
      UPDATE convites
      SET visualizado = 1,
          data_visualizacao = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    return result.changes;
  }

  static atualizarRSVP(id, dados) {
    const {
      rsvpStatus = 'Confirmado',
      acompanhantesConfirmados = 0,
      restricoesAlimentares = '',
      observacoesRsvp = '',
    } = dados;

    db.prepare(`
      UPDATE convites
      SET rsvp_status = ?,
          acompanhantes_confirmados = ?,
          restricoes_alimentares = ?,
          observacoes_rsvp = ?,
          data_rsvp = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      rsvpStatus,
      Number(acompanhantesConfirmados) || 0,
      restricoesAlimentares || '',
      observacoesRsvp || '',
      id
    );

    return this.buscarPorId(id);
  }

  static reservarPresente(id, presenteId, reservadoPor) {
    const convite = this.buscarPorId(id);
    if (!convite) return null;

    const presentes = convite.lista_presentes.map((presente) => {
      if (String(presente.id) !== String(presenteId)) {
        return presente;
      }

      if (presente.reservado) {
        throw new Error('Este presente já foi reservado.');
      }

      return {
        ...presente,
        reservado: true,
        reservadoPor: reservadoPor || convite.nome_convidado1,
      };
    });

    db.prepare(`
      UPDATE convites
      SET presentes_json = ?
      WHERE id = ?
    `).run(JSON.stringify(presentes), id);

    return this.buscarPorId(id);
  }

  static marcarComoUtilizado(qrCode) {
    const result = db.prepare(
      'UPDATE convites SET utilizado = 1 WHERE qr_code = ? AND utilizado = 0'
    ).run(qrCode);
    return result.changes;
  }

  static eliminar(id) {
    const result = db.prepare('DELETE FROM convites WHERE id = ?').run(id);
    return result.changes;
  }
}

module.exports = Convite;
