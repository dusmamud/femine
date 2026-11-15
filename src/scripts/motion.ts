// Femine motion — balanced level (afd-motion).
// CSS first, GSAP + Lenis only for what CSS cannot do: staggered scroll
// reveals, count-ups, progress bars, hero parallax, smooth scrolling.
// Rules honoured: no-JS state is the readable state (GSAP sets initial
// states from JS only, never CSS); transform/opacity only; no scroll
// listeners for effects (ScrollTrigger / Lenis events); everything is
// skipped when prefers-reduced-motion is set.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

const header = document.querySelector<HTMLElement>('.site-header');
const toTop = document.getElementById('to-top') as HTMLButtonElement | null;
let lenis: Lenis | null = null;

function setScrolled(y: number) {
  header?.classList.toggle('is-scrolled', y > 24);
  if (toTop) {
    toTop.dataset.show = String(y > 700);
    // Lift the button when the page bottom is reached so it never covers
    // the footer's legal links (mobile + desktop).
    const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 8;
    toTop.classList.toggle('is-near-bottom', nearBottom && y > 700);
  }
}

// Back-to-top works in both modes (bug fix: it previously had no click
// handler at all under prefers-reduced-motion).
toTop?.addEventListener('click', () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'auto' });
});

if (reduced) {
  // Final states are already in the HTML (counts, bar widths, visible
  // content) — nothing to animate, nothing hidden.
  window.addEventListener('scroll', () => setScrolled(window.scrollY), { passive: true });
  setScrolled(window.scrollY);
} else {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on('scroll', ({ scroll }: { scroll: number }) => setScrolled(scroll));
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links go through Lenis so the smooth scroll lands correctly.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.1 });
      history.replaceState(null, '', id);
    });
  });

  // Hero entrance — once, on load. Guarded: inner pages have no hero
  // elements, and unguarded gsap.from() logged "target not found" warnings.
  const heroEls = document.querySelectorAll('[data-hero]');
  if (heroEls.length) {
    gsap.from(heroEls, {
      y: 26, opacity: 0, duration: 0.7, ease: 'power3.out',
      stagger: 0.09, delay: 0.1, clearProps: 'transform,opacity',
    });
  }
  const heroImg = document.querySelector('[data-hero-img]');
  if (heroImg) {
    gsap.from(heroImg, {
      y: 32, opacity: 0, scale: 0.97, duration: 0.9, ease: 'power3.out', delay: 0.25,
      clearProps: 'transform,opacity',
    });
  }

  // Scroll reveals — staggered, back.out(1.4) per the design system.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 28, opacity: 0, duration: 0.45, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      clearProps: 'transform,opacity',
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, {
      y: 24, opacity: 0, scale: 0.96, duration: 0.4, ease: 'back.out(1.4)',
      stagger: 0.07,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      clearProps: 'transform,opacity',
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

  // Gentle hero-image parallax, desktop + fine pointer only.
  if (finePointer && window.matchMedia('(min-width: 1024px)').matches) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.to(el, {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });
  }

}

// Newsletter — no mailing backend yet, so subscribing opens the visitor's
// own email app with a prefilled subscribe request (nothing is faked).
// When Dus connects a real email/list, this becomes a direct submit.
const form = document.getElementById('newsletter-form') as HTMLFormElement | null;
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector<HTMLInputElement>('input[type="email"]');
  const msg = document.getElementById('newsletter-msg');
  if (!input || !msg) return;
  if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.className = 'mt-3 text-sm text-rose-deep';
    input.focus();
    return;
  }
  const subject = encodeURIComponent('Subscribe me to Femine weekly tips');
  const body = encodeURIComponent(`Hi Femine,\n\nPlease add ${input.value} to the weekly tips list.\n\nThank you!`);
  window.location.href = `mailto:hello@femine.pages.dev?subject=${subject}&body=${body}`;
  msg.textContent = 'Opening your email app to confirm — just press send.';
  msg.className = 'mt-3 text-sm text-white/90';
  form.reset();
});
