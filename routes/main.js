const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Página inicial
router.get('/', (req, res) => {
  const servicos = db.prepare('SELECT * FROM servicos ORDER BY categoria, preco').all();
  res.render('index', { servicos });
});

// Página de serviços (todos, com filtro por categoria opcional)
router.get('/servicos', (req, res) => {
  const servicos = db.prepare('SELECT * FROM servicos ORDER BY categoria, preco').all();
  res.render('servicos', { servicos });
});

// Página de marcação
router.get('/marcar', (req, res) => {
  const servicos = db.prepare('SELECT * FROM servicos ORDER BY categoria, preco').all();
  res.render('marcar', { servicos, sucesso: false, erro: null });
});

router.post('/marcar', (req, res) => {
  const { nome_cliente, email, telefone, servico_id, data, hora, notas } = req.body;
  const servicos = db.prepare('SELECT * FROM servicos ORDER BY categoria, preco').all();

  if (!nome_cliente || !email || !telefone || !servico_id || !data || !hora) {
    return res.render('marcar', { servicos, sucesso: false, erro: 'Preenche todos os campos obrigatórios.' });
  }

  // Verificar disponibilidade simples (mesma data + hora já ocupada)
  const conflito = db.prepare('SELECT id FROM marcacoes WHERE data = ? AND hora = ?').get(data, hora);
  if (conflito) {
    return res.render('marcar', { servicos, sucesso: false, erro: 'Esse horário já está reservado. Escolhe outro, por favor.' });
  }

  db.prepare(`
    INSERT INTO marcacoes (nome_cliente, email, telefone, servico_id, data, hora, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(nome_cliente, email, telefone, servico_id, data, hora, notas || null);

  res.render('marcar', { servicos, sucesso: true, erro: null });
});

// Contacto
router.get('/contactos', (req, res) => {
  res.render('contactos', { sucesso: false });
});

router.post('/contactos', (req, res) => {
  const { nome, email, mensagem } = req.body;
  if (nome && email && mensagem) {
    db.prepare('INSERT INTO mensagens_contacto (nome, email, mensagem) VALUES (?, ?, ?)').run(nome, email, mensagem);
  }
  res.render('contactos', { sucesso: true });
});

module.exports = router;
