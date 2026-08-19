const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Base de conhecimento simples do bot — fácil de editar/expandir.
const INFO = {
  morada: 'Ficamos na Rua de Benfica, em Lisboa (perto do Estádio da Luz). A morada exata é enviada na confirmação da marcação.',
  horario: 'Estamos abertos de Terça a Sábado, das 10h00 às 19h30. Fechado ao Domingo e Segunda-feira.',
  contacto: 'Podes ligar, enviar mensagem pelo Instagram, ou usar o formulário de Contactos aqui no site.',
  pagamento: 'Aceitamos dinheiro, multibanco e MB Way.',
  cancelamento: 'Podes cancelar ou remarcar até 24h antes através do contacto que usaste na marcação, sem qualquer custo.'
};

async function getServicosResumo() {
  const servicos = await db.getServicos();
  const porCategoria = {};
  servicos.forEach((s) => {
    if (!porCategoria[s.categoria]) porCategoria[s.categoria] = [];
    porCategoria[s.categoria].push(s);
  });
  return porCategoria;
}

async function responder(mensagemOriginal) {
  const msg = mensagemOriginal.toLowerCase();

  // Saudação
  if (/\b(ola|olá|oi|bom dia|boa tarde|boa noite|hey)\b/.test(msg)) {
    return 'Olá! 👋 Sou o assistente virtual do LS Beauty Studio. Posso ajudar com preços, horários, marcações ou a morada. O que precisas de saber?';
  }

  // Horário
  if (/\b(horario|horário)s?\b|\baberto\b|\babrem\b|\bfecham\b|\bhoras?\b/.test(msg)) {
    return INFO.horario;
  }

  // Morada / localização
  if (/\b(morada|onde fica|localiza|endereco|endereço|benfica)\b/.test(msg)) {
    return INFO.morada;
  }

  // Preços / serviços
  if (/\b(preco|preço)s?\b|\bquanto custa/.test(msg) || /\bvalor(es)?\b/.test(msg)) {
    const porCategoria = await getServicosResumo();
    let resposta = 'Aqui tens os nossos preços:\n';
    Object.keys(porCategoria).forEach((cat) => {
      resposta += `\n${cat}:\n`;
      porCategoria[cat].forEach((s) => {
        resposta += `• ${s.nome} — ${s.preco}€ (${s.duracao_min} min)\n`;
      });
    });
    resposta += '\nQueres marcar algum destes serviços?';
    return resposta;
  }

  // Serviços disponíveis
  if (/\b(servico|serviço|servicos|serviços|fazem|fazes)\b/.test(msg)) {
    const porCategoria = await getServicosResumo();
    const categorias = Object.keys(porCategoria).join(', ');
    return `Trabalhamos nas áreas de: ${categorias}. Queres que te mostre os preços de alguma delas?`;
  }

  // Marcação
  if (/\b(marca|marcar|agendar|reservar|marcacao|marcação)\b/.test(msg)) {
    return 'Podes marcar diretamente na página "Marcar", escolhendo o serviço, data e hora que preferires. Queres que te leve lá?';
  }

  // Cancelamento
  if (/\b(cancel|remarcar|adiar|mudar a hora)\b/.test(msg)) {
    return INFO.cancelamento;
  }

  // Pagamento
  if (/\b(pagamento|pagar|multibanco|mbway|mb way|dinheiro)\b/.test(msg)) {
    return INFO.pagamento;
  }

  // Contacto humano
  if (/\b(falar com alguem|falar com alguém|humano|pessoa real|numero|número|telefone)\b/.test(msg)) {
    return INFO.contacto;
  }

  // Agradecimento
  if (/\b(obrigad|obrigada|obrigado|thanks|valeu)\b/.test(msg)) {
    return 'De nada! 💕 Qualquer outra dúvida, estou aqui.';
  }

  // Fallback
  return 'Não tenho a certeza se percebi bem 🙂 Posso ajudar com: horários, preços, serviços, marcações, cancelamentos ou pagamentos. O que gostavas de saber?';
}

router.post('/chatbot', async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem || typeof mensagem !== 'string') {
    return res.status(400).json({ erro: 'Mensagem inválida.' });
  }
  try {
    const resposta = await responder(mensagem.trim());
    res.json({ resposta });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

module.exports = router;
