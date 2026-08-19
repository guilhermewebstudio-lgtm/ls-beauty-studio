const express = require('express');
const router = express.Router();
const db = require('../models/db');

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    req.session.postLoginRedirect = '/admin';
    return res.redirect('/login');
  }
  if (!req.session.user.isAdmin) {
    return res.status(403).send('Acesso negado. Esta área é apenas para administradores.');
  }
  next();
}

// Rota de promoção a admin — protegida por uma chave secreta definida em
// ADMIN_SETUP_SECRET (variável de ambiente). Usa-se uma única vez:
// /admin/promote?email=teu@email.com&key=A_TUA_CHAVE_SECRETA
router.get('/admin/promote', async (req, res, next) => {
  try {
    const { email, key } = req.query;
    const segredo = process.env.ADMIN_SETUP_SECRET;

    if (!segredo) {
      return res.status(500).send('ADMIN_SETUP_SECRET não está configurado no servidor.');
    }
    if (!key || key !== segredo) {
      return res.status(403).send('Chave inválida.');
    }
    if (!email) {
      return res.status(400).send('Falta o parâmetro email.');
    }

    const user = await db.promoverAdmin(email);
    if (!user) {
      return res.status(404).send('Não existe nenhuma conta registada com esse email. Regista-te primeiro em /registo.');
    }

    // Se a pessoa que está a promover já tem sessão iniciada com este email, atualiza-a.
    if (req.session.user && req.session.user.email === user.email) {
      req.session.user.isAdmin = true;
    }

    res.send(`Conta ${user.email} promovida a administrador com sucesso. Podes agora entrar (ou voltar a entrar) e aceder a /admin.`);
  } catch (err) { next(err); }
});

router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const [marcacoes, mensagens, resumo] = await Promise.all([
      db.getTodasMarcacoes(),
      db.getTodasMensagens(),
      db.getResumoAdmin()
    ]);
    res.render('admin', { marcacoes, mensagens, resumo });
  } catch (err) { next(err); }
});

module.exports = router;
