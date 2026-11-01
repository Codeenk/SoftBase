/* ============================================================================
   SoftBase Services — site engine
   Loader, smooth scroll, custom cursor, Three.js hero field, marquee,
   capability tabs, live build planner, reveals, FAQ, contact form.
   ========================================================================== */

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils';
import solarIcons from './data/icons.json';

import {
  company,
  services,
  process,
  stack,
  engagement,
  faqs,
  nav,
  plannerProductTypes,
  plannerFeatures,
  plannerTimelines,
  plannerTeamSizes,
  plannerBaseStacks,
} from './data/site-data.js';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------- utilities */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const HEADER_H = 76;

function iconSVG(name, cls = 'icon') {
  const data = getIconData(solarIcons, name.replace(/^solar:/, ''));
  if (!data) return '';
  const { attributes, body } = iconToSVG(data, {});
  return iconToHTML(body, { ...attributes, class: cls, 'aria-hidden': 'true', focusable: 'false' });
}

function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const frag = document.createDocumentFragment();
  const words = text.split(/\s+/);
  words.forEach((word, i) => {
    const mask = document.createElement('span');
    mask.className = 'split-word';
    mask.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'split-word__i';
    inner.textContent = word;
    mask.appendChild(inner);
    frag.appendChild(mask);
    if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
  });
  el.appendChild(frag);
  el.classList.add('is-splitting');
  return $$('.split-word__i', el);
}

const checkSVG =
  '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" /></svg>';
const arrowSVG =
  '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>';
const plusSVG =
  '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>';

/* =================================================================== BOOT */

const state = {
  lenis: null,
  planner: {
    product: 'web',
    features: new Set(['integrations']),
    timeline: 'one-to-three',
    team: 'small',
    budget: '',
    budgetUnsure: false,
  },
  capIndex: 0,
  capTimer: null,
  heroActive: true,
};

document.documentElement.classList.add('is-locked');
document.body.classList.add('is-locked');

function boot() {
  buildNav();
  buildCapabilities();
  buildPlanner();
  buildSteps();
  buildStack();
  buildPlans();
  buildFaq();
  buildInquiryForm();
  $('#year').textContent = String(new Date().getFullYear());
  startClock();
}

/* --------------------------------------------------------- inquiry form build */

const inquiryServices = [
  'Product engineering',
  'Platforms & integrations',
  'Data & applied AI',
  'Modernisation',
  'Not sure yet',
];

function buildInquiryForm() {
  const chips = $('#f-services');
  if (chips) {
    chips.innerHTML = inquiryServices
      .map(
        (sv) => `
        <label class="pchip">
          <input class="sr-only" type="checkbox" name="services" value="${sv}" />
          <span class="pchip__body">${sv}</span>
        </label>`
      )
      .join('');
  }
  const timeline = $('#f-timeline');
  if (timeline) {
    timeline.innerHTML =
      '<option value="">Select a timeline</option>' +
      plannerTimelines.map((t) => `<option value="${t.label}">${t.label}</option>`).join('');
  }
}

/* -------------------------------------------------------------------- nav */

function buildNav() {
  const list = $('#nav-list');
  list.innerHTML = nav
    .map(
      (item) =>
        `<li><a href="${item.href}" data-cursor="go">${item.label}</a></li>`
    )
    .join('');
}

function startClock() {
  const timeEl = $('#nav-clock-time');
  const tzEl = $('.nav__clock-tz');
  if (!timeEl) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
  const tick = () => {
    const parts = fmt.formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
    timeEl.textContent = `${get('hour')}:${get('minute')}:${get('second')}`;
    if (tzEl) tzEl.textContent = 'IST';
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------ capabilities */

function buildCapabilities() {
  const list = $('#cap-list');
  const panel = $('#cap-panel');
  if (!list || !panel) return;

  list.innerHTML = services
    .map(
      (s, i) => `
      <button class="cap__tab" type="button" role="tab" id="cap-tab-${s.id}"
        aria-selected="${i === 0}" aria-controls="cap-panel" data-index="${i}">
        <span class="cap__tab-index">${s.index}</span>
        <span class="cap__tab-title">${s.title}</span>
        <span class="cap__tab-arrow">${arrowSVG}</span>
      </button>`
    )
    .join('');

  renderCapPanel(panel, 0);

  $$('.cap__tab', list).forEach((tab) => {
    tab.addEventListener('click', () => {
      selectCap(Number(tab.dataset.index));
      pauseCapRotation();
    });
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        selectCap((state.capIndex + 1) % services.length);
        $(`.cap__tab[data-index="${state.capIndex}"]`, list).focus();
        pauseCapRotation();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        selectCap((state.capIndex - 1 + services.length) % services.length);
        $(`.cap__tab[data-index="${state.capIndex}"]`, list).focus();
        pauseCapRotation();
      }
    });
  });

  if (!reducedMotion) {
    state.capTimer = setInterval(() => selectCap((state.capIndex + 1) % services.length), 6500);
    panel.addEventListener('pointerenter', pauseCapRotation);
  }
}

