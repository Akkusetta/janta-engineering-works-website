document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// mobile menu
const menuToggle = document.getElementById('menuToggle');
const navlinks = document.getElementById('navlinks');
if (menuToggle && navlinks) {
  menuToggle.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a:not(.has-drop > a)').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));
  // tap-to-open mega menu on mobile
  navlinks.querySelectorAll('.has-drop > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });
}

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// bar chart animation
const barSection = document.getElementById('bars');
let barsAnimated = false;
const maxVal = 1805;
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      document.querySelectorAll('.bar-col').forEach(col => {
        const val = parseFloat(col.dataset.value);
        const pct = (val / maxVal) * 100;
        col.querySelector('.bar').style.height = pct + '%';
      });
    }
  });
}, { threshold: 0.3 });
if (barSection) barIO.observe(barSection);

// counter animation
document.querySelectorAll('.counter').forEach(el => {
  const target = parseFloat(el.dataset.target);
  let started = false;
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        let cur = 0; const step = target / 40;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur.toFixed(2);
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  cIO.observe(el);
});

// ===== Recent projects carousel =====
const projectCarousel = document.querySelector('.projects-carousel');
if (projectCarousel) {
  const track = projectCarousel.querySelector('.carousel-track');
  const prevBtn = projectCarousel.querySelector('.carousel-btn.prev');
  const nextBtn = projectCarousel.querySelector('.carousel-btn.next');
  const cards = Array.from(track.children);

  if (cards.length) {
    let index = 0;
    const getStep = () => {
      const firstCard = cards[0].getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 18);
      return firstCard.width + gap;
    };

    const updateCarousel = () => {
      const step = getStep();
      track.style.transform = `translateX(-${index * step}px)`;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= cards.length - 1;
    };

    prevBtn?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
      index = Math.min(cards.length - 1, index + 1);
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    window.requestAnimationFrame(updateCarousel);
  }
}

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ===== Project filter tabs =====
const filterBar = document.querySelector('.filter-bar');
if (filterBar) {
  const cards = document.querySelectorAll('.pgrid .pcard');
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

// ===== Site search (client-side, small dataset) =====
const SITE_INDEX = window.SITE_SEARCH_INDEX || [];
const searchInput = document.getElementById('siteSearch');
const searchResults = document.getElementById('searchResults');
if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) { searchResults.classList.remove('show'); searchResults.innerHTML = ''; return; }
    const matches = SITE_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) || item.tags.toLowerCase().includes(q)
    ).slice(0, 8);
    if (matches.length === 0) {
      searchResults.innerHTML = '<div class="none">No results found.</div>';
    } else {
      searchResults.innerHTML = matches.map(m =>
        `<a href="${m.url}"><b>${m.title}</b><span>${m.desc}</span></a>`
      ).join('');
    }
    searchResults.classList.add('show');
  });
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });
}

// ===== Project image lightbox =====
const lightboxBackdrop = document.createElement('div');
lightboxBackdrop.className = 'lightbox-backdrop';
lightboxBackdrop.setAttribute('aria-hidden', 'true');
lightboxBackdrop.innerHTML = '<div class="lightbox-frame"><button class="lightbox-close" type="button" aria-label="Close image">×</button><img alt=""></div>';
document.body.appendChild(lightboxBackdrop);

const lightboxImg = lightboxBackdrop.querySelector('img');
const lightboxClose = lightboxBackdrop.querySelector('.lightbox-close');

const openLightbox = (imgEl) => {
  if (!imgEl || !lightboxImg) return;
  lightboxImg.src = imgEl.getAttribute('src');
  lightboxImg.alt = imgEl.getAttribute('alt') || '';
  lightboxBackdrop.classList.add('show');
  lightboxBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxBackdrop.classList.remove('show');
  lightboxBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('.pd-gallery img, .pd-grid .reveal > img').forEach(img => {
  img.setAttribute('tabindex', '0');
  img.addEventListener('click', () => openLightbox(img));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img);
    }
  });
});

lightboxBackdrop.addEventListener('click', (e) => {
  if (e.target === lightboxBackdrop || e.target === lightboxClose) closeLightbox();
});
lightboxClose?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxBackdrop.classList.contains('show')) closeLightbox();
});

// ===== Contact form validation =====
const cform = document.getElementById('contactForm');
if (cform) {
  cform.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    cform.querySelectorAll('[required]').forEach(field => {
      const errEl = field.parentElement.querySelector('.field-err');
      let fieldValid = field.value.trim().length > 0;
      if (field.type === 'email' && fieldValid) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }
      if (field.type === 'tel' && field.value.trim().length > 0) {
        fieldValid = /^[0-9+\-\s()]{7,15}$/.test(field.value.trim());
      }
      field.classList.toggle('error', !fieldValid);
      if (errEl) errEl.classList.toggle('show', !fieldValid);
      if (!fieldValid) valid = false;
    });

    if (!valid) return;

    const name = cform.elements.name?.value.trim() || 'N/A';
    const phone = cform.elements.phone?.value.trim() || 'N/A';
    const email = cform.elements.email?.value.trim() || 'N/A';
    const subject = cform.elements.subject?.value.trim() || 'Website enquiry';
    const message = cform.elements.message?.value.trim() || '';

    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      '',
      'Message:',
      message
    ].join('\n');

    const mailtoLink = `mailto:jantaeworks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.classList.add('show');
  });

  cform.querySelectorAll('input,textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = field.parentElement.querySelector('.field-err');
      if (errEl) errEl.classList.remove('show');
    });
  });
}
