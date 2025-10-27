const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Convite {
  /**
   * Cria um novo convite com dados completos do evento
   * @param {Object} dados
   * @param {string} dados.nomeEvento - Nome do evento
   * @param {string} dados.data - Data do evento (YYYY-MM-DD)
   * @param {string} dados.hora - Hora do evento (HH:mm)
   * @param {string} dados.local - Local do evento
   * @param {string} dados.descricao - Descrição do evento
   * @param {string} dados.nome1 - Primeiro convidado (obrigatório)
   * @param {string|null} dados.nome2 - Segundo convidado (opcional)
   */
  static async criar(dados) {
    const {
      nomeEvento,
      data,
      hora,
      local,
      descricao,
      nome1,
      nome2 = null
    } = dados;

    const uuid = uuidv4();
    const qrCode = uuid;

    const query = `
      INSERT INTO convites (
        uuid,
        nome_evento,
        data_evento,
        hora_evento,
        local_evento,
        descricao_evento,
        nome_convidado1,
        nome_convidado2,
        qr_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        uuid,
        nomeEvento,
        data,
        hora,
        local,
        descricao,
        nome1,
        nome2,
        qrCode
      ]);

      return {
        id: result.insertId,
        uuid,
        qrCode,
        nome_evento: nomeEvento,
        data_evento: data,
        hora_evento: hora,
        local_evento: local,
        descricao_evento: descricao,
        nome_convidado1: nome1,
        nome_convidado2: nome2
      };
    } catch (err) {
      throw new Error('Erro ao criar convite: ' + err.message);
    }
  }

  static async buscarPorQRCode(qrCode) {
    const query = `SELECT * FROM convites WHERE qr_code = ?`;
    try {
      const [rows] = await pool.execute(query, [qrCode]);
      return rows[0] || null;
    } catch (err) {
      throw new Error('Erro ao buscar convite: ' + err.message);
    }
  }

  static async marcarComoUtilizado(qrCode) {
    const query = `
      UPDATE convites
      SET utilizado = TRUE
      WHERE qr_code = ? AND utilizado = FALSE
    `;
    try {
      const [result] = await pool.execute(query, [qrCode]);
      return result.affectedRows;
    } catch (err) {
      throw new Error('Erro ao utilizar convite: ' + err.message);
    }
  }
}

module.exports = Convite;
