import { mkdir, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/redesign");

const JOBS = [
  {
    name: "hero.jpg",
    src: "public/blocks/greeting/file/greeting.jpg",
    width: 2400,
    height: 1500,
    grade: "cool",
  },
  {
    name: "about.jpg",
    src: "public/blocks/description/file/avedea.jpg",
    width: 1600,
    height: 1200,
    grade: "warmsoft",
  },
  {
    name: "promo-laser.jpg",
    src: "public/image/services-two.jpg",
    width: 1600,
    height: 1100,
    grade: "cool",
  },
  {
    name: "offer-1.jpg",
    src: "public/blocks/sale/file/sale1.jpg",
    width: 1200,
    height: 900,
    grade: "warmsoft",
  },
  {
    name: "offer-2.jpg",
    src: "public/blocks/sale/file/sale2.jpg",
    width: 1200,
    height: 900,
    grade: "warmsoft",
  },
  {
    name: "offer-3.jpg",
    src: "public/blocks/sale/file/sale3.jpg",
    width: 1200,
    height: 900,
    grade: "warmsoft",
  },
  {
    name: "cat-face.jpg",
    src: "public/blocks/uslugi/file/usluga11.jpg",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-body.jpg",
    src: "public/blocks/uslugi/file/usluga61.jpg",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-laser.jpg",
    src: "public/blocks/uslugi/file/usluga81.jpg",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-device.jpg",
    src: "public/blocks/greeting/file/apparat.png",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-makeup.jpg",
    src: "public/blocks/uslugi/file/usluga31.jpg",
    width: 1400,
    height: 1000,
    grade: "warmsoft",
  },
  {
    name: "cat-wrap.jpg",
    src: "public/blocks/uslugi/file/usluga71.jpg",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-depilation.jpg",
    src: "public/blocks/uslugi/file/usluga41.jpg",
    width: 1400,
    height: 1000,
    grade: "cool",
  },
  {
    name: "cat-phyts.jpg",
    src: "public/blocks/uslugi/file/usluga51.jpg",
    width: 1400,
    height: 1000,
    grade: "warmsoft",
  },
  {
    name: "cat-bernard.jpg",
    src: "public/blocks/uslugi/file/usluga75.jpg",
    width: 1400,
    height: 1000,
    grade: "warmsoft",
  },
  {
    name: "training.jpg",
    src: "public/blocks/training/file/basic_big.png",
    width: 1600,
    height: 1000,
    grade: "cool",
  },
  {
    name: "texture.jpg",
    src: "public/image/services-one.jpg",
    width: 1800,
    height: 1200,
    grade: "mist",
  },
  {
    name: "services-banner.jpg",
    src: "public/image/services-one.jpg",
    width: 2000,
    height: 900,
    grade: "cool",
  },
];

function gradePipeline(img, grade) {
  if (grade === "cool") {
    return img
      .modulate({ brightness: 1.02, saturation: 0.92 })
      .tint({ r: 220, g: 235, b: 230 });
  }
  if (grade === "warmsoft") {
    return img
      .modulate({ brightness: 1.04, saturation: 0.95 })
      .tint({ r: 240, g: 235, b: 228 });
  }
  if (grade === "mist") {
    return img
      .modulate({ brightness: 1.08, saturation: 0.75 })
      .tint({ r: 210, g: 220, b: 215 });
  }
  return img;
}

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  const src = path.resolve(job.src);
  try {
    await access(src);
  } catch {
    console.warn(`skip missing ${job.src}`);
    continue;
  }
  let pipeline = sharp(src).rotate().resize(job.width, job.height, {
    fit: "cover",
    position: "attention",
  });
  pipeline = gradePipeline(pipeline, job.grade);
  const buf = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, job.name), buf);
  console.log(`✓ ${job.name} ${(buf.length / 1024).toFixed(0)} KB`);
}

console.log("Redesign images ready");
