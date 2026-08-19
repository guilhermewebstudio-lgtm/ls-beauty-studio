const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { localizeServicos } = require('../models/i18n');
const config = require('../models/config');

// ============================================
// Deteção de idioma da mensagem (independente do idioma do site)
// ============================================
const EN_HINTS = /\b(the|you|hi|hello|hey|price|prices|cost|open|close|closed|hours|book|booking|appointment|schedule|address|located|where|when|what|how|do|does|can|cancel|reschedule|payment|pay|thanks|thank|service|services|whatsapp|instagram|available|today|tomorrow|walk[- ]?in|discount|gift|card|allergy|allergic|kids|child|parking)\b/i;
const PT_HINTS = /\b(o|a|os|as|voc[eê]s|ol[aá]|oi|pre[cç]o|pre[cç]os|custa|custo|aberto|fechado|horas|horario|hor[aá]rio|marcar|marca[cç][aã]o|agendar|endere[cç]o|onde|fica|localiza[cç][aã]o|quando|que|como|posso|pode|cancel|remarcar|pagamento|pagar|obrigad|servi[cç]o|servi[cç]os|dispon[ií]vel|hoje|amanh[aã]|desconto|oferta|cart[aã]o|alergia|al[eé]rgic|crian[cç]a|estacionamento)\b/i;

function detectarIdioma(msg) {
  const en = (msg.match(EN_HINTS) || []).length;
  const pt = (msg.match(PT_HINTS) || []).length;
  if (en > pt) return 'en';
  return 'pt'; // default e empates ficam em português
}

