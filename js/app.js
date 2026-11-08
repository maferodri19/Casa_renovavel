import * as D from './data.js';
import * as store from './store.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const nf = new Intl.NumberFormat('pt-BR');
const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
const fmtShort = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Totais calculados a partir dos dados ---------- */
const TOTAL = D.WIND.map((w, i) => w + D.SOLAR[i]);
const TOTAL_MWH = TOTAL.reduce((a, b) => a + b, 0);
const CO2_MONTH = TOTAL.map(v => Math.round(v * D.EMISSION_FACTOR));
const CO2_TOTAL = CO2_MONTH.reduce((a, b) => a + b, 0);
const HOMES = Math.round(TOTAL_MWH / D.MONTHS.length / 0.16); // casa média: 160 kWh/mês
const TREES = Math.round(CO2_TOTAL / 0.16);

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Menu e barra de rolagem ---------- */
function initNav() {
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
  addEventListener('scroll', () => $('#topbar').classList.toggle('is-stuck', scrollY > 8), { passive: true });

  // destaca o atalho da seção visível (barra inferior no celular)
  const ids = ['inicio', 'obra', 'energia', 'capacitacoes', 'comunidade'];
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.tabbar a').forEach(a => a.classList.toggle('is-on', a.dataset.t === e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
}

/* ---------- Início ---------- */
function initHero() {
  const bar = $('#heroBar'), pct = $('#heroPct');
  const bp = $('.bar'); bp.setAttribute('aria-valuenow', D.PROGRESS);
  requestAnimationFrame(() => { bar.style.width = D.PROGRESS + '%'; });
  countTo(pct, D.PROGRESS, '%');

  // números rápidos (calculados a partir dos dados)
  const q = $$('.quick [data-count]');
  q[0].dataset.count = TOTAL_MWH;
  q[1].dataset.count = CO2_TOTAL;
  const seen = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      countTo(el, +el.dataset.count, el.dataset.suffix || '');
      o.unobserve(el);
    });
  }, { threshold: .4 });
  q.forEach(el => seen.observe(el));
}

function countTo(el, end, suffix = '') {
  if (reduceMotion) { el.textContent = nf.format(end) + suffix; return; }
  const dur = 1200, t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = nf.format(Math.round(end * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Obra ---------- */
function renderObra() {
  const label = { done: 'Concluída', now: 'Em andamento', next: 'Prevista' };
  $('#timeline').innerHTML = D.STEPS.map((s, i) => `
    <li class="step step--${s.st}">
      <span class="step__mark" aria-hidden="true">${s.st === 'done' ? '✓' : i + 1}</span>
      <h4>${esc(s.t)}</h4>
      <p>${esc(s.d)}</p>
      <div class="step__meta">
        <span class="tag tag--${s.st}">${label[s.st]}</span>
        <span class="muted">${esc(s.when)}</span>
        ${s.st === 'now' ? `<span class="mini-bar" role="img" aria-label="${s.pct}% concluído"><i style="width:${s.pct}%"></i></span><span class="muted">${s.pct}%</span>` : ''}
      </div>
    </li>`).join('');

  $('#investList').innerHTML = D.INVESTMENTS.map(i =>
    `<li><span>${esc(i.t)}</span><b>${esc(i.v)}</b></li>`).join('');

  $('#newsList').innerHTML = D.NEWS.map(n => `
    <li><time datetime="${n.d}">${fmtDate(n.d)}</time><h4>${esc(n.t)}</h4><p>${esc(n.p)}</p></li>`).join('');
}

/* ---------- Energia ---------- */
let charts = {};
function renderEnergia() {
  // KPIs
  $('#kCO2').textContent = nf.format(CO2_TOTAL) + ' t';
  $('#kMWh').textContent = nf.format(TOTAL_MWH) + ' MWh';
  $('#kHomes').textContent = nf.format(HOMES);
  $('#kTrees').textContent = nf.format(TREES);

  // Disponibilidade
  const g = $('#gauge');
  requestAnimationFrame(() => g.style.setProperty('--v', D.AVAILABILITY));
  $('#gaugeVal').textContent = D.AVAILABILITY + '%';

  // Histórico
  $('#histBody').innerHTML = D.MONTHS.map((m, i) => `
    <tr><td><b>${m}/2026</b></td><td>${nf.format(TOTAL[i])} MWh</td>
    <td>${nf1.format(Math.min(99.2, 91 + (i % 4) * 1.4 + (i > 6 ? 1.1 : 0)))}%</td>
    <td>${esc(D.HISTORY_NOTES[i])}</td></tr>`).join('');

  // Abas
  const tabs = $$('.tab');
  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(idx + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); selectTab(n);
    });
  });
  function selectTab(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
    });
    if (tab.id === 't-co2') buildCO2();
    if (tab.id === 't-geracao') buildGeracao();
  }
  buildGeracao();
}

