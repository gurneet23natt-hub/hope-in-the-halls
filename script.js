// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

// Close the menu after choosing a link
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  })
);

// Blog page: filter posts by category
const filters = document.querySelectorAll('.filter');
filters.forEach((button) =>
  button.addEventListener('click', () => {
    const want = button.dataset.filter;
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    let shown = 0;
    document.querySelectorAll('.post-wrap').forEach((post) => {
      const match = want === 'all' || post.dataset.category === want;
      post.hidden = !match;
      if (match) shown++;
    });
    const empty = document.querySelector('.empty-filter');
    if (empty) empty.hidden = shown > 0;
  })
);
