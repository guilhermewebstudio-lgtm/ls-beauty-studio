document.addEventListener('DOMContentLoaded', () => {
  const widget = document.getElementById('chatWidget');
  const toggle = document.getElementById('chatToggle');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const quick = document.getElementById('chatQuick');

  if (!widget) return;

  toggle.addEventListener('click', () => {
    widget.classList.toggle('open');
    if (widget.classList.contains('open')) input.focus();
  });

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg msg-${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getLang() {
    const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : 'pt';
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: text, lang: getLang() })
      });
      const data = await res.json();
      addMessage(data.resposta || 'Desculpa, não consegui responder agora.', 'bot');
    } catch (err) {
      addMessage('Ups, houve um problema de ligação. Tenta novamente.', 'bot');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  quick.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-msg]');
    if (btn) sendMessage(btn.dataset.msg);
  });
});