function pauseCapRotation() {
  if (state.capTimer) {
    clearInterval(state.capTimer);
    state.capTimer = null;
  }
}

function selectCap(i) {
  state.capIndex = i;
  $$('.cap__tab').forEach((tab) => {
    tab.setAttribute('aria-selected', String(Number(tab.dataset.index) === i));
  });
  const panel = $('#cap-panel');
  renderCapPanel(panel, i);
  if (!reducedMotion) {
    gsap.fromTo(
      panel.children,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.05, overwrite: true }
    );
  }
}

function renderCapPanel(panel, i) {
  const s = services[i];
  panel.innerHTML = `
    <div class="cap__panel-icon">${iconSVG(s.icon, 'icon icon--lg')}</div>
    <h3 class="cap__panel-title">${s.title}</h3>
    <p class="cap__panel-summary">${s.summary}</p>
    <p class="cap__panel-detail">${s.detail}</p>
    <ul class="cap__panel-list">${s.capabilities.map((c) => `<li>${c}</li>`).join('')}</ul>`;
}

/* ---------------------------------------------------------------- planner */

const plannerCore = {
  web: {
    cost: 26,
    weeks: 9,
    modules: ['Auth, roles & session handling', 'Application shell & core flows', 'Admin & moderation surfaces'],
  },
  mobile: {
    cost: 34,
    weeks: 12,
    modules: ['Native shells for iOS & Android', 'Auth & device session handling', 'Push & background sync layer'],
  },
  internal: {
    cost: 18,
    weeks: 7,
    modules: ['Role-based access control', 'Core workflow screens', 'Audit log & export'],
  },
  api: {
    cost: 28,
    weeks: 10,
    modules: ['API gateway & versioning', 'Auth & rate limiting', 'Service layer & persistence'],
  },
  data: {
    cost: 30,
    weeks: 11,
    modules: ['Ingestion & orchestration layer', 'Warehouse models & tests', 'Reporting surface'],
  },
};

function buildPlanner() {
  const wrap = $('[data-planner]');
  if (!wrap) return;

  $('#planner-product').innerHTML = plannerProductTypes
    .map(
      (p) => `
      <label class="pcard">
        <input class="sr-only" type="radio" name="planner-product" value="${p.id}"
          ${p.id === state.planner.product ? 'checked' : ''} />
        <span class="pcard__body">${iconSVG(p.icon, 'icon')}<span>${p.label}</span></span>
      </label>`
    )
    .join('');

  $('#planner-features').innerHTML = plannerFeatures
    .map(
      (f) => `
      <label class="pchip">
        <input class="sr-only" type="checkbox" name="planner-features" value="${f.id}"
          ${state.planner.features.has(f.id) ? 'checked' : ''} />
        <span class="pchip__body">${f.label}</span>
      </label>`
    )
    .join('');

  $('#planner-timeline').innerHTML = plannerTimelines
    .map(
      (t) => `
      <label class="pchip">
        <input class="sr-only" type="radio" name="planner-timeline" value="${t.id}"
          ${t.id === state.planner.timeline ? 'checked' : ''} />
        <span class="pchip__body">${t.label}</span>
      </label>`
    )
    .join('');

  $('#planner-team').innerHTML = plannerTeamSizes
    .map(
      (t) => `
      <label class="pchip">
        <input class="sr-only" type="radio" name="planner-team" value="${t.id}"
          ${t.id === state.planner.team ? 'checked' : ''} />
        <span class="pchip__body">${t.label}</span>
      </label>`
    )
    .join('');

  wrap.addEventListener('change', () => {
    state.planner.product = wrap.querySelector('input[name="planner-product"]:checked')?.value ?? 'web';
    state.planner.features = new Set(
      [...wrap.querySelectorAll('input[name="planner-features"]:checked')].map((i) => i.value)
    );
    state.planner.timeline = wrap.querySelector('input[name="planner-timeline"]:checked')?.value ?? 'standard';
    state.planner.team = wrap.querySelector('input[name="planner-team"]:checked')?.value ?? 'small';
    state.planner.budget = $('#planner-budget')?.value.trim() ?? '';
    state.planner.budgetUnsure = $('#planner-budget-unsure')?.checked ?? false;
    renderPlan();
  });

  renderPlan();
}

