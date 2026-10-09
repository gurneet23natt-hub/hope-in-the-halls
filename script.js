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

// Team page: tabs for Founders / Core Team / Leadership Committee / Ambassadors.
// Each tab has its own link (e.g. /team/#ambassadors) so it can be shared.
const tabs = [...document.querySelectorAll('[role="tab"]')];
if (tabs.length) {
  document.documentElement.classList.add('js');
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

  const select = (i, { focus = false, updateUrl = true } = {}) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (updateUrl) history.replaceState(null, '', tabs[i].getAttribute('href'));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', (e) => { e.preventDefault(); select(i); });
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (e.key in keys) {
        e.preventDefault();
        select((keys[e.key] + tabs.length) % tabs.length, { focus: true });
      }
    });
  });

  const fromHash = () => {
    const i = tabs.findIndex((t) => t.getAttribute('href') === location.hash);
    select(i >= 0 ? i : 0, { updateUrl: false });
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
}
