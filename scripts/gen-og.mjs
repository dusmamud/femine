import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const tpl = readFileSync('/home/hatch/workspace/femine/screenshots/og-template.html', 'utf8');
const chrome = '/home/hatch/workspace/shot-tmp/chrome-headless-shell/linux-156.0.8078.80/chrome-headless-shell-linux64/chrome-headless-shell';

const pages = [
  { slug: 'services', eyebrow: 'Femine · Services', title: 'Services', tag: 'Five programmes for confidence, relationships and career growth.', photo: 'service-relationships.jpg' },
  { slug: 'pricing', eyebrow: 'Femine · Pricing', title: 'Pricing', tag: 'Simple, honest pricing — your first 30-minute call is always free.', photo: 'hero.jpg' },
  { slug: 'about', eyebrow: 'Femine · About', title: 'About Us', tag: 'Meet your coach — practical coaching, not theory.', photo: 'about-coach.jpg' },
  { slug: 'book', eyebrow: 'Femine · Book', title: 'Book a Session', tag: 'Your first 30-minute call is free — no pressure, just a conversation.', photo: 'contact.jpg' },
  { slug: 'results', eyebrow: 'Femine · Results', title: 'Results', tag: 'Change you can measure — real clients, real outcomes.', photo: 'expertise.jpg' },
  { slug: 'blog', eyebrow: 'Femine · Blog', title: 'Blog', tag: 'Practical notes on confidence, relationships and career growth.', photo: 'service-passion.jpg' },
];

for (const p of pages) {
  copyFileSync(`/home/hatch/workspace/femine/src/assets/${p.photo}`, `/home/hatch/workspace/femine/screenshots/og-photo-${p.slug}.jpg`);
  const h1size = p.title.length <= 8 ? 96 : p.title.length <= 12 ? 76 : 64;
  const html = tpl
    .replace('Personality Coaching', p.eyebrow)
    .replace('<h1>Femine<em>.</em></h1>', `<h1 style="font-size:${h1size}px">${p.title}</h1>`)
    .replace('Your Personality is What Makes You Character', p.tag)
    .replace('og-wide.jpg', `og-photo-${p.slug}.jpg`);
  const tmp = `/home/hatch/workspace/femine/screenshots/og-gen-${p.slug}.html`;
  const out = `/home/hatch/workspace/femine/public/og-${p.slug}.png`;
  writeFileSync(tmp, html);
  execSync(`${chrome} --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1200,630 --screenshot=${out} file://${tmp}`, { stdio: 'pipe' });
  const meta = await sharp(out).metadata();
  console.log(`og-${p.slug}.png`, meta.width + 'x' + meta.height, Math.round(meta.size / 1024) + 'KB');
}
