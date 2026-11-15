import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// Arch mark paths from public/logo-mark.svg (viewBox 0 0 120 120)
const mark = `<path d="M20 108V62C20 34 38 16 60 16s40 18 40 46v46H20Z" fill="#fbe9e4"/><path d="M60 28l5.4 18.6L84 52l-18.6 5.4L60 76l-5.4-18.6L36 52l18.6-5.4Z" fill="#e78f8f"/><path d="M86 74l2.6 9.4L98 86l-9.4 2.6L86 98l-2.6-9.4L74 86l9.4-2.6Z" fill="#ffffff"/>`;

// Compose: wine background + arch mark scaled to `frac` of the canvas, centred.
const compose = (size, frac) => {
  const s = (size * frac) / 120;
  const t = (size - 120 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#6e2434"/><g transform="translate(${t} ${t}) scale(${s})">${mark}</g></svg>`;
};

mkdirSync('/home/hatch/workspace/femine/public/icons', { recursive: true });
const jobs = [
  ['/home/hatch/workspace/femine/public/icons/icon-192.png', compose(192, 0.86)],
  ['/home/hatch/workspace/femine/public/icons/icon-512.png', compose(512, 0.86)],
  ['/home/hatch/workspace/femine/public/icons/icon-maskable-512.png', compose(512, 0.78)],
  ['/home/hatch/workspace/femine/public/apple-touch-icon.png', compose(180, 0.88)],
];
for (const [path, svg] of jobs) {
  await sharp(Buffer.from(svg)).png().toFile(path);
  const meta = await sharp(path).metadata();
  console.log(path.split('/').pop(), meta.width + 'x' + meta.height, meta.format);
}
// Favicon PNGs from favicon.svg (cream rounded square + sparkles)
const fav = readFileSync('/home/hatch/workspace/femine/public/favicon.svg', 'utf8');
for (const size of [32, 16]) {
  const out = `/home/hatch/workspace/femine/public/favicon-${size}.png`;
  await sharp(Buffer.from(fav)).resize(size, size).png().toFile(out);
  console.log(`favicon-${size}.png`, size + 'x' + size);
}
