// models/db.js
// Liga ao Postgres do Neon usando a DATABASE_URL do .env.
// A interface exportada (init, getServicos, getServicoPorId, criarMarcacao,
// existeConflito, criarMensagemContacto) é o que as rotas usam.

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Sem isto, um erro numa ligação inativa (comum com o pooler do Neon,
// que fecha ligações ociosas) derruba o processo Node inteiro.
pool.on('error', (err) => {
  console.error('Erro inesperado na pool do Postgres:', err.message);
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS servicos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      duracao_min INTEGER NOT NULL,
      preco NUMERIC(10,2) NOT NULL,
      descricao TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS marcacoes (
      id SERIAL PRIMARY KEY,
      nome_cliente TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      servico_id INTEGER NOT NULL REFERENCES servicos(id),
      data DATE NOT NULL,
      hora TIME NOT NULL,
      notas TEXT,
      estado TEXT DEFAULT 'pendente',
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mensagens_contacto (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;`);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM servicos');
  if (rows[0].n === 0) {
    const seed = [
      ['Manicure Clássica', 'Unhas', 45, 15, 'Tratamento completo de unhas com verniz à escolha.'],
      ['Verniz Gel', 'Unhas', 60, 22, 'Aplicação de verniz gel com longa duração.'],
      ['Pedicure Spa', 'Unhas', 60, 25, 'Esfoliação, hidratação e verniz.'],
      ['Extensão de Pestanas', 'Olhar', 90, 45, 'Efeito volume fio a fio.'],
      ['Design de Sobrancelhas', 'Olhar', 30, 12, 'Depilação e definição personalizada.'],
      ['Corte + Escova', 'Cabelo', 60, 25, 'Corte adaptado ao rosto e escova modeladora.'],
      ['Coloração Completa', 'Cabelo', 120, 55, 'Cor uniforme de raiz a pontas.'],
      ['Limpeza de Pele', 'Estética Facial', 60, 35, 'Limpeza profunda com extração e máscara calmante.'],
      ['Massagem Relaxante', 'Corpo', 50, 40, 'Massagem de corpo inteiro para alívio de tensões.']
    ];
    for (const s of seed) {
      await pool.query(
        `INSERT INTO servicos (nome, categoria, duracao_min, preco, descricao) VALUES ($1,$2,$3,$4,$5)`,
        s
      );
    }
  }
}

async function getServicos() {
  const { rows } = await pool.query('SELECT * FROM servicos ORDER BY categoria, preco');
  return rows.map((r) => ({ ...r, preco: Number(r.preco) }));
}

async function getServicoPorId(id) {
  const { rows } = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);
  if (!rows[0]) return null;
  return { ...rows[0], preco: Number(rows[0].preco) };
}

async function existeConflito(data, hora) {
  const { rows } = await pool.query(
    'SELECT id FROM marcacoes WHERE data = $1 AND hora = $2',
    [data, hora]
  );
  return rows.length > 0;
}

async function criarMarcacao({ nome_cliente, email, telefone, servico_id, data, hora, notas }) {
  await pool.query(
    `INSERT INTO marcacoes (nome_cliente, email, telefone, servico_id, data, hora, notas)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [nome_cliente, email, telefone, servico_id, data, hora, notas || null]
  );
}

async function criarMensagemContacto({ nome, email, mensagem }) {
  await pool.query(
    'INSERT INTO mensagens_contacto (nome, email, mensagem) VALUES ($1,$2,$3)',
    [nome, email, mensagem]
  );
}

async function getUsuarioPorEmail(email) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.toLowerCase()]);
  return rows[0] || null;
}

async function criarUsuario({ nome, email, password_hash }) {
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nome, email, password_hash) VALUES ($1,$2,$3) RETURNING id, nome, email',
    [nome, email.toLowerCase(), password_hash]
  );
  return rows[0];
}

async function getMarcacoesPorEmail(email) {
  const { rows } = await pool.query(
    `SELECT m.*, s.nome AS servico_nome, s.preco, s.duracao_min
     FROM marcacoes m
     JOIN servicos s ON s.id = m.servico_id
     WHERE m.email = $1
     ORDER BY m.data DESC, m.hora DESC`,
    [email.toLowerCase()]
  );
  return rows.map((r) => ({ ...r, preco: Number(r.preco) }));
}

async function promoverAdmin(email) {
  const { rows } = await pool.query(
    'UPDATE usuarios SET is_admin = TRUE WHERE email = $1 RETURNING id, nome, email, is_admin',
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

async function getTodasMarcacoes() {
  const { rows } = await pool.query(
    `SELECT m.*, s.nome AS servico_nome, s.preco
     FROM marcacoes m
     JOIN servicos s ON s.id = m.servico_id
     ORDER BY m.data DESC, m.hora DESC
     LIMIT 200`
  );
  return rows.map((r) => ({ ...r, preco: Number(r.preco) }));
}

async function getTodasMensagens() {
  const { rows } = await pool.query(
    'SELECT * FROM mensagens_contacto ORDER BY criado_em DESC LIMIT 200'
  );
  return rows;
}

async function getResumoAdmin() {
  const [marcacoes, mensagens, usuarios] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS n FROM marcacoes'),
    pool.query('SELECT COUNT(*)::int AS n FROM mensagens_contacto'),
    pool.query('SELECT COUNT(*)::int AS n FROM usuarios')
  ]);
  return {
    totalMarcacoes: marcacoes.rows[0].n,
    totalMensagens: mensagens.rows[0].n,
    totalUsuarios: usuarios.rows[0].n
  };
}

module.exports = {
  pool,
  init,
  getServicos,
  getServicoPorId,
  existeConflito,
  criarMarcacao,
  criarMensagemContacto,
  getUsuarioPorEmail,
  criarUsuario,
  getMarcacoesPorEmail,
  promoverAdmin,
  getTodasMarcacoes,
  getTodasMensagens,
  getResumoAdmin
};