function computePlan() {
  const { product, features, timeline, team } = state.planner;
  const core = plannerCore[product];
  const tFactor = plannerTimelines.find((t) => t.id === timeline)?.factor ?? 1;
  const teamFactor = plannerTeamSizes.find((t) => t.id === team)?.factor ?? 1;

  let featureMult = 1;
  features.forEach((id) => {
    const f = plannerFeatures.find((x) => x.id === id);
    if (f) featureMult *= f.cost;
  });

  const cost = core.cost * featureMult * tFactor * teamFactor;
  const size =
    cost < 24 ? 'Focused' : cost < 34 ? 'Standard' : cost < 48 ? 'Extensive' : 'Full-scale';
  const weeks = Math.max(
    4,
    Math.round(core.weeks * Math.pow(featureMult, 0.4) * tFactor * Math.pow(teamFactor, 0.35))
  );

  const modules = [
    ...core.modules,
    ...[...features]
      .map((id) => plannerFeatures.find((x) => x.id === id)?.module)
      .filter(Boolean),
  ];

  const base = plannerBaseStacks[product];

  return {
    size,
    weeks,
    modules,
    stack: base.stack,
    note: base.note,
    considerations: base.considerations ?? [],
  };
}

function renderPlan() {
  const plan = computePlan();
  const el = $('#plan');
  if (!el) return;

  el.innerHTML = `
    <div class="plan__head">
      <span>Preliminary scope · not a quote</span>
      <span class="plan__head-dot" aria-hidden="true"></span>
    </div>
    <div class="plan__body">
      <dl class="plan__row">
        <dt>Preliminary scale</dt>
        <dd class="plan__size">${plan.size} <span>(indicative)</span></dd>
      </dl>
      <dl class="plan__row">
        <dt>To first release</dt>
        <dd class="plan__timeline">≈ ${plan.weeks} weeks</dd>
      </dl>
      <dl class="plan__row">
        <dt>Suggested direction</dt>
        <dd><ul class="plan__stack">${plan.stack.map((s) => `<li>${s}</li>`).join('')}</ul></dd>
      </dl>
      <dl class="plan__row">
        <dt>Potential modules</dt>
        <dd><ul class="plan__modules">${plan.modules.map((m) => `<li>${m}</li>`).join('')}</ul></dd>
      </dl>
      <dl class="plan__row">
        <dt>Questions for discovery</dt>
        <dd><ul class="plan__modules">${plan.considerations.map((m) => `<li>${m}</li>`).join('')}</ul></dd>
      </dl>
      <p class="plan__note">${plan.note}</p>
      <button class="btn btn--signal plan__cta" type="button" id="plan-discuss" data-cursor="go">
        <span>Discuss this project with SoftBase</span>${arrowSVG}
      </button>
    </div>
    <div class="plan__foot">A starting sketch, not a final specification or delivery commitment</div>`;

  $('#plan-discuss')?.addEventListener('click', transferPlannerToInquiry);

  if (!reducedMotion) {
    gsap.fromTo(
      $$('.plan__body > *, .plan__head, .plan__foot', el),
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, overwrite: true }
    );
  }
}

/* ------------------------------------------------- planner -> inquiry handoff */

