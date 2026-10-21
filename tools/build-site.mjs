// Writes every page into dist/: node tools/build-site.mjs
// Website pages share the header, footer and icons in tools/site/shared.mjs;
// workspace pages share the app shell in tools/site/app.mjs.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { home } from './site/home.mjs';
import { features, pricing, about, contact, institutions } from './site/pages.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const pages = {
  'index.html': home,
  'features.html': features,
  'pricing.html': pricing,
  'about.html': about,
  'contact.html': contact,
  'for-institutions.html': institutions,
};

const appModule = join(dirname(fileURLToPath(import.meta.url)), 'site', 'app.mjs');
if (existsSync(appModule)) {
  const { appPages } = await import('./site/app.mjs');
  for (const [name, html] of Object.entries(appPages)) pages[`app/${name}`] = html;
}

for (const [name, html] of Object.entries(pages)) {
  const file = join(dist, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`${name.padEnd(24)} ${(html.length / 1024).toFixed(1)} KB`);
}
