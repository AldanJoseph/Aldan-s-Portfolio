/* Portfolio interactions: mobile menu, active links, reveal, back-to-top, form validation */
document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Footer year
$('#year').textContent = new Date().getFullYear();

// Mobile menu
const burger = $('#burger'), menu = $('#menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Navbar background + back-to-top visibility
const nav = $('#nav'), topBtn = $('#top');
function onScroll() {
  nav.classList.toggle('solid', scrollY > 20);
  topBtn.classList.toggle('show', scrollY > 500);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// Active nav link highlighting
const links = $$('.menu a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => {
      const on = l.getAttribute('href') === '#' + en.target.id;
      l.classList.toggle('active', on);
      on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

// Scroll reveal
const rev = new IntersectionObserver((entries, o) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); } });
}, { threshold: .12 });
$$('.reveal').forEach(el => rev.observe(el));

// Contact form: validate, then send through Formspree
// STEP: replace YOUR_ID with the ID from your Formspree form link
const FORM_URL = 'https://formspree.io/f/mrpqedng';

const form = $('#form'), status = $('#status');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address, like name@example.com.',
  subject: v => v.trim().length >= 3 || 'Enter a subject (at least 3 characters).',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};
function check(input) {
  const res = rules[input.name](input.value);
  const field = input.closest('.field');
  field.classList.toggle('bad', res !== true);
  $('.err', field).textContent = res === true ? '' : res;
  input.setAttribute('aria-invalid', res !== true);
  return res === true;
}
$$('input,textarea', form).forEach(i => i.addEventListener('blur', () => check(i)));

form.addEventListener('submit', async e => {
  e.preventDefault();
  const inputs = $$('input,textarea', form);
  const ok = inputs.map(check).every(Boolean);
  if (!ok) { inputs.find(i => i.getAttribute('aria-invalid') === 'true').focus(); status.textContent = ''; return; }

  status.textContent = 'Sending...';
  try {
    const res = await fetch(FORM_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    if (res.ok) {
      status.textContent = 'Message sent. Thank you, I will reply soon.';
      form.reset();
    } else {
      status.textContent = 'Could not send. Please email me at aldanjoseph33@gmail.com.';
    }
  } catch (err) {
    status.textContent = 'Network error. Please email me at aldanjoseph33@gmail.com.';
  }
});