function transferPlannerToInquiry() {
  const { product, features, timeline, team } = state.planner;
  // read the budget inputs live: typing may not have fired a change event yet
  const budget = $('#planner-budget')?.value.trim() ?? '';
  const budgetUnsure = $('#planner-budget-unsure')?.checked ?? false;
  const plan = computePlan();
  const productLabel = plannerProductTypes.find((p) => p.id === product)?.label ?? product;
  const featureLabels = [...features]
    .map((id) => plannerFeatures.find((f) => f.id === id)?.label)
    .filter(Boolean);
  const timelineLabel = plannerTimelines.find((t) => t.id === timeline)?.label ?? '';
  const teamLabel = plannerTeamSizes.find((t) => t.id === team)?.label ?? '';
  const budgetText = budgetUnsure ? 'Not sure yet' : budget ? budget : 'Not sure yet';

  const summary = [
    `[Build planner] ${productLabel}`,
    featureLabels.length ? `Features: ${featureLabels.join(', ')}` : '',
    timelineLabel ? `Timeline: ${timelineLabel}` : '',
    teamLabel ? `Serves: ${teamLabel}` : '',
    `Preliminary scale: ${plan.size} (indicative), ≈${plan.weeks} weeks to first release`,
  ]
    .filter(Boolean)
    .join('\n');

  const brief = $('#f-brief');
  if (brief) {
    brief.value = brief.value.trim()
      ? `${summary}\n\n${brief.value.trim()}`
      : `${summary}\n\n`;
  }
  const budgetField = $('#f-budget');
  if (budgetField && !budgetField.value.trim()) budgetField.value = budgetText;
  const budgetRadio = document.querySelector(
    `input[name="budget-status"][value="${budgetUnsure || !budget ? 'Not decided' : 'Decided'}"]`
  );
  if (budgetRadio) budgetRadio.checked = true;

  scrollToTarget('#contact');
  if (!reducedMotion) {
    gsap.fromTo(
      '.cform',
      { scale: 0.99 },
      { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
    );
  }
}

/* ------------------------------------------------------ steps / cases / stack */

function buildSteps() {
  const ol = $('#steps');
  if (!ol) return;
  ol.innerHTML = process
    .map(
      (p) => `
      <li class="step">
        <div class="step__top">
          <span class="step__index">${p.index}</span>
          <span class="step__duration">${p.duration}</span>
        </div>
        <h3 class="step__title">${p.title}</h3>
        <p class="step__body">${p.body}</p>
        <ul class="step__outputs">${p.outputs.map((o) => `<li>${o}</li>`).join('')}</ul>
      </li>`
    )
    .join('');
}

function buildStack() {
  const grid = $('#stack-grid');
  if (!grid) return;
  grid.innerHTML = stack
    .map(
      (g) => `
      <div class="stack__group">
        <h3>${g.group}</h3>
        <ul class="stack__items">${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>`
    )
    .join('');
}

function buildPlans() {
  const wrap = $('#plans');
  if (!wrap) return;
  wrap.innerHTML = engagement
    .map(
      (p) => `
      <article class="plan-card${p.featured ? ' plan-card--featured' : ''}">
        ${p.featured ? '<span class="plan-card__flag">Most chosen</span>' : ''}
        <div class="plan-card__icon">${iconSVG(p.icon, 'icon icon--lg')}</div>
        <div>
          <h3 class="plan-card__name">${p.name}</h3>
          <p class="plan-card__kicker">${p.kicker}</p>
        </div>
        <p class="plan-card__price"><b>${p.budget}</b><span>${p.unit}</span></p>
        <p class="plan-card__body">${p.body}</p>
        <ul class="plan-card__includes">
          ${p.includes.map((i) => `<li>${checkSVG}<span>${i}</span></li>`).join('')}
        </ul>
        <a class="btn ${p.featured ? 'btn--signal' : 'btn--ghost'}" href="#contact" data-cursor="go">
          <span>${p.featured ? 'Start a build' : 'Talk it through'}</span>${arrowSVG}
        </a>
      </article>`
    )
    .join('');
}

function buildFaq() {
  const list = $('#faq-list');
  if (!list) return;
  list.innerHTML = faqs
    .map(
      (f, i) => `
      <div class="faq-item">
        <button class="faq-item__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
          <span>${f.q}</span>
          <span class="faq-item__icon">${plusSVG}</span>
        </button>
        <div class="faq-item__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
          <div class="faq-item__a-inner"><p>${f.a}</p></div>
        </div>
      </div>`
    )
    .join('');

  $$('.faq-item__q', list).forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('is-open');
      $$('.faq-item.is-open', list).forEach((other) => {
        other.classList.remove('is-open');
        $('.faq-item__q', other).setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================================================================ LOADER */

const loaderStatuses = [
  [0, 'initialising build environment'],
  [22, 'resolving modules'],
  [46, 'compiling interfaces'],
  [68, 'running acceptance checks'],
  [88, 'deploying to production'],
];

function initLoader() {
  const loader = $('#loader');
  const num = $('#loader-num');
  const fill = $('#loader-fill');
  const status = $('#loader-status');

  const finish = () => {
    loader.classList.add('is-done');
    document.documentElement.classList.remove('is-locked');
    document.body.classList.remove('is-locked');
    state.lenis?.start();
    heroIntro();
    setTimeout(() => loader.remove(), 900);
  };

  if (reducedMotion) {
    num.textContent = '100';
    fill.style.transform = 'scaleX(1)';
    finish();
    return;
  }

  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.9,
    ease: 'power2.inOut',
    onUpdate: () => {
      num.textContent = String(Math.round(counter.v)).padStart(3, '0');
      fill.style.transform = `scaleX(${counter.v / 100})`;
      for (let i = loaderStatuses.length - 1; i >= 0; i--) {
        if (counter.v >= loaderStatuses[i][0]) {
          status.textContent = loaderStatuses[i][1];
          break;
        }
      }
    },
    onComplete: finish,
  });
}

/* ============================================================ HERO INTRO */

function heroIntro() {
  const title = $('.hero__title');
  if (reducedMotion || !title) return;

  if (!title.classList.contains('is-splitting')) splitWords(title);
  const words = $$('.split-word__i', title);
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.add(() => $('#hero-canvas')?.classList.add('is-on'), 0)
    .fromTo(
      words,
      { yPercent: 112, y: 112 },
      { yPercent: 0, y: 0, duration: 1.05, stagger: 0.055 },
      0.05
    )
    .fromTo('.hero__lede', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.5)
    .fromTo('.hero__actions > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.62)
    .fromTo('.hero__stats', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 0.8)
    .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.0);
}

/* ============================================================ SMOOTH SCROLL */

function initLenis() {
  if (reducedMotion) return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  state.lenis = lenis;
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(hash) {
  const target = $(hash);
  if (!target) return;
  if (state.lenis) {
    state.lenis.scrollTo(target, { offset: -HEADER_H + 1, duration: 1.4 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - HEADER_H + 1;
    window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    const target = $(hash);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(hash);
  });
}

/* ================================================================= NAV UI */

function initNavScroll() {
  const navEl = $('#nav');
  let lastY = 0;

  const onScroll = (y) => {
    navEl.classList.toggle('is-scrolled', y > 24);
    // the nav never hides on small screens (the burger is the only navigation)
    // and never while the mobile menu is open — the fixed overlay lives inside it
    if (window.innerWidth <= 900 || isMenuOpen()) {
      navEl.classList.remove('is-hidden');
      lastY = y;
      return;
    }
    if (y > 520 && y > lastY + 4) navEl.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 520) navEl.classList.remove('is-hidden');
    lastY = y;
  };

  if (state.lenis) {
    state.lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  } else {
    window.addEventListener(
      'scroll',
      () => onScroll(window.scrollY),
      { passive: true }
    );
  }
}

function initActiveSection() {
  const links = new Map();
  $$('#nav-list a').forEach((a) => links.set(a.getAttribute('href'), a));
  links.forEach((a, href) => {
    const section = $(href);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove('is-active'));
          a.classList.add('is-active');
        }
      },
    });
  });
}

