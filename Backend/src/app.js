const express = require('express');
const cors    = require('cors');
const convitesRoutes = require('./routes/convitesRoutes');

// Inicializa a base de dados (cria tabelas se necessário)
require('./config/database');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api', convitesRoutes);

// Rota raiz de verificação
app.get('/', (_req, res) => {
  res.json({ message: '🚀 Wedding Invites API está funcionando!' });
});

// ── Arrancar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}/api`);
});