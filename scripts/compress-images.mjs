/**
 * Compress large raster images in public/ (lossy JPEG / optimized PNG).
 * Keeps originals only if compression fails.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const MIN_BYTES = 180 * 1024; // only touch files bigger than ~180KB

async function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = await walk(PUBLIC);
let saved = 0;
let touched = 0;

for (const file of files) {
  const before = fs.statSync(file).size;
  if (before < MIN_BYTES) continue;

  const ext = path.extname(file).toLowerCase();
  const tmp = file + ".tmp";
  try {
    if (ext === ".png") {
      await sharp(file).png({ compressionLevel: 9, palette: true }).toFile(tmp);
    } else {
      await sharp(file)
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(tmp);
    }
    const after = fs.statSync(tmp).size;
    if (after < before * 0.95) {
      fs.renameSync(tmp, file);
      saved += before - after;
      touched += 1;
      console.log(
        `✓ ${path.relative(PUBLIC, file)} ${(before / 1024).toFixed(0)}→${(after / 1024).toFixed(0)} KB`
      );
    } else {
      fs.unlinkSync(tmp);
    }
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.warn(`skip ${file}:`, err.message);
  }
}

console.log(
  `Compressed ${touched} files, saved ${(saved / 1024 / 1024).toFixed(2)} MB`
);