function isMenuOpen() {
  return $('#nav-links').classList.contains('is-open');
}

function openMenu() {
  $('#nav-links').classList.add('is-open');
  $('#nav-burger').setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('is-locked');
  document.body.classList.add('is-locked');
  $('#nav').classList.remove('is-hidden');
  state.lenis?.stop();
  $('#nav-close').focus();
}

function closeMenu() {
  if (!isMenuOpen()) return;
  $('#nav-links').classList.remove('is-open');
  $('#nav-burger').setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('is-locked');
  document.body.classList.remove('is-locked');
  state.lenis?.start();
}

function initMenu() {
  $('#nav-burger').addEventListener('click', () => {
    const open = $('#nav-burger').getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });
  $('#nav-close').addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ================================================================= CURSOR */

function initCursor() {
  if (!finePointer || reducedMotion) return;
  const cursor = $('#cursor');
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  const bubble = $('.cursor__bubble');
  const label = $('#cursor-label');
  if (!cursor || !ring || !bubble) return;

  gsap.set([dot, ring, bubble], { xPercent: -50, yPercent: -50 });
  gsap.set(bubble, { scale: 0.4, autoAlpha: 0 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });
  const bubX = gsap.quickTo(bubble, 'x', { duration: 0.35, ease: 'power2.out' });
  const bubY = gsap.quickTo(bubble, 'y', { duration: 0.35, ease: 'power2.out' });

  const setRingScale = (s, ease = 'power3.out') =>
    gsap.to(ring, { scale: s, duration: 0.35, ease, overwrite: 'auto' });

  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (!shown) {
        shown = true;
        cursor.classList.add('is-active');
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      bubX(e.clientX);
      bubY(e.clientY);
    },
    { passive: true }
  );

  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    if (labelled) {
      label.textContent = labelled.getAttribute('data-cursor');
      cursor.classList.add('is-labelled');
      setRingScale(1);
      gsap.to(bubble, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', overwrite: 'auto' });
      gsap.to(ring, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
      return;
    }
    if (cursor.classList.contains('is-labelled')) {
      cursor.classList.remove('is-labelled');
      gsap.to(bubble, { scale: 0.4, autoAlpha: 0, duration: 0.3, ease: 'power3.in', overwrite: 'auto' });
      gsap.to(ring, { autoAlpha: 1, duration: 0.25, overwrite: 'auto' });
    }
    const interactive = e.target.closest('a, button, label, input, textarea, select, summary');
    setRingScale(interactive ? 1.55 : 1);
  });

  document.addEventListener('pointerdown', () => setRingScale(0.75, 'power2.out'));
  document.addEventListener('pointerup', () => setRingScale(1.1, 'back.out(3)'));
}

