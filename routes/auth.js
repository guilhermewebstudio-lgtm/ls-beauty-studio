const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../models/db');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Registo
router.get('/registo', (req, res) => {
  if (req.session.user) return res.redirect('/conta');
  res.render('registo', { erro: null, valores: {} });
});

router.post('/registo', async (req, res, next) => {
  try {
    const { nome, email, password, password2 } = req.body;
    const t = res.locals.t;

    if (!nome || !email || !password || !password2) {
      return res.render('registo', { erro: t('auth_error_fields'), valores: { nome, email } });
    }
    if (!isValidEmail(email)) {
      return res.render('registo', { erro: t('auth_error_email'), valores: { nome, email } });
    }
    if (password.length < 6) {
      return res.render('registo', { erro: t('auth_error_password_short'), valores: { nome, email } });
    }
    if (password !== password2) {
      return res.render('registo', { erro: t('auth_error_password_match'), valores: { nome, email } });
    }

    const existente = await db.getUsuarioPorEmail(email);
    if (existente) {
      return res.render('registo', { erro: t('auth_error_exists'), valores: { nome, email } });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await db.criarUsuario({ nome, email, password_hash: hash });

    req.session.user = { id: user.id, nome: user.nome, email: user.email };
    res.redirect('/conta');
  } catch (err) { next(err); }
});

// Login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/conta');
  res.render('login', { erro: null, valores: {} });
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const t = res.locals.t;

    if (!email || !password) {
      return res.render('login', { erro: t('auth_error_fields'), valores: { email } });
    }

    const user = await db.getUsuarioPorEmail(email);
    if (!user) {
      return res.render('login', { erro: t('auth_error_credentials'), valores: { email } });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.render('login', { erro: t('auth_error_credentials'), valores: { email } });
    }

    req.session.user = { id: user.id, nome: user.nome, email: user.email };
    const redirectTo = req.session.postLoginRedirect || '/conta';
    delete req.session.postLoginRedirect;
    res.redirect(redirectTo);
  } catch (err) { next(err); }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Conta (protegida)
router.get('/conta', async (req, res, next) => {
  try {
    if (!req.session.user) {
      req.session.postLoginRedirect = '/conta';
      return res.redirect('/login');
    }
    const marcacoes = await db.getMarcacoesPorEmail(req.session.user.email);
    res.render('conta', { marcacoes });
  } catch (err) { next(err); }
});

module.exports = router;
