require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const { t } = require('./models/i18n');
const config = require('./models/config');

// Evita que um erro assíncrono não apanhado derrube o servidor todo
// (Render reinicia o serviço, o que causa os "not found" intermitentes)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ls-beauty-studio-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } // 30 dias
}));

// Idioma: lê o cookie 'lang' (definido pelo botão PT/EN) e disponibiliza
// `t()` e `lang` em todos os templates EJS automaticamente via res.locals.
function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[name] = decodeURIComponent(value);
  });
  return out;
}

app.use((req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  let lang = cookies.lang === 'en' ? 'en' : 'pt';
  res.locals.lang = lang;
  res.locals.t = (key) => t(lang, key);
  res.locals.social = config.social;
  res.locals.user = req.session.user || null;
  next();
});

app.get('/lang/:code', (req, res) => {
  const code = req.params.code === 'en' ? 'en' : 'pt';
  res.cookie('lang', code, { maxAge: 1000 * 60 * 60 * 24 * 365 });
  const back = req.get('Referer') || '/';
  res.redirect(back);
});

app.use('/', require('./routes/main'));
app.use('/', require('./routes/auth'));
app.use('/api', require('./routes/chatbot'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use((req, res) => {
  res.status(404).render('404');
});

db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`LS Beauty Studio a correr em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao ligar à base de dados:', err);
    process.exit(1);
  });
