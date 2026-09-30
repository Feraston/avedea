import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/redesign");

/** Curated Unsplash photos (license: Unsplash) — spa / skincare / calm interiors */
const IMAGES = [
  {
    name: "hero.jpg",
    url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2400&q=80",
    width: 2400,
    height: 1600,
  },
  {
    name: "about.jpg",
    url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=80",
    width: 1800,
    height: 1350,
  },
  {
    name: "promo-laser.jpg",
    url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
    width: 1600,
    height: 1200,
  },
  {
    name: "offer-1.jpg",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1050,
  },
  {
    name: "offer-2.jpg",
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1050,
  },
  {
    name: "offer-3.jpg",
    url: "https://images.unsplash.com/photo-1552693673-1bf958239e1c?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1050,
  },
  {
    name: "cat-face.jpg",
    url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "cat-body.jpg",
    url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "cat-laser.jpg",
    url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "cat-device.jpg",
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "cat-makeup.jpg",
    url: "https://images.unsplash.com/photo-1522335789203-aabd92fc3503?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "cat-wrap.jpg",
    url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1400&q=80",
    width: 1400,
    height: 1000,
  },
  {
    name: "training.jpg",
    url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80",
    width: 1600,
    height: 1000,
  },
  {
    name: "texture.jpg",
    url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1800&q=80",
    width: 1800,
    height: 1200,
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "avedea-redesign-bot/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

await mkdir(ROOT, { recursive: true });

for (const img of IMAGES) {
  process.stdout.write(`↓ ${img.name} … `);
  const raw = await fetchBuffer(img.url);
  const out = await sharp(raw)
    .rotate()
    .resize(img.width, img.height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(ROOT, img.name), out);
  console.log(`${(out.length / 1024).toFixed(0)} KB`);
}

console.log(`Done → ${ROOT}`);
