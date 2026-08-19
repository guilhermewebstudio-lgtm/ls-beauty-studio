document.addEventListener('DOMContentLoaded', () => {
  // Revela elementos com a classe .scroll-reveal à medida que entram no ecrã
  const revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Contador animado para números em .stat-num[data-count]
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => countIo.observe(el));
  }

  // Header muda de estilo ao fazer scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Lightbox simples para a galeria
  const galleryImgs = document.querySelectorAll('.gallery-item img');
  if (galleryImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img class="lightbox-img" alt="">';
    document.body.appendChild(overlay);
    const lightboxImg = overlay.querySelector('.lightbox-img');

    galleryImgs.forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src.replace(/w=\d+/, 'w=1800');
        lightboxImg.alt = img.alt;
        overlay.classList.add('open');
      });
    });
    overlay.addEventListener('click', () => overlay.classList.remove('open'));
  }
});
