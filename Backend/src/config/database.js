const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/wedding.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS convites (
    id                        INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid                      TEXT UNIQUE NOT NULL,
    nome_evento               TEXT,
    data_evento               TEXT,
    hora_evento               TEXT,
    local_evento              TEXT,
    descricao_evento          TEXT,
    nome_convidado1           TEXT NOT NULL,
    nome_convidado2           TEXT,
    qr_code                   TEXT UNIQUE NOT NULL,
    utilizado                 INTEGER DEFAULT 0,
    data_criacao              DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const requiredColumns = [
  ['foto_casal_url', 'TEXT'],
  ['versiculo', 'TEXT'],
  ['save_the_date_tema', 'TEXT DEFAULT \'floral\''],
  ['local_mapa_url', 'TEXT'],
  ['cronograma_json', 'TEXT DEFAULT \'[]\''],
  ['manual_json', 'TEXT DEFAULT \'[]\''],
  ['presentes_json', 'TEXT DEFAULT \'[]\''],
  ['mensagem_personalizada', 'TEXT'],
  ['limite_acompanhantes', 'INTEGER DEFAULT 0'],
  ['rsvp_status', 'TEXT DEFAULT \'Pendente\''],
  ['acompanhantes_confirmados', 'INTEGER DEFAULT 0'],
  ['restricoes_alimentares', 'TEXT'],
  ['observacoes_rsvp', 'TEXT'],
  ['visualizado', 'INTEGER DEFAULT 0'],
  ['data_visualizacao', 'DATETIME'],
  ['data_rsvp', 'DATETIME'],
];

const existingColumns = db
  .prepare('PRAGMA table_info(convites)')
  .all()
  .map((column) => column.name);

for (const [name, definition] of requiredColumns) {
  if (!existingColumns.includes(name)) {
    db.exec(`ALTER TABLE convites ADD COLUMN ${name} ${definition}`);
  }
}

console.log('Conectado ao SQLite com sucesso!');
console.log(`Base de dados: ${DB_PATH}`);
console.log('Tabela "convites" pronta.');

module.exports = db;
