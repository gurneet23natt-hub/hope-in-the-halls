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

// Calendar page: month grid built from the events data
const cal = document.getElementById('cal');
if (cal) {
  const events = JSON.parse(document.getElementById('cal-data').textContent);
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = ymd(new Date());
  const monthName = (d) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Open on the month of the next upcoming event, or this month if none
  const next = events.find((e) => e.date >= today);
  const start = next ? new Date(next.date + 'T12:00:00') : new Date();
  let view = new Date(start.getFullYear(), start.getMonth(), 1);

  const render = () => {
    const y = view.getFullYear(), m = view.getMonth();
    const key = `${y}-${pad(m + 1)}`;
    cal.querySelector('.cal-title').textContent = monthName(view);
    const days = cal.querySelector('.cal-days');
    days.innerHTML = '';
    const first = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) days.insertAdjacentHTML('beforeend', '<div class="cal-day cal-empty" aria-hidden="true"></div>');
    for (let d = 1; d <= count; d++) {
      const date = `${key}-${pad(d)}`;
      const todays = events.filter((e) => e.date === date);
      const cls = ['cal-day', date === today ? 'is-today' : '', todays.length ? 'has-event' : '', date < today ? 'is-past' : ''].join(' ');
      const items = todays.map((e) => `<a class="cal-event" href="${esc(e.url)}"><span class="cal-event-title">${esc(e.title)}</span></a>`).join('');
      days.insertAdjacentHTML('beforeend', `<div class="${cls}"><span class="cal-num">${d}</span>${items}</div>`);
    }
    const list = cal.querySelector('.cal-list');
    const monthEvents = events.filter((e) => e.date.startsWith(key));
    list.innerHTML = monthEvents.length
      ? monthEvents.map((e) => {
          const d = new Date(e.date + 'T12:00:00');
          const when = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
          return `<li><a href="${esc(e.url)}"><span class="cal-list-date">${esc(when)} · ${esc(e.time)}</span><strong>${esc(e.title)}</strong><span>${esc(e.place)}</span></a></li>`;
        }).join('')
      : '<li class="cal-none">No events this month. Check back soon!</li>';
  };

  cal.querySelectorAll('.cal-nav').forEach((btn) =>
    btn.addEventListener('click', () => {
      view = new Date(view.getFullYear(), view.getMonth() + Number(btn.dataset.step), 1);
      render();
    })
  );
  render();
}
