document.getElementById('year').textContent = new Date().getFullYear();
  const menuToggle = document.getElementById('menuToggle');
  const navlinks = document.getElementById('navlinks');
  menuToggle.addEventListener('click', ()=> navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>navlinks.classList.remove('open')));

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // bar chart animation
  const barSection = document.getElementById('bars');
  let barsAnimated = false;
  const maxVal = 1805;
  const barIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !barsAnimated){
        barsAnimated = true;
        document.querySelectorAll('.bar-col').forEach(col=>{
          const val = parseFloat(col.dataset.value);
          const pct = (val/maxVal)*100;
          col.querySelector('.bar').style.height = pct+'%';
        });
      }
    });
  }, {threshold:0.3});
  if(barSection) barIO.observe(barSection);

  // counter animation
  document.querySelectorAll('.counter').forEach(el=>{
    const target = parseFloat(el.dataset.target);
    let started = false;
    const cIO = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting && !started){
          started = true;
          let cur = 0; const step = target/40;
          const t = setInterval(()=>{
            cur += step;
            if(cur>=target){cur=target; clearInterval(t);}
            el.textContent = cur.toFixed(2);
          }, 30);
        }
      });
    }, {threshold:0.5});
    cIO.observe(el);
  });
