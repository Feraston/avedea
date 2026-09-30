/**
 * Remap soft white vignettes (#fff fades) to page surface color #f5f8f6.
 * Run: node scripts/remap-vignette.mjs
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PAGE = { r: 243, g: 250, b: 244 }; // #f3faf4 summer page
const OUT_DIR = path.resolve("public/redesign/soft");

const JOBS = [
  {
    src: "public/blocks/abonement/file/sale1.jpg",
    out: "abon-1.jpg",
    width: 1400,
    height: 1050,
    position: "centre",
  },
  {
    src: "public/blocks/abonement/file/sale2.jpg",
    out: "abon-2.jpg",
    width: 1400,
    height: 1050,
    position: "centre",
  },
  {
    src: "public/blocks/abonement/file/sale3.jpg",
    out: "abon-3.jpg",
    width: 1400,
    height: 1050,
    position: "centre",
  },
  {
    src: "public/blocks/description/file/avedea.jpg",
    out: "about-soft.jpg",
    width: 1600,
    height: 1200,
    position: "attention",
  },
  {
    src: "public/blocks/master/file/spec_es.jpg",
    out: "spec-es.jpg",
    width: 900,
    height: 1100,
    position: "top",
  },
  {
    src: "public/blocks/master/file/spec_vp.png",
    out: "spec-vp.jpg",
    width: 900,
    height: 1100,
    position: "top",
  },
  {
    src: "public/blocks/specialist/file/spec_es.jpg",
    out: "spec-es-detail.jpg",
    width: 1000,
    height: 1300,
    position: "top",
  },
  {
    src: "public/blocks/specialist/file/spec_vp.jpg",
    out: "spec-vp-detail.jpg",
    width: 1000,
    height: 1300,
    position: "top",
  },
  {
    src: "public/image/services-two.jpg",
    out: "promo-laser.jpg",
    width: 1600,
    height: 1100,
    position: "north",
    // dark section: fade toward summer grass deep
    page: { r: 47, g: 122, b: 66 },
  },
];

async function remap(buf, page) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minc = Math.min(r, g, b);
    const maxc = Math.max(r, g, b);
    // near-white / soft vignette (low saturation + bright)
    if (minc >= 210 && maxc - minc < 28) {
      const t = Math.min(1, (minc - 210) / 45);
      data[i] = Math.round(r * (1 - t) + page.r * t);
      data[i + 1] = Math.round(g * (1 - t) + page.g * t);
      data[i + 2] = Math.round(b * (1 - t) + page.b * t);
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

await mkdir(OUT_DIR, { recursive: true });

for (const job of JOBS) {
  try {
    await access(path.resolve(job.src));
  } catch {
    console.warn("skip", job.src);
    continue;
  }
  const resized = await sharp(path.resolve(job.src))
    .rotate()
    .resize(job.width, job.height, {
      fit: "cover",
      position: job.position || "centre",
    })
    .toBuffer();
  const out = await remap(resized, job.page || PAGE);
  await writeFile(path.join(OUT_DIR, job.out), out);
  console.log("✓", job.out, `${(out.length / 1024).toFixed(0)} KB`);
}

console.log("Target page color: #f3faf4");
