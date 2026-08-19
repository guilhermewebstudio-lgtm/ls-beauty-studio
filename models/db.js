// models/db.js
// Camada de acesso à base de dados.
// Usa SQLite localmente. Quando migrarmos para o Neon (Postgres),
// só é preciso trocar este ficheiro para usar "pg" — o resto do
// código (routes/) fala com estas funções, não com SQL direto.

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'ls-beauty.db'));

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS servicos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  duracao_min INTEGER NOT NULL,
  preco REAL NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS marcacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_cliente TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  hora TEXT NOT NULL,
  notas TEXT,
  estado TEXT DEFAULT 'pendente',
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

CREATE TABLE IF NOT EXISTS mensagens_contacto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Seed de serviços iniciais (só corre se a tabela estiver vazia)
const count = db.prepare('SELECT COUNT(*) AS n FROM servicos').get().n;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO servicos (nome, categoria, duracao_min, preco, descricao)
    VALUES (@nome, @categoria, @duracao_min, @preco, @descricao)
  `);
  const seed = [
    { nome: 'Manicure Clássica', categoria: 'Unhas', duracao_min: 45, preco: 15, descricao: 'Tratamento completo de unhas com verniz à escolha.' },
    { nome: 'Verniz Gel', categoria: 'Unhas', duracao_min: 60, preco: 22, descricao: 'Aplicação de verniz gel com longa duração.' },
    { nome: 'Pedicure Spa', categoria: 'Unhas', duracao_min: 60, preco: 25, descricao: 'Esfoliação, hidratação e verniz.' },
    { nome: 'Extensão de Pestanas', categoria: 'Olhar', duracao_min: 90, preco: 45, descricao: 'Efeito volume fio a fio.' },
    { nome: 'Design de Sobrancelhas', categoria: 'Olhar', duracao_min: 30, preco: 12, descricao: 'Depilação e definição personalizada.' },
    { nome: 'Corte + Escova', categoria: 'Cabelo', duracao_min: 60, preco: 25, descricao: 'Corte adaptado ao rosto e escova modeladora.' },
    { nome: 'Coloração Completa', categoria: 'Cabelo', duracao_min: 120, preco: 55, descricao: 'Cor uniforme de raiz a pontas.' },
    { nome: 'Limpeza de Pele', categoria: 'Estética Facial', duracao_min: 60, preco: 35, descricao: 'Limpeza profunda com extração e máscara calmante.' },
    { nome: 'Massagem Relaxante', categoria: 'Corpo', duracao_min: 50, preco: 40, descricao: 'Massagem de corpo inteiro para alívio de tensões.' }
  ];
  const insertMany = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
  insertMany(seed);
}

module.exports = db;