const chartDefaults = () => {
  if (!window.Chart) return false;
  Chart.defaults.font.family = "'Figtree', system-ui, sans-serif";
  Chart.defaults.color = '#5f6c76';
  return true;
};

function buildGeracao() {
  if (charts.g || !chartDefaults()) return;
  charts.g = new Chart($('#chartGeracao'), {
    type: 'line',
    data: {
      labels: D.MONTHS,
      datasets: [
        { label: 'Eólica', data: D.WIND, borderColor: '#2f9e6e', backgroundColor: 'rgba(47,158,110,.14)', fill: true, tension: .4, pointRadius: 3, borderWidth: 2.5 },
        { label: 'Solar', data: D.SOLAR, borderColor: '#f6a93b', backgroundColor: 'rgba(246,169,59,.14)', fill: true, tension: .4, pointRadius: 3, borderWidth: 2.5 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${nf.format(c.parsed.y)} MWh` } } },
      scales: { y: { beginAtZero: true, grid: { color: '#e9eff3' }, border: { display: false } }, x: { grid: { display: false } } }
    }
  });
}

function buildCO2() {
  if (charts.c || !chartDefaults()) return;
  let acc = 0;
  const cum = CO2_MONTH.map(v => (acc += v));
  charts.c = new Chart($('#chartCO2'), {
    data: {
      labels: D.MONTHS,
      datasets: [
        { type: 'bar', label: 'CO₂ evitado no mês (t)', data: CO2_MONTH, backgroundColor: '#2f9e6e', borderRadius: 6, maxBarThickness: 36 },
        { type: 'line', label: 'Acumulado (t)', data: cum, borderColor: '#f6a93b', backgroundColor: '#f6a93b', tension: .35, pointRadius: 3, borderWidth: 2.5, yAxisID: 'y2' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${nf.format(c.parsed.y)}` } } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#e9eff3' }, border: { display: false } },
        y2: { position: 'right', beginAtZero: true, grid: { display: false }, border: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ---------- Cursos ---------- */
function courseStatus(c) {
  const left = c.vagas - c.ocup;
  const closed = left <= 0;
  return { left, closed };
}

function renderCourses() {
  const sel = (name) => $$(`input[name="${name}"]:checked`).map(i => i.value);
  const tipos = sel('tipo'), areas = sel('area'), locais = sel('local');
  const mine = new Set(store.myEnrollments().map(e => e.courseId));

  const list = D.COURSES.filter(c => tipos.includes(c.tipo) && areas.includes(c.area) && locais.includes(c.local));
  const box = $('#courses');
  if (!list.length) {
    box.innerHTML = `<div class="card empty">Nenhum curso com esses filtros. Marque mais opções na lateral para ver outros cursos.</div>`;
    return;
  }
  const areaName = { eolica: 'Eólica', solar: 'Solar', geral: 'Inclusão e trabalho' };
  box.innerHTML = list.map(c => {
    const { left, closed } = courseStatus(c);
    const done = mine.has(c.id);
    const btn = done
      ? `<button class="btn btn--ghost btn--sm" disabled>Você já se inscreveu</button>`
      : closed
        ? `<button class="btn btn--sm" disabled>Vagas esgotadas</button>`
        : `<button class="btn btn--sm" data-enroll="${c.id}">Inscrever-se</button>`;
    return `
    <article class="card course">
      <div>
        <h4>${esc(c.t)}</h4>
        <div class="course__meta">
          <span>${fmtDate(c.ini)} a ${fmtDate(c.fim)}</span>
          <span>${c.h} horas</span>
          <span>${c.local === 'online' ? 'Online' : 'Presencial'}</span>
        </div>
        <div class="step__meta" style="margin:0 0 .6rem">
          <span class="tag tag--${c.tipo === 'tecnica' ? 'parceira' : 'emprego'}">${c.tipo === 'tecnica' ? 'Técnica' : 'Básica'}</span>
          <span class="tag">${areaName[c.area]}</span>
          <span class="tag">Com certificado</span>
        </div>
        <p>${esc(c.d)}</p>
        <p class="course__req"><b>Pré-requisitos:</b> ${esc(c.req)}</p>
      </div>
      <div class="course__side">
        <span class="seats">${closed ? 'Sem vagas' : left <= 5 ? `Restam só ${left} vagas` : `${left} vagas`}</span>
        ${btn}
      </div>
    </article>`;
  }).join('');
}

function initCourses() {
  $$('.filters input').forEach(i => i.addEventListener('change', renderCourses));
  $('#courses').addEventListener('click', (e) => {
    const b = e.target.closest('[data-enroll]');
    if (b) openModal(b.dataset.enroll, b);
  });
  renderCourses();
  renderEnrollments();
}

/* Modal de inscrição */
let lastFocus = null, currentCourse = null;
function openModal(courseId, trigger) {
  currentCourse = D.COURSES.find(c => c.id === courseId);
  if (!currentCourse) return;
  lastFocus = trigger;
  $('#mTitle').textContent = currentCourse.t;
  $('#mSub').textContent = `${fmtDate(currentCourse.ini)} a ${fmtDate(currentCourse.fim)} · ${currentCourse.h} horas`;
  $('#eMsg').textContent = '';
  $('#eMsg').className = 'form-msg';
  $('#enrollForm').reset();
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#eName').focus();
}
function closeModal() {
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}
function initModal() {
  $('#mClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  addEventListener('keydown', (e) => {
    if ($('#modal').hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { // mantém o foco dentro do modal
      const f = $$('button, input', $('.modal__box')).filter(x => !x.disabled);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#enrollForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#eName').value.trim(), contact = $('#eContact').value.trim(), town = $('#eTown').value.trim();
    if (!name || !contact || !town) return;
    const btn = e.submitter; btn.disabled = true;
    try {
      await store.enroll({
        courseId: currentCourse.id, courseTitle: currentCourse.t, name, contact, town,
        ini: currentCourse.ini, fim: currentCourse.fim, h: currentCourse.h
      });
      currentCourse.ocup += 1; // reflete a vaga na tela
      closeModal();
      renderCourses(); renderEnrollments();
      toast('Inscrição confirmada! Veja em "Minhas inscrições".');
      $('#minhas').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    } catch (err) {
      console.warn(err);
      $('#eMsg').textContent = 'Não foi possível enviar a inscrição. Tente de novo em instantes.';
      $('#eMsg').className = 'form-msg err';
    } finally { btn.disabled = false; }
  });
}

/* Minhas inscrições e certificados */
function enrollState(e) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < e.ini) return { k: 'wait', label: `Inscrição confirmada · turma começa em ${fmtShort(e.ini)}` };
  if (today <= e.fim) return { k: 'run', label: 'Turma em andamento' };
  return { k: 'done', label: 'Curso concluído · certificado disponível' };
}
function renderEnrollments() {
  const items = [D.EXAMPLE_ENROLLMENT, ...store.myEnrollments()];
  $('#enrollList').innerHTML = items.map(e => {
    const st = enrollState(e);
    const title = e.courseTitle;
    return `
    <li class="enroll">
      <div>
        <b>${esc(title)}</b>${e.example ? ' <span class="tag">Exemplo</span>' : ''}
        <small>${fmtDate(e.ini)} a ${fmtDate(e.fim)} · ${e.h} horas</small>
        <small>${esc(st.label)}</small>
      </div>
      <div class="enroll__act">
        ${st.k === 'done' ? `<button class="btn btn--sm" data-cert="${e.id}">Baixar certificado</button>` : ''}
        ${!e.example && st.k === 'wait' ? `<button class="link-btn" data-cancel="${e.id}">Cancelar inscrição</button>` : ''}
      </div>
    </li>`;
  }).join('');
}
function initEnrollList() {
  $('#enrollList').addEventListener('click', (e) => {
    const c = e.target.closest('[data-cancel]');
    if (c) {
      const item = store.myEnrollments().find(x => x.id === c.dataset.cancel);
      store.cancelEnrollment(c.dataset.cancel);
      const course = D.COURSES.find(x => x.id === item?.courseId);
      if (course) course.ocup = Math.max(0, course.ocup - 1);
      renderCourses(); renderEnrollments();
      toast('Inscrição cancelada.');
      return;
    }
    const d = e.target.closest('[data-cert]');
    if (d) {
      const item = d.dataset.cert === 'exemplo' ? D.EXAMPLE_ENROLLMENT : store.myEnrollments().find(x => x.id === d.dataset.cert);
      if (item) downloadCertificate(item);
    }
  });
}

/* Certificado simples gerado no navegador (PNG) */
function downloadCertificate(e) {
  const c = document.createElement('canvas'); c.width = 1600; c.height = 1130;
  const x = c.getContext('2d');
  x.fillStyle = '#f3f7fa'; x.fillRect(0, 0, c.width, c.height);
  x.strokeStyle = '#2f9e6e'; x.lineWidth = 14; x.strokeRect(40, 40, c.width - 80, c.height - 80);
  x.strokeStyle = '#f6a93b'; x.lineWidth = 3; x.strokeRect(66, 66, c.width - 132, c.height - 132);
  x.textAlign = 'center';
  x.fillStyle = '#1f7a53'; x.font = '700 64px Outfit, sans-serif'; x.fillText('Certificado de conclusão', c.width / 2, 260);
  x.fillStyle = '#5f6c76'; x.font = '32px Figtree, sans-serif'; x.fillText('A Casa Renovável certifica que', c.width / 2, 400);
  x.fillStyle = '#1d2a33'; x.font = '700 68px Outfit, sans-serif'; x.fillText((e.name || 'Participante').replace(' (exemplo)', ''), c.width / 2, 520);
  x.fillStyle = '#5f6c76'; x.font = '32px Figtree, sans-serif'; x.fillText('concluiu o curso', c.width / 2, 610);
  x.fillStyle = '#2f9e6e'; x.font = '600 52px Outfit, sans-serif'; x.fillText(e.courseTitle, c.width / 2, 700);
  x.fillStyle = '#5f6c76'; x.font = '30px Figtree, sans-serif';
  x.fillText(`Carga horária: ${e.h} horas · ${fmtDate(e.ini)} a ${fmtDate(e.fim)}`, c.width / 2, 780);
  x.font = '600 28px Figtree, sans-serif'; x.fillText('Parque Energia Viva · Casa dos Ventos', c.width / 2, 960);
  x.font = '22px Figtree, sans-serif'; x.fillText('Documento de demonstração, sem valor legal.', c.width / 2, 1000);
  const logo = new Image();
  logo.onload = () => {
    x.drawImage(logo, c.width / 2 - 130, 80 + 20, 260, 153);
    save();
  };
  logo.onerror = save;
  logo.src = 'assets/logo.png';
  function save() {
    const a = document.createElement('a');
    a.download = 'certificado-casa-renovavel.png';
    a.href = c.toDataURL('image/png');
    a.click();
    toast('Certificado baixado.');
  }
}

/* ---------- Vagas ---------- */
function renderJobs(filter = 'todas') {
  const interest = store.jobInterests();
  const names = { emprego: 'Emprego', estagio: 'Estágio', parceira: 'Empresa parceira' };
  const list = D.JOBS.filter(j => filter === 'todas' || j.tipo === filter);
  $('#jobs').innerHTML = list.map(j => `
    <article class="card job">
      <span class="tag tag--${j.tipo}" style="align-self:flex-start">${names[j.tipo]}</span>
      <h4>${esc(j.t)}</h4>
      <div class="job__co">${esc(j.co)} · ${esc(j.loc)}</div>
      <p>${esc(j.d)}</p>
      <div class="job__foot">
        <span>Publicada em ${fmtShort(j.date)}</span>
        <button class="btn btn--sm ${interest.has(j.id) ? 'btn--ghost' : ''}" data-job="${j.id}" aria-pressed="${interest.has(j.id)}">
          ${interest.has(j.id) ? 'Interesse registrado' : 'Tenho interesse'}
        </button>
      </div>
    </article>`).join('');
}
function initJobs() {
  let cur = 'todas';
  $('#jobChips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach(c => c.classList.toggle('is-active', c === b));
    cur = b.dataset.job; renderJobs(cur);
  });
  $('#jobs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-job]'); if (!b) return;
    const on = store.toggleJobInterest(b.dataset.job);
    toast(on ? 'Interesse registrado. Em um projeto real, a empresa entraria em contato.' : 'Interesse removido.');
    renderJobs(cur);
  });
  renderJobs();
}

/* ---------- Comunidade: comentários ---------- */
const TYPE_LABEL = { opiniao: 'Opinião', duvida: 'Dúvida', sugestao: 'Sugestão' };
const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
const COLORS = ['#e4f4ec', '#fff1da', '#e3eef5', '#f3e6f4', '#fbe9e6'];

function timeAgo(ms) {
  const m = Math.max(1, Math.round((Date.now() - ms) / 60000));
  if (m < 60) return `${m} min atrás`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h atrás`;
  const d = Math.round(h / 24); return d === 1 ? 'ontem' : `${d} dias atrás`;
}

let remoteComments = [];
function renderComments() {
  const liked = store.likedSet();
  const seeds = D.SEED_COMMENTS.map(s => ({ ...s, createdAt: Date.now() - s.ago * 60000 }));
  const all = [...remoteComments, ...seeds].sort((a, b) => b.createdAt - a.createdAt);
  $('#cCount').textContent = all.length;

  $('#commentList').innerHTML = all.map(c => {
    const isLiked = liked.has(c.id);
    const n = (c.likes || 0) + (c.id.startsWith('s') && isLiked ? 1 : 0);
    const color = COLORS[c.name.length % COLORS.length];
    const avatar = c.photo
      ? `<img class="avatar" src="${esc(c.photo)}" alt="" loading="lazy" width="44" height="44" data-ini="${esc(initials(c.name))}" data-bg="${color}">`
      : `<span class="avatar" style="background:${color}">${esc(initials(c.name))}</span>`;
    return `
    <li class="comment">
      ${avatar}
      <div>
        <div class="comment__top">
          <b>${esc(c.name)}</b>
          <span class="tag tag--${esc(c.type)}">${TYPE_LABEL[c.type] || 'Opinião'}</span>
          <time>${timeAgo(c.createdAt)}</time>
        </div>
        <p>${esc(c.text)}</p>
        <div class="comment__acts">
          <button data-like="${esc(c.id)}" class="${isLiked ? 'liked' : ''}" aria-pressed="${isLiked}">${isLiked ? 'Curtiu' : 'Curtir'} · ${n}</button>
        </div>
        ${c.reply ? `<div class="reply"><b>${esc(c.reply.by)}</b><p>${esc(c.reply.text)}</p></div>` : ''}
      </div>
    </li>`;
  }).join('');

  // se a foto não carregar, mostra as iniciais
  $$('#commentList img.avatar').forEach(img => {
    const fallback = () => {
      const sp = document.createElement('span');
      sp.className = 'avatar';
      sp.style.background = img.dataset.bg;
      sp.textContent = img.dataset.ini;
      img.replaceWith(sp);
    };
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.src) setTimeout(() => { if (img.isConnected && img.naturalWidth === 0 && img.complete) fallback(); }, 0);
  });
}

function initComments() {
  const txt = $('#cText'), left = $('#cLeft');
  txt.addEventListener('input', () => { left.textContent = 400 - txt.value.length; });

  $('#commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#cName').value.trim(), text = txt.value.trim(), type = $('#cType').value;
    if (!name || !text) return;
    const btn = e.submitter; btn.disabled = true;
    try {
      await store.addComment({ name, type, text });
      txt.value = ''; left.textContent = 400;
      toast('Comentário publicado. Obrigado por participar!');
    } catch (err) {
      console.warn(err);
      toast('Não foi possível publicar agora. Tente de novo.');
    } finally { btn.disabled = false; }
  });

  $('#commentList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-like]'); if (!b) return;
    await store.toggleLike(b.dataset.like);
    renderComments();
  });

  store.subscribeComments((list) => { remoteComments = list; renderComments(); });
}

/* ---------- Comunidade: avaliações ---------- */
let remoteRatings = [];
const starSVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z"/></svg>';

function renderRatings() {
  const counts = { ...D.SEED_RATINGS };
  remoteRatings.forEach(r => { counts[r.stars] = (counts[r.stars] || 0) + 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const avg = [5, 4, 3, 2, 1].reduce((s, k) => s + k * counts[k], 0) / total;
  $('#avgScore').textContent = nf1.format(avg);
  $('#rateCount').textContent = nf.format(total);
  $('#avgStars').innerHTML = [1, 2, 3, 4, 5].map(i => `<span class="star ${avg >= i - .25 ? 'on' : ''}">${starSVG}</span>`).join('');
  $('#rateBars').innerHTML = [5, 4, 3, 2, 1].map(k => `
    <li><span>${k}</span><span class="mini-bar"><i style="width:${(counts[k] / total * 100).toFixed(1)}%"></i></span><span>${counts[k]}</span></li>`).join('');
}

function initRatings() {
  let pick = 0;
  const picker = $('#starPicker');
  picker.innerHTML = [1, 2, 3, 4, 5].map(i =>
    `<button type="button" class="star" role="radio" aria-checked="false" aria-label="${i} ${i > 1 ? 'estrelas' : 'estrela'}" data-v="${i}">${starSVG}</button>`).join('');
  const paint = (v) => $$('.star', picker).forEach((s, i) => {
    s.classList.toggle('on', i < v);
    s.setAttribute('aria-checked', i + 1 === pick);
  });
  picker.addEventListener('click', (e) => { const b = e.target.closest('.star'); if (b) { pick = +b.dataset.v; paint(pick); } });
  picker.addEventListener('mouseover', (e) => { const b = e.target.closest('.star'); if (b) paint(+b.dataset.v); });
  picker.addEventListener('mouseleave', () => paint(pick));

  $('#rateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = $('#rateMsg'); msg.className = 'form-msg';
    const topic = $('#rateTopic').value;
    if (!pick) { msg.textContent = 'Escolha uma nota de 1 a 5 estrelas.'; msg.classList.add('err'); return; }
    if (store.ratedTopics()[topic]) { msg.textContent = 'Você já avaliou este tema neste navegador.'; msg.classList.add('err'); return; }
    try {
      await store.addRating({ topic, stars: pick });
      msg.textContent = 'Avaliação enviada. Obrigado!';
      pick = 0; paint(0);
    } catch (err) {
      console.warn(err);
      msg.textContent = 'Não foi possível enviar agora. Tente de novo.'; msg.classList.add('err');
    }
  });

  store.subscribeRatings((list) => { remoteRatings = list; renderRatings(); });
}

/* ---------- Início da aplicação ---------- */
async function main() {
  initNav();
  initHero();
  renderObra();
  renderEnergia();
  initModal();
  initCourses();
  initEnrollList();
  initJobs();

  const mode = await store.init();
  const badge = $('#modeBadge');
  badge.textContent = mode === 'firebase' ? 'Salvando no Firebase' : 'Modo demonstração';
  badge.classList.toggle('live', mode === 'firebase');
  badge.title = mode === 'firebase'
    ? 'Os comentários ficam salvos no Firestore e aparecem para todos.'
    : 'Os comentários ficam salvos só neste navegador. Configure o Firebase para compartilhar.';

  initComments();
  initRatings();
}
main();
