const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { localizeServicos } = require('../models/i18n');

// Base de conhecimento do bot, em PT e EN.
const INFO = {
  pt: {
    morada: 'Ficamos na Rua de Benfica, em Lisboa (perto do Estádio da Luz). A morada exata é enviada na confirmação da marcação.',
    horario: 'Estamos abertos de Terça a Sábado, das 10h00 às 19h30. Fechado ao Domingo e Segunda-feira.',
    contacto: 'Podes ligar, enviar mensagem pelo Instagram, ou usar o formulário de Contactos aqui no site.',
    pagamento: 'Aceitamos dinheiro, multibanco e MB Way.',
    cancelamento: 'Podes cancelar ou remarcar até 24h antes através do contacto que usaste na marcação, sem qualquer custo.',
    saudacao: 'Olá! 👋 Sou o assistente virtual do LS Beauty Studio. Posso ajudar com preços, horários, marcações ou a morada. O que precisas de saber?',
    marcar: 'Podes marcar diretamente na página "Marcar", escolhendo o serviço, data e hora que preferires. Queres que te leve lá?',
    obrigado: 'De nada! 💕 Qualquer outra dúvida, estou aqui.',
    fallback: 'Não tenho a certeza se percebi bem 🙂 Posso ajudar com: horários, preços, serviços, marcações, cancelamentos ou pagamentos. O que gostavas de saber?',
    servicosIntro: 'Trabalhamos nas áreas de: ',
    servicosOutro: '. Queres que te mostre os preços de alguma delas?',
    precosIntro: 'Aqui tens os nossos preços:\n',
    precosOutro: '\nQueres marcar algum destes serviços?'
  },
  en: {
    morada: 'We\'re on Rua de Benfica, in Lisbon (near Estádio da Luz). The exact address is sent when your booking is confirmed.',
    horario: 'We\'re open Tuesday to Saturday, from 10am to 7:30pm. Closed on Sundays and Mondays.',
    contacto: 'You can call, message us on Instagram, or use the Contact form here on the site.',
    pagamento: 'We accept cash, debit card and MB Way.',
    cancelamento: 'You can cancel or reschedule up to 24h before, free of charge, using the contact you gave when booking.',
    saudacao: 'Hi! 👋 I\'m the LS Beauty Studio virtual assistant. I can help with prices, hours, bookings or our address. What do you need to know?',
    marcar: 'You can book directly on the "Book" page, choosing the service, date and time you prefer. Want me to take you there?',
    obrigado: 'You\'re welcome! 💕 Anything else, I\'m here.',
    fallback: 'I\'m not sure I understood 🙂 I can help with: hours, prices, services, bookings, cancellations or payments. What would you like to know?',
    servicosIntro: 'We work in these areas: ',
    servicosOutro: '. Want me to show you the prices for any of them?',
    precosIntro: 'Here are our prices:\n',
    precosOutro: '\nWant to book any of these services?'
  }
};

function getServicosResumo(lang) {
  return db.getServicos().then((servicos) => {
    const localizados = localizeServicos(servicos, lang);
    const porCategoria = {};
    localizados.forEach((s) => {
      if (!porCategoria[s.categoria]) porCategoria[s.categoria] = [];
      porCategoria[s.categoria].push(s);
    });
    return porCategoria;
  });
}

async function responder(mensagemOriginal, lang) {
  const msg = mensagemOriginal.toLowerCase();
  const L = INFO[lang] || INFO.pt;

  if (/\b(ola|olá|oi|bom dia|boa tarde|boa noite|hey|hi|hello)\b/.test(msg)) {
    return L.saudacao;
  }

  if (/\b(horario|horário)s?\b|\baberto\b|\babrem\b|\bfecham\b|\bhoras?\b|\bhours?\b|\bopen\b|\bclose[sd]?\b/.test(msg)) {
    return L.horario;
  }

  if (/\b(morada|onde fica|localiza|endereco|endereço|benfica|address|located|location)\b/.test(msg)) {
    return L.morada;
  }

  if (/\b(preco|preço)s?\b|\bquanto custa\b|\bvalor(es)?\b|\bprice[s]?\b|\bcost[s]?\b|\bhow much\b/.test(msg)) {
    const porCategoria = await getServicosResumo(lang);
    let resposta = L.precosIntro;
    Object.keys(porCategoria).forEach((cat) => {
      resposta += `\n${cat}:\n`;
      porCategoria[cat].forEach((s) => {
        resposta += `• ${s.nome} — ${s.preco}€ (${s.duracao_min} min)\n`;
      });
    });
    resposta += L.precosOutro;
    return resposta;
  }

  if (/\b(servico|serviço|servicos|serviços|fazem|fazes|service[s]?|do you (do|offer))\b/.test(msg)) {
    const porCategoria = await getServicosResumo(lang);
    const categorias = Object.keys(porCategoria).join(', ');
    return L.servicosIntro + categorias + L.servicosOutro;
  }

  if (/\b(marca|marcar|agendar|reservar|marcacao|marcação|book(ing)?|appointment|schedule)\b/.test(msg)) {
    return L.marcar;
  }

  if (/\b(cancel|remarcar|adiar|mudar a hora|reschedule|postpone)\b/.test(msg)) {
    return L.cancelamento;
  }

  if (/\b(pagamento|pagar|multibanco|mbway|mb way|dinheiro|payment|pay|cash|card)\b/.test(msg)) {
    return L.pagamento;
  }

  if (/\b(falar com alguem|falar com alguém|humano|pessoa real|numero|número|telefone|human|phone number|talk to (someone|a person))\b/.test(msg)) {
    return L.contacto;
  }

  if (/\b(obrigad|obrigada|obrigado|thanks|thank you|valeu)\b/.test(msg)) {
    return L.obrigado;
  }

  return L.fallback;
}

router.post('/chatbot', async (req, res) => {
  const { mensagem, lang } = req.body;
  if (!mensagem || typeof mensagem !== 'string') {
    return res.status(400).json({ erro: 'Mensagem inválida.' });
  }
  const idioma = lang === 'en' ? 'en' : (res.locals.lang || 'pt');
  try {
    const resposta = await responder(mensagem.trim(), idioma);
    res.json({ resposta });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

module.exports = router;