// ============================================
// Base de conhecimento, em PT e EN
// ============================================
const INFO = {
  pt: {
    morada: `Ficamos na ${config.enderecoCompleto || 'Rua Cláudio Nunes, nº8, Benfica, Lisboa'}, perto do Estádio da Luz.`,
    horario: 'Estamos abertos de Terça a Sábado, das 10h00 às 19h30. Fechados ao Domingo e Segunda-feira.',
    contacto: 'Podes ligar, enviar mensagem pelo Instagram (@ls_beautystudio_), pelo WhatsApp, ou usar o formulário de Contactos aqui no site.',
    pagamento: 'Aceitamos dinheiro, multibanco e MB Way.',
    cancelamento: 'Podes cancelar ou remarcar até 24h antes através do contacto que usaste na marcação, sem qualquer custo.',
    saudacao: 'Olá! 👋 Sou o assistente virtual do LS Beauty Studio. Posso ajudar com preços, horários, marcações, morada, cancelamentos e muito mais. O que precisas de saber?',
    marcar: 'Para marcares, primeiro precisas de ter uma conta (é rápido, em /registo), depois vais à página "Marcar", escolhes o serviço, a data e a hora que preferires. A marcação fica pendente até confirmarmos.',
    marcarLoginNecessario: 'Para marcares uma sessão precisas de ter sessão iniciada. Cria a tua conta gratuita em /registo — é rápido!',
    obrigado: 'De nada! 💕 Qualquer outra dúvida, estou aqui.',
    fallback: 'Não tenho a certeza se percebi bem 🙂 Posso ajudar com: horários, preços, serviços, marcações, cancelamentos, pagamentos, morada ou contactos. Podes reformular a pergunta?',
    servicosIntro: 'Trabalhamos nas áreas de: ',
    servicosOutro: '. Queres que te mostre os preços de alguma delas?',
    precosIntro: 'Aqui tens os nossos preços:\n',
    precosOutro: '\nQueres marcar algum destes serviços?',
    estado: 'Podes ver o estado das tuas marcações (pendente, aceite ou recusada) na página "A minha conta", depois de entrares.',
    conta: 'Podes criar conta em /registo e entrar em /login. Com conta, guardamos o teu histórico de marcações.',
    sugestoes: 'Adoramos sugestões! Podes enviar a tua em /sugestoes (precisas de ter sessão iniciada) e acompanhar a resposta da equipa ali mesmo.',
    primeiraVez: 'Não há problema nenhum! Recomendamos chegares 5 minutos antes da hora marcada. Se tiveres alguma dúvida sobre o serviço, é só perguntares aqui.',
    estacionamento: 'Há estacionamento na rua perto do estúdio. Não temos parque próprio, mas geralmente é fácil encontrar lugar.',
    alergias: 'Se tens alguma alergia ou sensibilidade de pele, avisa-nos na marcação (campo de notas) ou assim que chegares — trabalhamos sempre à volta disso.',
    idade: 'Não temos uma idade mínima rígida, mas alguns serviços (como coloração) são mais indicados para adultos e adolescentes. Se tiveres dúvidas sobre um caso específico, pergunta-nos.',
    presentes: 'De momento não temos cartões-presente disponíveis online, mas podes perguntar diretamente pelo Instagram ou WhatsApp.',
    desconto: 'De momento não temos campanhas de desconto ativas no site, mas seguimos o Instagram para novidades e promoções.',
    idioma: 'Sim! Falamos português e inglês — podes escrever-me em qualquer um dos dois. / Yes! We speak Portuguese and English.',
    humano: 'Claro, podes contactar-nos diretamente pelo WhatsApp ou Instagram (@ls_beautystudio_) para falares com a equipa.'
  },
  en: {
    morada: `We're at ${config.enderecoCompleto || 'Rua Cláudio Nunes, nº8, Benfica, Lisbon'}, near Estádio da Luz.`,
    horario: 'We\'re open Tuesday to Saturday, from 10am to 7:30pm. Closed on Sundays and Mondays.',
    contacto: 'You can call, message us on Instagram (@ls_beautystudio_), on WhatsApp, or use the Contact form here on the site.',
    pagamento: 'We accept cash, debit card and MB Way.',
    cancelamento: 'You can cancel or reschedule up to 24h before, free of charge, using the contact you gave when booking.',
    saudacao: 'Hi! 👋 I\'m the LS Beauty Studio virtual assistant. I can help with prices, hours, bookings, address, cancellations and more. What do you need to know?',
    marcar: 'To book, you first need an account (quick sign up at /registo), then go to the "Book" page and choose the service, date and time you prefer. The booking stays pending until we confirm it.',
    marcarLoginNecessario: 'To book a session you need to be logged in. Create your free account at /registo — it only takes a minute!',
    obrigado: 'You\'re welcome! 💕 Anything else, I\'m here.',
    fallback: 'I\'m not sure I understood 🙂 I can help with: hours, prices, services, bookings, cancellations, payments, address or contacts. Could you rephrase your question?',
    servicosIntro: 'We work in these areas: ',
    servicosOutro: '. Want me to show you the prices for any of them?',
    precosIntro: 'Here are our prices:\n',
    precosOutro: '\nWant to book any of these services?',
    estado: 'You can check your bookings\' status (pending, accepted or declined) on the "My account" page, once logged in.',
    conta: 'You can create an account at /registo and log in at /login. With an account, we keep your booking history.',
    sugestoes: 'We love suggestions! You can send yours at /sugestoes (you need to be logged in) and track our reply right there.',
    primeiraVez: 'No problem at all! We recommend arriving 5 minutes before your appointment. If you have any questions about a service, just ask here.',
    estacionamento: 'There\'s street parking near the studio. We don\'t have our own parking lot, but it\'s usually easy to find a spot.',
    alergias: 'If you have any allergies or skin sensitivities, let us know when booking (notes field) or when you arrive — we\'ll always work around it.',
    idade: 'We don\'t have a strict minimum age, but some services (like coloring) are better suited for adults and teens. If you\'re unsure about a specific case, just ask us.',
    presentes: 'We don\'t currently offer gift cards online, but you can ask us directly on Instagram or WhatsApp.',
    desconto: 'We don\'t have active discount campaigns on the site right now, but follow our Instagram for news and promotions.',
    idioma: 'Yes! We speak Portuguese and English — feel free to write in either. / Sim! Falamos português e inglês.',
    humano: 'Of course, you can reach us directly on WhatsApp or Instagram (@ls_beautystudio_) to talk to the team.'
  }
};

async function getServicosResumo(lang) {
  const servicos = await db.getServicos();
  const localizados = localizeServicos(servicos, lang);
  const porCategoria = {};
  localizados.forEach((s) => {
    if (!porCategoria[s.categoria]) porCategoria[s.categoria] = [];
    porCategoria[s.categoria].push(s);
  });
  return porCategoria;
}

