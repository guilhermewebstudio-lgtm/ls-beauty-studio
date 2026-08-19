document.addEventListener('DOMContentLoaded', () => {
  const curtain = document.getElementById('curtain');

  if (curtain) {
    // Pequena pausa para o utilizador ver a marca antes de abrir a cortina
    setTimeout(() => {
      curtain.classList.add('opening');
      document.body.classList.add('revealed');
      document.body.classList.remove('pre-reveal');
    }, 700);

    curtain.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        curtain.classList.add('done');
      }
    });
  } else {
    // Páginas sem cortina (não a home) mostram o conteúdo revelado logo
    document.body.classList.add('revealed');
  }

  // Menu móvel
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }
});
