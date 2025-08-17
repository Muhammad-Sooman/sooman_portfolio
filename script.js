// ===== Helper: qs =====
const qs = (s, o=document)=>o.querySelector(s);
const qsa = (s, o=document)=>[...o.querySelectorAll(s)];

// ===== Preloader =====
window.addEventListener('load', () => {
  setTimeout(() => qs('#preloader').classList.add('hide'), 300);
});

// ===== Year =====
qs('#year').textContent = new Date().getFullYear();

// ===== Progress Bar =====
const progress = qs('#progress');
document.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
}, {passive:true});

// ===== Mobile Menu =====
const menuToggle = qs('#menuToggle');
const navLinks = qs('#navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
qsa('.nav-links a').forEach(a => a.addEventListener('click', ()=> navLinks.classList.remove('show')));

// ===== Smooth scroll =====
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      qs(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// ===== Theme Toggle (persist) =====
const themeToggle = qs('#themeToggle');
const root = document.documentElement;
const THEME_KEY = 'ms_theme';
const setTheme = (mode) => {
  if(mode === 'light'){
    root.style.setProperty('--bg','#f6f7fb');
    root.style.setProperty('--surface','#ffffff');
    root.style.setProperty('--text','#0a0c10');
    root.style.setProperty('--muted','#4a5568');
    root.style.setProperty('--card','rgba(0,0,0,.04)');
    root.style.setProperty('--glass','rgba(0,0,0,.06)');
    root.style.setProperty('--border','1px solid rgba(0,0,0,.12)');
  }else{
    root.style.removeProperty('--bg');
    root.style.removeProperty('--surface');
    root.style.removeProperty('--text');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--card');
    root.style.removeProperty('--glass');
    root.style.removeProperty('--border');
  }
  localStorage.setItem(THEME_KEY, mode);
};
setTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggle.addEventListener('click', () => {
  const next = (localStorage.getItem(THEME_KEY) === 'light') ? 'dark' : 'light';
  setTheme(next);
});

// ===== Reveal on Scroll =====
const revealEls = qsa('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
},{threshold:.12});
revealEls.forEach(el => io.observe(el));

// ===== Simple tilt effect for .tilt =====
qsa('[data-tilt]').forEach(el => {
  const strength = 10;
  const rect = () => el.getBoundingClientRect();
  const move = (x, y) => {
    const r = rect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2 + window.scrollY;
    const dx = (x - cx) / (r.width/2);
    const dy = (y - cy) / (r.height/2);
    el.style.transform = `rotateX(${(-dy*strength).toFixed(2)}deg) rotateY(${(dx*strength).toFixed(2)}deg) translateZ(0)`;
  };
  const leave = () => el.style.transform = 'rotateX(0) rotateY(0)';
  el.addEventListener('mousemove', (e)=>move(e.clientX, e.clientY));
  el.addEventListener('mouseleave', leave);
});

// ===== Respect reduced motion for tilt =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  qsa('[data-tilt]').forEach(el => {
    el.removeAttribute('data-tilt');
    el.style.transform = 'none';
  });
}
