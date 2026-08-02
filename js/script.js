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

// ===== Contact form validation =====
const cform = document.getElementById('contactForm');
if (cform) {
  cform.addEventListener('submit', (e) => {
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
    if (!valid) {
      e.preventDefault();
    } else {
      const successEl = document.getElementById('formSuccess');
      if (successEl) successEl.classList.add('show');
    }
  });
  cform.querySelectorAll('input,textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = field.parentElement.querySelector('.field-err');
      if (errEl) errEl.classList.remove('show');
    });
  });
}