function initMagnetic() {
  if (!finePointer || reducedMotion) return;
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ============================================================ MARQUEE */

function initMarquee() {
  const marquee = $('[data-marquee]');
  if (!marquee) return;
  const track = $('.marquee__track', marquee);
  const group = $('.marquee__group', marquee);
  const speed = parseFloat(marquee.dataset.speed || '1');

  const build = () => {
    $$('.marquee__group', track).slice(1).forEach((g) => g.remove());
    gsap.set(track, { x: 0 });
    const groupW = group.offsetWidth;
    if (!groupW) return;
    const need = Math.max(2, Math.ceil((window.innerWidth * 2.2) / groupW));
    const total = need % 2 === 0 ? need : need + 1;
    for (let i = 1; i < total; i++) track.appendChild(group.cloneNode(true));
    return (total * groupW) / 2;
  };

  if (reducedMotion) {
    build();
    return;
  }

  let half = build();
  const tween = gsap.to(track, {
    x: () => -half,
    duration: () => half / (60 * speed),
    ease: 'none',
    repeat: -1,
  });

  let rs;
  window.addEventListener('resize', () => {
    clearTimeout(rs);
    rs = setTimeout(() => {
      half = build();
      tween.invalidate();
    }, 200);
  });

  // scroll velocity feeds the band's speed and skew
  const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power2.out' });
  let velocity = 0;
  if (state.lenis) {
    state.lenis.on('scroll', ({ velocity: v }) => (velocity = v));
  } else {
    let lastSY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        velocity = y - lastSY;
        lastSY = y;
      },
      { passive: true }
    );
  }
  gsap.ticker.add(() => {
    const boost = 1 + Math.min(Math.abs(velocity) * 0.05, 2.5);
    tween.timeScale(gsap.utils.interpolate(tween.timeScale(), boost, 0.08));
    skewTo(gsap.utils.clamp(-8, 8, velocity * 0.35));
    velocity *= 0.92;
  });
}

function initFooterWordmark() {
  const el = $('[data-scroll-velocity]');
  if (!el || reducedMotion) return;
  const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'power2.out' });
  let velocity = 0;
  if (state.lenis) state.lenis.on('scroll', ({ velocity: v }) => (velocity = v));
  gsap.ticker.add(() => {
    skewTo(gsap.utils.clamp(-7, 7, velocity * 0.4));
    velocity *= 0.9;
  });
}

/* ============================================================ COUNTERS */

function initCounters() {
  $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    if (reducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        }),
    });
  });
}

/* ============================================================ THREE.JS HERO */

