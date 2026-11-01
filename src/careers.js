/* ============================================================================
   SoftBase Services — careers page engine
   Loader, cursor, nav, reveals, internship content, application form.
   ========================================================================== */

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/careers.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import {
  role,
  responsibilities,
  mentorship,
  benefits,
  lookingFor,
  disclosure,
  acknowledgement,
  durationOptions,
  joiningOptions,
  weeklyOptions,
  academicYearOptions,
  platformOptions,
  faqs,
} from './data/careers-data.js';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------- utilities */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const checkSVG =
  '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" /></svg>';

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

/* =================================================================== BOOT */

const state = { lenis: null };

document.documentElement.classList.add('is-locked');
document.body.classList.add('is-locked');

function boot() {
  buildRole();
  buildDuties();
  buildMentorship();
  buildFit();
  buildBenefits();
  buildFaq();
  buildFormOptions();
  $('#year').textContent = String(new Date().getFullYear());
  startClock();
}

/* ---------------------------------------------------------------- content */

function buildRole() {
  $('#role-summary').textContent = role.summary;
  $('#role-rows').innerHTML = role.terms
    .map(([k, v]) => `<div class="role__row"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');
  $('#disclosure-overview-text').textContent = disclosure;
  $('#disclosure-form-text').textContent = disclosure;
  $('#a-ack-text').textContent = acknowledgement;
}

function buildDuties() {
  const ol = $('#duty-list');
  if (!ol) return;
  ol.innerHTML = responsibilities
    .map(
      (d) => `
      <li class="step">
        <div class="step__top">
          <span class="step__index">${d.index}</span>
          <span class="step__duration">${d.duration}</span>
        </div>
        <h3 class="step__title">${d.title}</h3>
        <p class="step__body">${d.body}</p>
        <ul class="step__outputs">${d.outputs.map((o) => `<li>${o}</li>`).join('')}</ul>
      </li>`
    )
    .join('');
}

function buildMentorship() {
  const wrap = $('#mentorship-list');
  if (!wrap) return;
  wrap.innerHTML = mentorship
    .map(
      (m, i) => `
      <div class="step">
        <div class="step__top">
          <span class="step__index">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <h3 class="step__title">${m.title}</h3>
        <p class="step__body">${m.body}</p>
      </div>`
    )
    .join('');
}

function buildFit() {
  const mark = (li) => `<li>${checkSVG}<span>${li}</span></li>`;
  $('#fit-list').innerHTML = lookingFor.map(mark).join('');
  $('#gain-list').innerHTML = [
    'A Certificate of Completion',
    'A Letter of Recommendation',
    'Real research, outreach and pipeline work on your record',
  ]
    .map(mark)
    .join('');
}

function buildBenefits() {
  const wrap = $('#benefit-list');
  if (!wrap) return;
  wrap.innerHTML = benefits
    .map(
      (b) => `
      <article class="plan-card">
        <div class="plan-card__icon">${checkSVG.replace('width="12" height="12"', 'width="20" height="20"')}</div>
        <h3 class="plan-card__name">${b.title}</h3>
        <p class="plan-card__body">${b.body}</p>
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
        <button class="faq-item__q" type="button" aria-expanded="false" aria-controls="cfaq-a-${i}" id="cfaq-q-${i}">
          <span>${f.q}</span>
          <span class="faq-item__icon"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.5" /></svg></span>
        </button>
        <div class="faq-item__a" id="cfaq-a-${i}" role="region" aria-labelledby="cfaq-q-${i}">
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

function buildFormOptions() {
  const fill = (id, options, placeholder) => {
    const el = $(id);
    if (!el) return;
    el.innerHTML =
      `<option value="">${placeholder}</option>` +
      options.map((o) => `<option value="${o}">${o}</option>`).join('');
  };
  fill('#a-year', academicYearOptions, 'Select your year');
  fill('#a-duration', durationOptions, 'Select a duration');
  fill('#a-joining', joiningOptions, 'Select availability');
  fill('#a-weekly', weeklyOptions, 'Select weekly availability');

  const platforms = $('#a-platforms');
  if (platforms) {
    platforms.innerHTML = platformOptions
      .map(
        (p) => `
        <label class="pchip">
          <input class="sr-only" type="checkbox" name="platforms" value="${p}" />
          <span class="pchip__body">${p}</span>
        </label>`
      )
      .join('');
  }
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

/* ================================================================ LOADER */

const loaderStatuses = [
  [0, 'reading your application'],
  [30, 'warming up the studio'],
  [60, 'polishing the role spec'],
  [85, 'opening the doors'],
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
    finish();
    return;
  }

  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.7,
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
  const title = $('.chero__title');
  if (reducedMotion || !title) return;
  const words = $$('.split-word__i', title);
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .fromTo(
      words,
      { yPercent: 112, y: 112 },
      { yPercent: 0, y: 0, duration: 1.05, stagger: 0.055 },
      0.05
    )
    .fromTo('.chero__lede', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.45)
    .fromTo('.hero__actions > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.58)
    .fromTo('.chero__facts', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 0.75)
    .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.95);
}

/* ============================================================ SCROLL & NAV */

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
    state.lenis.scrollTo(target, { offset: -76 + 1, duration: 1.4 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - 76 + 1;
    window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    if (!$(hash)) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(hash);
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
    isMenuOpen() ? closeMenu() : openMenu();
  });
  $('#nav-close').addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function initNavScroll() {
  const navEl = $('#nav');
  let lastY = 0;
  const onScroll = (y) => {
    navEl.classList.toggle('is-scrolled', y > 24);
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
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }
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

/* ============================================================ SCROLL FX */

function initSplitReveals() {
  const targets = $$('.chero__title, .sec-head__title, .contact__title');
  targets.forEach((el) => splitWords(el));
  if (reducedMotion) {
    targets.forEach((el) => el.classList.remove('is-splitting'));
    return;
  }
  targets
    .filter((el) => !el.closest('.chero'))
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
  revealUp('.role__summary');
  revealUp('.role__row', { stagger: 6 });
  revealUp('.disclosure');
  revealUp('.step', { stagger: 5 });
  revealUp('.fit__col', { stagger: 2 });
  revealUp('.plan-card', { stagger: 3 });
  revealUp('.faq-item', { stagger: 5 });
  revealUp('.contact__intro > *', { stagger: 5 });
  revealUp('.cform');
  revealUp('.footer__top');
  revealUp('.footer__grid > *', { stagger: 4 });
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

/* ============================================================ APPLY FORM */

function initApplyForm() {
  const form = $('#apply-form');
  if (!form) return;
  const statusEl = $('#apply-status');
  const submitBtn = $('#apply-submit');
  const btnLabel = $('.cform__btn-label', form);

  const setError = (id, msg) => {
    const input = $(`#${id}`);
    if (!input) return;
    const field = input.closest('.field') || input.closest('fieldset') || input.closest('label');
    const errorEl = $(`[data-error-for="${id}"]`);
    if (field) field.classList.toggle('has-error', Boolean(msg));
    if (errorEl) errorEl.textContent = msg ?? '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  $$('input, textarea, select', form).forEach((input) => {
    input.addEventListener('input', () => setError(input.id, ''));
    input.addEventListener('change', () => setError(input.id, ''));
  });

  const val = (id) => $(`#${id}`)?.value.trim() ?? '';
  const normaliseLink = (v) => (v && !/^https?:\/\//.test(v) ? `https://${v}` : v);

  const validate = () => {
    let ok = true;
    if (!val('a-name')) {
      setError('a-name', 'Tell us who is applying.');
      ok = false;
    }
    if (!val('a-email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('a-email'))) {
      setError('a-email', 'A valid email is needed.');
      ok = false;
    }
    if (!val('a-college')) {
      setError('a-college', 'Where do you study?');
      ok = false;
    }
    if (!val('a-course')) {
      setError('a-course', 'What do you study?');
      ok = false;
    }
    if (!$('#a-year').value) {
      setError('a-year', 'Select your year.');
      ok = false;
    }
    if (!$('#a-duration').value) {
      setError('a-duration', 'Choose 1, 2 or 3 months.');
      ok = false;
    }
    if (!$('#a-joining').value) {
      setError('a-joining', 'When can you start?');
      ok = false;
    }
    if (!$('#a-weekly').value) {
      setError('a-weekly', 'How many hours a week can you give?');
      ok = false;
    }
    if (val('a-why').length < 20) {
      setError('a-why', 'Give us at least a couple of honest sentences.');
      ok = false;
    }
    if (!$('#a-ack').checked) {
      setError('a-ack', 'The internship terms acknowledgement is required.');
      ok = false;
    }
    if (!$('#a-privacy').checked) {
      setError('a-privacy', 'The privacy acknowledgement is required.');
      ok = false;
    }
    return ok;
  };

  const collect = () => ({
    name: val('a-name'),
    email: val('a-email'),
    phone: val('a-phone'),
    city: val('a-city'),
    college: val('a-college'),
    course: val('a-course'),
    year: $('#a-year').value,
    duration: $('#a-duration').value,
    joining: $('#a-joining').value,
    weekly: $('#a-weekly').value,
    linkedin: normaliseLink(val('a-linkedin')),
    resume: normaliseLink(val('a-resume')),
    experience: val('a-experience'),
    platforms: [...form.querySelectorAll('input[name="platforms"]:checked')].map((i) => i.value),
    why: val('a-why'),
    acknowledgement: $('#a-ack').checked,
    privacy: $('#a-privacy').checked,
    websiteHp: val('a-website-hp'),
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
      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        statusEl.classList.add('is-visible');
        statusEl.textContent =
          data.message ??
          'Application received. We read every one and reply to each applicant; shortlisted candidates hear from us for a further conversation.';
      } else if (res.status === 409) {
        statusEl.classList.add('is-visible');
        statusEl.textContent =
          data.message ?? 'We already have an application with this email address.';
      } else if (res.status === 429) {
        statusEl.classList.add('is-visible');
        statusEl.textContent = 'Too many submissions from this connection. Please wait a minute and try again, or email careers@softbase.services.';
      } else {
        statusEl.classList.add('is-visible');
        statusEl.textContent =
          data.message ??
          'The application could not be recorded. Your entries are kept below; try again, or email careers@softbase.services directly.';
      }
    } catch {
      statusEl.classList.add('is-visible');
      statusEl.textContent =
        'The network dropped before we could record your application. Nothing was lost: try again, or email careers@softbase.services directly.';
    } finally {
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Send the application';
    }
  });
}

/* ==================================================================== INIT */

function start() {
  initLenis();
  initAnchors();
  initMenu();
  initNavScroll();
  initCursor();
  initMagnetic();
  initSplitReveals();
  initReveals();
  initFooterWordmark();
  initApplyForm();

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
