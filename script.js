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

// Events: hide events once their day has passed (the site isn't rebuilt daily)
const events = document.querySelectorAll('.event[data-date]');
if (events.length) {
  const today = new Date();
  const todayStr = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  events.forEach((ev) => { if (ev.dataset.date < todayStr) ev.hidden = true; });
  document.querySelectorAll('.event-list').forEach((list) => {
    const anyLeft = list.querySelector('.event:not([hidden])');
    const empty = list.parentElement.querySelector('.events-empty');
    if (empty) empty.hidden = !!anyLeft;
    if (!anyLeft && list.closest('.home-events')) list.closest('.home-events').hidden = true;
  });
}

// Footer: small total-visits counter from GoatCounter (stays hidden if unavailable)
const visitCount = document.querySelector('.visit-count[data-counter]');
if (visitCount) {
  fetch(visitCount.dataset.counter)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      if (!d || !d.count) return;
      visitCount.textContent = `👀 ${d.count} visits`;
      visitCount.hidden = false;
    })
    .catch(() => {});
}