function initHeroField() {
  const canvas = $('#hero-canvas');
  const wrap = canvas?.closest('.hero__canvas-wrap');
  if (!canvas || !wrap) return;
  if (reducedMotion) {
    canvas.classList.add('is-on');
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.classList.add('is-on');
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0b0c, 16, 34);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 7.2, 15);
  camera.lookAt(0, 1.2, 0);

  scene.add(new THREE.AmbientLight(0x25252b, 2.4));
  const key = new THREE.DirectionalLight(0xfff3ea, 2.6);
  key.position.set(6, 10, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff3b14, 42, 26, 1.8);
  rim.position.set(-9, 3.5, 3);
  scene.add(rim);

  const COLS = 26;
  const ROWS = 14;
  const SPACING = 1.14;
  const count = COLS * ROWS;
  const geo = new THREE.BoxGeometry(0.62, 1, 0.62);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2c2c33, roughness: 0.38, metalness: 0.55 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const signal = new THREE.Color(0xff3b14);
  const base = new THREE.Color(0xffffff);
  const positions = [];
  let i = 0;
  for (let cx = 0; cx < COLS; cx++) {
    for (let cz = 0; cz < ROWS; cz++) {
      const x = (cx - (COLS - 1) / 2) * SPACING;
      const z = (cz - (ROWS - 1) / 2) * SPACING - 1;
      positions.push({ x, z });
      mesh.setColorAt(i, Math.random() < 0.07 ? signal : base);
      i++;
    }
  }
  mesh.instanceColor.needsUpdate = true;
  scene.add(mesh);

  const dummy = new THREE.Object3D();

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // pause rendering when the hero is off screen
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (state.heroActive = self.isActive),
  });

  let scrollP = 0;
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => (scrollP = self.progress),
  });

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  const clock = new THREE.Clock();
  gsap.ticker.add(() => {
    if (!state.heroActive || document.hidden) return;
    const t = clock.getElapsedTime();

    mouse.x += (mouse.tx - mouse.x) * 0.045;
    mouse.y += (mouse.ty - mouse.y) * 0.045;

    for (let j = 0; j < count; j++) {
      const { x, z } = positions[j];
      const wave =
        Math.sin(x * 0.42 + t * 0.9) * Math.cos(z * 0.38 - t * 0.55) * 1.15 +
        Math.sin((x + z) * 0.62 + t * 1.4) * 0.35;
      const h = 1.35 + (wave + 1.5) * 0.85;
      dummy.position.set(x, -2.4, z);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(j, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    camera.position.x = mouse.x * 1.4;
    camera.position.y = 7.2 + mouse.y * -0.7 - scrollP * 2.2;
    camera.position.z = 15 - scrollP * 3;
    camera.lookAt(0, 1.2 - scrollP * 1.4, 0);
    mesh.rotation.y = scrollP * 0.4;

    renderer.render(scene, camera);
  });
}

/* ============================================================ SCROLL FX */

function initHeroParallax() {
  if (reducedMotion) return;
  gsap.to('.hero__body', {
    y: 90,
    autoAlpha: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

function initSplitReveals() {
  // the hero title is split here but animated by heroIntro after the loader
  const targets = $$('.hero__title, .sec-head__title, .contact__title');
  targets.forEach((el) => {
    splitWords(el);
  });
  if (reducedMotion) {
    targets.forEach((el) => el.classList.remove('is-splitting'));
    return;
  }
  targets
    .filter((el) => !el.closest('.hero'))
    .forEach((el) => {
      const words = $$('.split-word__i', el);
      gsap.fromTo(
        words,
        { yPercent: 112, y: 112 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.95,
          ease: 'power4.out',
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }
      );
    });
}

function revealUp(selector, vars = {}) {
  if (reducedMotion) return;
  $$(selector).forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: 'power3.out',
        delay: vars.stagger ? (i % vars.stagger) * 0.09 : 0,
        scrollTrigger: { trigger: vars.triggerEl ? vars.triggerEl(el) : el, start: 'top 86%', once: true },
      }
    );
  });
}