async function responder(mensagemOriginal, lang) {
  const msg = mensagemOriginal.toLowerCase();
  const L = INFO[lang] || INFO.pt;

  // Saudação
  if (/\b(ola|olá|oi|bom dia|boa tarde|boa noite|hey|hi|hello|good morning|good afternoon)\b/.test(msg)) {
    return L.saudacao;
  }

  // Agradecimento
  if (/\b(obrigad|obrigada|obrigado|thanks|thank you|valeu)\b/.test(msg)) {
    return L.obrigado;
  }

  // Horário
  if (/\b(horario|horário)s?\b|\baberto\b|\babrem\b|\bfecham\b|\bhoras?\b|\bhours?\b|\bopen\b|\bclose[sd]?\b/.test(msg)) {
    return L.horario;
  }

  // Morada / localização
  if (/\b(morada|onde fica|localiza|endereco|endereço|benfica|address|located|location|onde ficam|where are you)\b/.test(msg)) {
    return L.morada;
  }

  // Estacionamento
  if (/\b(estacionamento|parque|parking|estacionar)\b/.test(msg)) {
    return L.estacionamento;
  }

  // Preços
  if (/\b(preco|preço)s?\b|\bquanto custa/.test(msg) || /\bvalor(es)?\b|\bprice[s]?\b|\bcost[s]?\b|\bhow much\b/.test(msg)) {
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

  // Serviços disponíveis
  if (/\b(servico|serviço|servicos|serviços|fazem|fazes|service[s]?|do you (do|offer))\b/.test(msg)) {
    const porCategoria = await getServicosResumo(lang);
    const categorias = Object.keys(porCategoria).join(', ');
    return L.servicosIntro + categorias + L.servicosOutro;
  }

  // Estado da marcação
  if (/\b(estado|status)\b.*\b(marca[cç][aã]o|booking)?\b|\bwhere is my (booking|appointment)\b/.test(msg) && /\bmarca|\bbooking|\bappointment/.test(msg)) {
    return L.estado;
  }

  // Login / conta
  if (/\b(conta|registar|registo|criar conta|account|register|sign up|signup)\b/.test(msg)) {
    return L.conta;
  }

  // Marcação — precisa de login?
  if (/\b(marca|marcar|agendar|reservar|marcacao|marcação|book(ing)?|appointment|schedule)\b/.test(msg)) {
    return L.marcar;
  }

  // Sugestões
  if (/\b(sugest[aã]o|sugest[oõ]es|suggestion[s]?|feedback|ideia)\b/.test(msg)) {
    return L.sugestoes;
  }

  // Cancelamento
  if (/\b(cancel|remarcar|adiar|mudar a hora|reschedule|postpone)\b/.test(msg)) {
    return L.cancelamento;
  }

  // Pagamento
  if (/\b(pagamento|pagar|multibanco|mbway|mb way|dinheiro|payment|pay|cash|card)\b/.test(msg)) {
    return L.pagamento;
  }

  // Primeira vez
  if (/\b(primeira vez|nunca fui|never been|first time)\b/.test(msg)) {
    return L.primeiraVez;
  }

  // Alergias
  if (/\b(alergia|al[eé]rgic|allergy|allergic|sensib)\b/.test(msg)) {
    return L.alergias;
  }

  // Idade mínima
  if (/\b(idade|crian[cç]a|menor|kids?|child|minimum age|age limit)\b/.test(msg)) {
    return L.idade;
  }

  // Cartões-presente
  if (/\b(cart[aã]o[- ]?presente|gift card|voucher)\b/.test(msg)) {
    return L.presentes;
  }

  // Descontos / promoções
  if (/\b(desconto|promo[cç][aã]o|oferta|discount|promotion|deal)\b/.test(msg)) {
    return L.desconto;
  }

  // Falar inglês/português
  if (/\b(falam ingl[eê]s|speak english|speak portuguese|falam portugu[eê]s|do you speak)\b/.test(msg)) {
    return L.idioma;
  }

  // Falar com humano
  if (/\b(falar com alguem|falar com alguém|humano|pessoa real|numero|número|telefone|human|phone number|talk to (someone|a person))\b/.test(msg)) {
    return L.contacto;
  }

  return L.fallback;
}

router.post('/chatbot', async (req, res) => {
  const { mensagem, lang } = req.body;
  if (!mensagem || typeof mensagem !== 'string') {
    return res.status(400).json({ erro: 'Mensagem inválida.' });
  }
  // O idioma da resposta segue o idioma da PERGUNTA, não o do site.
  const idioma = detectarIdioma(mensagem.trim());
  try {
    const resposta = await responder(mensagem.trim(), idioma);
    res.json({ resposta });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

module.exports = router;
