/**
 * Build a simple OG PNG from the logo for messengers/crawlers.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const logo = path.join(PUBLIC, "blocks", "header", "file", "logo.svg");
const out = path.join(PUBLIC, "og.png");

const width = 1200;
const height = 630;

const logoBuf = await sharp(logo)
  .resize({ width: 420, height: 220, fit: "inside" })
  .png()
  .toBuffer();

const logoMeta = await sharp(logoBuf).metadata();
const left = Math.round((width - (logoMeta.width || 420)) / 2);
const top = Math.round((height - (logoMeta.height || 220)) / 2);

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([{ input: logoBuf, left, top }])
  .png()
  .toFile(out);

console.log(`Wrote ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