function initReveals() {
  revealUp('.sec-head__lede');
  revealUp('.cap__tab', { stagger: 4, triggerEl: () => '.cap__list' });
  revealUp('.cap__panel');
  revealUp('.pgroup', { stagger: 4 });
  revealUp('.step', { stagger: 4 });
  revealUp('.stack__group', { stagger: 3 });
  revealUp('.plan-card', { stagger: 3 });
  revealUp('.priceflow__step', { stagger: 3 });
  revealUp('.faq-item', { stagger: 3 });
  revealUp('.contact__intro > *', { stagger: 5 });
  revealUp('.cform');
  revealUp('.footer__top');
  revealUp('.footer__grid > *', { stagger: 4 });
  revealUp('.marquee-band');
}

/* ============================================================ CONTACT FORM */

function initForm() {
  const form = $('#contact-form');
  if (!form) return;
  const statusEl = $('#cform-status');
  const submitBtn = $('#cform-submit');
  const btnLabel = $('.cform__btn-label', form);

  const setError = (id, msg) => {
    const input = $(`#${id}`);
    if (!input) return;
    const field = input.closest('.field') || input.closest('fieldset');
    const errorEl = $(`[data-error-for="${id}"]`);
    if (field) field.classList.toggle('has-error', Boolean(msg));
    if (errorEl) errorEl.textContent = msg ?? '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  $$('input, textarea, select', form).forEach((input) => {
    input.addEventListener('input', () => setError(input.id || input.name, ''));
    input.addEventListener('change', () => setError(input.id || input.name, ''));
  });

  const chosenServices = () =>
    [...form.querySelectorAll('input[name="services"]:checked')].map((i) => i.value);

  const validate = () => {
    let ok = true;
    const name = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    const brief = $('#f-brief').value.trim();
    const website = $('#f-website').value.trim();

    if (!name) {
      setError('f-name', 'Tell us who to reply to.');
      ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('f-email', 'A valid work email is needed.');
      ok = false;
    }
    if (chosenServices().length === 0) {
      setError('f-services', 'Pick at least one, or choose "Not sure yet".');
      ok = false;
    }
    if (brief.length < 10) {
      setError('f-brief', 'Give us at least a sentence to work with.');
      ok = false;
    }
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
      setError('f-website', 'A full link starting with https://');
      ok = false;
    }
    if (!$('#f-privacy').checked) {
      setError('f-privacy', 'The privacy acknowledgement is required.');
      ok = false;
    }
    return ok;
  };

  const collect = () => ({
    name: $('#f-name').value.trim(),
    email: $('#f-email').value.trim(),
    company: $('#f-company').value.trim(),
    website: $('#f-website').value.trim(),
    phone: $('#f-phone').value.trim(),
    services: chosenServices(),
    brief: $('#f-brief').value.trim(),
    workflow: $('#f-workflow').value.trim(),
    integrations: $('#f-integrations').value.trim(),
    timeline: $('#f-timeline').value,
    budget: $('#f-budget').value.trim(),
    budgetStatus: form.querySelector('input[name="budget-status"]:checked')?.value ?? '',
    privacy: $('#f-privacy').checked,
    websiteHp: $('#f-website-hp').value,
    source: document.referrer || 'direct',
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      statusEl.classList.add('is-visible');
      statusEl.textContent = 'A few fields need attention above.';
      return;
    }

    const payload = collect();
    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Sending…';

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        statusEl.classList.add('is-visible');
        statusEl.textContent =
          data.message ?? 'Inquiry received. The founders review every requirement personally and will reach out to discuss scope and budget.';
      } else if (res.status === 429) {
        statusEl.classList.add('is-visible');
        statusEl.textContent = 'Too many submissions from this connection. Please wait a minute and try again, or email build@softbase.services.';
      } else {
        statusEl.classList.add('is-visible');
        statusEl.textContent =
          data.message ??
          'The submission could not be recorded. Your entries are kept below; try again, or email build@softbase.services directly.';
      }
    } catch {
      statusEl.classList.add('is-visible');
      statusEl.textContent =
        'The network dropped before we could record your inquiry. Nothing was lost: try again, or email build@softbase.services directly.';
    } finally {
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Send the brief';
    }
  });
}

/* ==================================================================== INIT */

function start() {
  initLenis();
  initAnchors();
  initMenu();
  initNavScroll();
  initActiveSection();
  initCursor();
  initMagnetic();
  initMarquee();
  initFooterWordmark();
  initCounters();
  initHeroField();
  initHeroParallax();
  initSplitReveals();
  initReveals();
  initForm();

  initLoader();

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function init() {
  try {
    boot();
    start();
  } catch (err) {
    window.__bootError = err?.stack || String(err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
