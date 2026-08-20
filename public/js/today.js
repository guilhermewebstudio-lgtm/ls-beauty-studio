document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('hoursCard');
  if (!card) return;

  const lang = (document.cookie.match(/(?:^|; )lang=([^;]*)/) || [])[1] === 'en' ? 'en' : 'pt';
  const TODAY_LABEL = { pt: 'Hoje', en: 'Today' };

  const todayIndex = new Date().getDay(); // 0 = Domingo ... 6 = Sábado
  const row = card.querySelector(`.hours-row[data-day="${todayIndex}"]`);
  if (!row) return;

  row.classList.add('today');

  const label = row.querySelector('.hours-day-label');
  if (label && !label.querySelector('.today-badge')) {
    const badge = document.createElement('span');
    badge.className = 'today-badge';
    badge.textContent = TODAY_LABEL[lang];
    label.appendChild(badge);
  }
});
