const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Página inicial
router.get('/', async (req, res, next) => {
  try {
    const servicos = await db.getServicos();
    res.render('index', { servicos });
  } catch (err) { next(err); }
});

// Página de serviços
router.get('/servicos', async (req, res, next) => {
  try {
    const servicos = await db.getServicos();
    res.render('servicos', { servicos });
  } catch (err) { next(err); }
});

// Página de marcação
router.get('/marcar', async (req, res, next) => {
  try {
    const servicos = await db.getServicos();
    res.render('marcar', { servicos, sucesso: false, erro: null });
  } catch (err) { next(err); }
});

router.post('/marcar', async (req, res, next) => {
  try {
    const { nome_cliente, email, telefone, servico_id, data, hora, notas } = req.body;
    const servicos = await db.getServicos();

    if (!nome_cliente || !email || !telefone || !servico_id || !data || !hora) {
      return res.render('marcar', { servicos, sucesso: false, erro: 'Preenche todos os campos obrigatórios.' });
    }

    const conflito = await db.existeConflito(data, hora);
    if (conflito) {
      return res.render('marcar', { servicos, sucesso: false, erro: 'Esse horário já está reservado. Escolhe outro, por favor.' });
    }

    await db.criarMarcacao({ nome_cliente, email, telefone, servico_id, data, hora, notas });
    res.render('marcar', { servicos, sucesso: true, erro: null });
  } catch (err) { next(err); }
});

// Contacto
router.get('/contactos', (req, res) => {
  res.render('contactos', { sucesso: false });
});

router.post('/contactos', async (req, res, next) => {
  try {
    const { nome, email, mensagem } = req.body;
    if (nome && email && mensagem) {
      await db.criarMensagemContacto({ nome, email, mensagem });
    }
    res.render('contactos', { sucesso: true });
  } catch (err) { next(err); }
});

module.exports = router;
