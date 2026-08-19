const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/sugestoes', async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.render('sugestoes', { sugestoes: null, sucesso: false, erro: null });
    }
    const sugestoes = await db.getSugestoesPorUsuario(req.session.user.id);
    res.render('sugestoes', { sugestoes, sucesso: false, erro: null });
  } catch (err) { next(err); }
});

router.post('/sugestoes', async (req, res, next) => {
  try {
    if (!req.session.user) {
      req.session.postLoginRedirect = '/sugestoes';
      return res.redirect('/login');
    }
    const { titulo, mensagem } = req.body;
    const t = res.locals.t;

    if (!titulo || !mensagem) {
      const sugestoes = await db.getSugestoesPorUsuario(req.session.user.id);
      return res.render('sugestoes', { sugestoes, sucesso: false, erro: t('suggestion_error_fields') });
    }

    await db.criarSugestao({ usuario_id: req.session.user.id, titulo, mensagem });
    const sugestoes = await db.getSugestoesPorUsuario(req.session.user.id);
    res.render('sugestoes', { sugestoes, sucesso: true, erro: null });
  } catch (err) { next(err); }
});

module.exports = router;
