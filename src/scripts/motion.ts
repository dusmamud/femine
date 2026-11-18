// Femine motion — GSAP + Lenis, view-transition aware (afd-motion).
// All per-page setup runs inside initPage(), fired on astro:page-load
// (initial load AND every view-transition navigation), with cleanup before
// each re-init. Content is always visible by default: GSAP sets initial
// states from JS only (gsap.from), never CSS. Everything is skipped when
// prefers-reduced-motion is set — but menu, lightbox, slider and forms
// still work, because those are behaviour, not animation.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
let lenisRaf: ((time: number) => void) | null = null;
let sliderTimer: number | null = null;
let scrollHandler: (() => void) | null = null;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function cleanup() {
  if (lenis) { lenis.destroy(); lenis = null; }
  if (lenisRaf) { gsap.ticker.remove(lenisRaf); lenisRaf = null; }
  gsap.globalTimeline.clear();
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (sliderTimer !== null) { window.clearInterval(sliderTimer); sliderTimer = null; }
  if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
  document.getElementById('scroll-progress')?.style.setProperty('transform', 'scaleX(0)');
}

function initPage() {
  cleanup();

  const header = document.querySelector<HTMLElement>('.site-header');
  const toTop = document.getElementById('to-top') as HTMLButtonElement | null;
  const progress = document.getElementById('scroll-progress') as HTMLElement | null;

  function setScrolled(y: number) {
    header?.classList.toggle('is-scrolled', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (toTop) {
      toTop.dataset.show = String(y > 700);
      // Lift the button when the page bottom is reached so it never covers
      // the footer's legal links (mobile + desktop).
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 8;
      toTop.classList.toggle('is-near-bottom', nearBottom && y > 700);
    }
  }

  // Back-to-top — bound fresh each page (the button is re-created per navigation).
  toTop?.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'auto' });
  });

  // ---- Mobile menu (was Header.astro's inline script; moved here so it
  // keeps working after view-transition navigation) ----
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  let lastFocus: HTMLElement | null = null;
  function setMenuOpen(open: boolean) {
    if (!menu || !menuBtn) return;
    menu.dataset.open = String(open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    iconOpen?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocus = document.activeElement as HTMLElement;
      menu.querySelector<HTMLElement>('a')?.focus();
    } else {
      lastFocus?.focus();
    }
  }
  menuBtn?.addEventListener('click', () => setMenuOpen(menu?.dataset.open !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target === menu) setMenuOpen(false); });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenuOpen(false)));
  // "Pages" is a dropdown label, not a page — the button toggles the panel
  // (touch devices have no hover). Closes on Escape, on outside click, and
  // when a link inside it is chosen.
  const pagesToggle = document.querySelector<HTMLElement>('[data-pages-toggle]');
  const pagesGroup = pagesToggle?.closest<HTMLElement>('[data-pages-group]');
  function setPagesOpen(open: boolean) {
    if (!pagesGroup || !pagesToggle) return;
    pagesGroup.dataset.pagesOpen = String(open);
    pagesToggle.setAttribute('aria-expanded', String(open));
  }
  pagesToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    setPagesOpen(pagesGroup?.dataset.pagesOpen !== 'true');
  });
  pagesGroup?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setPagesOpen(false)));
  document.addEventListener('click', (e) => {
    if (pagesGroup && !pagesGroup.contains(e.target as Node)) setPagesOpen(false);
  });

  // ---- Video lightbox (hero play button) ----
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('video-modal-el') as HTMLVideoElement | null;
  function setVideoOpen(open: boolean) {
    if (!modal) return;
    modal.classList.toggle('hidden', !open);
    modal.classList.toggle('flex', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      modalVideo?.play().catch(() => {});
      modal.querySelector<HTMLElement>('[data-video-close]')?.focus();
    } else {
      modalVideo?.pause();
    }
  }
  document.querySelectorAll('[data-video-open]').forEach((b) =>
    b.addEventListener('click', () => setVideoOpen(true)),
  );
  modal?.querySelector('[data-video-close]')?.addEventListener('click', () => setVideoOpen(false));
  modal?.addEventListener('click', (e) => { if (e.target === modal) setVideoOpen(false); });

  keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setVideoOpen(false);
      setMenuOpen(false);
      setPagesOpen(false);
    }
  };
  document.addEventListener('keydown', keyHandler);

  // ---- Testimonial slider (home): auto-rotate 6s, dots + arrows,
  // pause on hover/focus, swipe on mobile ----
  const slider = document.querySelector<HTMLElement>('[data-testimonial-slider]');
  if (slider) {
    const track = slider.querySelector<HTMLElement>('.t-track');
    const slides = track ? Array.from(track.children) : [];
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('[data-t-dot]'));
    const prevBtn = slider.querySelector<HTMLButtonElement>('[data-t-prev]');
    const nextBtn = slider.querySelector<HTMLButtonElement>('[data-t-next]');
    const total = slides.length;
    let idx = 0;
    function go(i: number) {
      if (!total) return;
      idx = (i + total) % total;
      if (track) track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => {
        d.classList.toggle('w-7', j === idx);
        d.classList.toggle('bg-rose', j === idx);
        d.classList.toggle('w-2.5', j !== idx);
        d.classList.toggle('bg-rose/30', j !== idx);
        d.setAttribute('aria-selected', String(j === idx));
      });
    }
    function restart() {
      if (sliderTimer !== null) window.clearInterval(sliderTimer);
      sliderTimer = window.setInterval(() => go(idx + 1), 6000);
    }
    function pause() {
      if (sliderTimer !== null) { window.clearInterval(sliderTimer); sliderTimer = null; }
    }
    prevBtn?.addEventListener('click', () => { go(idx - 1); restart(); });
    nextBtn?.addEventListener('click', () => { go(idx + 1); restart(); });
    dots.forEach((d, j) => d.addEventListener('click', () => { go(j); restart(); }));
    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', restart);
    let startX: number | null = null;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    }, { passive: true });
    restart();
  }

  // ---- Newsletter — no mailing backend yet, so subscribing opens the
  // visitor's own email app with a prefilled subscribe request (nothing
  // is faked). When Dus connects a real email/list, this becomes a direct
  // submit. ----
  const form = document.getElementById('newsletter-form') as HTMLFormElement | null;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const msg = document.getElementById('newsletter-msg');
    if (!input || !msg) return;
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'mt-3 text-sm font-medium text-white';
      input.focus();
      return;
    }
    const subject = encodeURIComponent('Subscribe me to Femine weekly tips');
    const body = encodeURIComponent(`Hi Femine,\n\nPlease add ${input.value} to the weekly tips list.\n\nThank you!`);
    window.location.href = `mailto:hello@femine.in?subject=${subject}&body=${body}`;
    msg.textContent = 'Opening your email app to confirm — just press send.';
    msg.className = 'mt-3 text-sm text-white/90';
    form.reset();
  });

  if (reduced) {
    // Final states are already in the HTML (counts, bar widths, visible
    // content) — nothing to animate, nothing hidden.
    scrollHandler = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    setScrolled(window.scrollY);
    return;
  }

  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on('scroll', ({ scroll }: { scroll: number }) => setScrolled(scroll));
  lenis.on('scroll', ScrollTrigger.update);
  lenisRaf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  setScrolled(window.scrollY);

  // Anchor links go through Lenis so the smooth scroll lands correctly.
  // Offset 0: sections carry scroll-mt-24, and Lenis respects that margin —
  // passing -72 as well double-counted it and stopped ~96px short.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: 0, duration: 1.1 });
      history.replaceState(null, '', id);
    });
  });

  // Hero entrance — fast (readable ≤ ~1.8s): masked headline lines slide up
  // out of their masks, other hero elements fade + rise, the arch photo
  // clip-reveals. Guarded: inner pages have no hero elements.
  const heroLines = document.querySelectorAll('[data-hero-lines] .mask-line > span');
  if (heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.09, delay: 0.05,
      clearProps: 'transform',
    });
  }
  const heroEls = document.querySelectorAll('[data-hero]');
  if (heroEls.length) {
    gsap.from(heroEls, {
      y: 20, opacity: 0, duration: 0.55, ease: 'power3.out',
      stagger: 0.07, delay: 0.05, clearProps: 'transform,opacity',
    });
  }
  const heroImg = document.querySelector('[data-hero-img]');
  if (heroImg) {
    gsap.from(heroImg, {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut', delay: 0.15,
      clearProps: 'clipPath',
    });
  }

  // Scroll reveals — varied by element, not one-note:
  // text blocks fade + rise; groups scale in slightly; photos clip-reveal
  // with a scale + blur-to-sharp.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.55, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      clearProps: 'transform,opacity',
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, {
      y: 20, opacity: 0, scale: 0.97, duration: 0.45, ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      clearProps: 'transform,opacity',
    });
  });
  gsap.utils.toArray<HTMLElement>('.clip-reveal-img').forEach((img) => {
    gsap.from(img, {
      clipPath: 'inset(100% 0% 0% 0%)', scale: 1.25, filter: 'blur(8px)',
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: img, start: 'top 85%', once: true },
      clearProps: 'clipPath,scale,filter',
    });
  });

  // Count-up stats + skill percentages.
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count || '0');
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
    });
  });

  // Progress bars grow from 0 to their final width on enter.
  document.querySelectorAll<HTMLElement>('[data-bar]').forEach((el) => {
    const w = el.dataset.bar || '0%';
    gsap.from(el, {
      width: '0%', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onComplete: () => { el.style.width = w; },
    });
  });

  // Gentle hero/expertise image parallax, desktop + fine pointer only.
  // (The hero image itself uses the CSS ken-burns instead — a CSS transform
  // animation would override GSAP's inline transform on the same element.)
  if (finePointer && window.matchMedia('(min-width: 1024px)').matches) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      if (el.classList.contains('kenburns')) return;
      gsap.to(el, {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });
  }

  // Magnetic primary CTAs — a gentle pull toward the cursor, spring back.
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }
}

document.addEventListener('astro:page-load', initPage);
document.addEventListener('astro:before-swap', cleanup);
