import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const ASSETS = "C:/Users/admin/.cursor/projects/d-webproject-avedea/assets";
const OUT_SVC = path.resolve("public/redesign/svc");
const OUT_DEP = path.resolve("public/redesign/dep");
const OUT_CAT = path.resolve("public/redesign");

await mkdir(OUT_SVC, { recursive: true });
await mkdir(OUT_DEP, { recursive: true });

async function optimize(srcName, destAbs, { width = 1200, height = 900 } = {}) {
  const src = path.join(ASSETS, srcName);
  await sharp(src)
    .rotate()
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(destAbs);
  console.log("ok", path.relative(process.cwd(), destAbs));
}

const jobs = [
  ["hydra-1-peel.jpg", path.join(OUT_SVC, "hydra-1-peel.jpg")],
  ["hydra-2-micro.jpg", path.join(OUT_SVC, "hydra-2-micro.jpg")],
  ["hydra-3-rf.jpg", path.join(OUT_SVC, "hydra-3-rf.jpg")],
  ["hydra-4-complex.jpg", path.join(OUT_SVC, "hydra-4-complex.jpg")],
  ["hydra-5-ultra.jpg", path.join(OUT_SVC, "hydra-5-ultra.jpg")],
  ["hydra-6-full.jpg", path.join(OUT_SVC, "hydra-6-full.jpg")],
  ["hydra-7-mask.jpg", path.join(OUT_SVC, "hydra-7-mask.jpg")],
  ["cat-hydrafacial.jpg", path.join(OUT_CAT, "cat-hydrafacial.jpg")],
  ["simone-1-youth.jpg", path.join(OUT_SVC, "simone-1-youth.jpg")],
  ["simone-2-gravity.jpg", path.join(OUT_SVC, "simone-2-gravity.jpg")],
  ["simone-3-assort.jpg", path.join(OUT_SVC, "simone-3-assort.jpg")],
  ["simone-4-wrap.jpg", path.join(OUT_SVC, "simone-4-wrap.jpg")],
  ["ella-1-perfect.jpg", path.join(OUT_SVC, "ella-1-perfect.jpg")],
  ["ella-2-lifting.jpg", path.join(OUT_SVC, "ella-2-lifting.jpg")],
  ["ella-3-age.jpg", path.join(OUT_SVC, "ella-3-age.jpg")],
  ["bernard-1-spirulina.jpg", path.join(OUT_SVC, "bernard-1-spirulina.jpg")],
  ["bernard-2-chocolate.jpg", path.join(OUT_SVC, "bernard-2-chocolate.jpg")],
  ["bernard-3-pineapple.jpg", path.join(OUT_SVC, "bernard-3-pineapple.jpg")],
  ["phyts-millezim.jpg", path.join(OUT_SVC, "phyts-millezim.jpg")],
  ["dep-mustache.jpg", path.join(OUT_DEP, "mustache.jpg")],
  ["dep-chin-beard.jpg", path.join(OUT_DEP, "beard.jpg")],
  ["dep-stomach.jpg", path.join(OUT_DEP, "stomach.jpg")],
  ["dep-chest.jpg", path.join(OUT_DEP, "chest.jpg")],
  ["dep-shoulders.jpg", path.join(OUT_DEP, "shoulders.jpg")],
];

for (const [src, dest] of jobs) {
  await optimize(src, dest);
}

const services = JSON.parse(readFileSync("data/services.json", "utf8"));

const bySlug = {
  vakuumnyy_gidropiling_i_ochischenie_kozhi: "/redesign/svc/hydra-1-peel.jpg",
  fonoforez_mikrotokovaya_terapiya: "/redesign/svc/hydra-2-micro.jpg",
  rf_lifting: "/redesign/svc/hydra-3-rf.jpg",
  spa_platforma_litso_sheya_dekolte_kompleks: "/redesign/svc/hydra-4-complex.jpg",
  vakuumnyy_gidropiling_ultrazvuk_elektroporatsiya: "/redesign/svc/hydra-5-ultra.jpg",
  vakuumnyy_gidropiling_ultrazvuk_mikrotoki_lifting_fonoforez: "/redesign/svc/hydra-6-full.jpg",
  rf_lifting_ionizatsiya_maski: "/redesign/svc/hydra-7-mask.jpg",
  avtograf_molodosti: "/redesign/svc/simone-1-youth.jpg",
  skin_gravity: "/redesign/svc/simone-2-gravity.jpg",
  uhod_v_assortimente_po_tipu_kozhi_i_probleme_dlya_litsa: "/redesign/svc/simone-3-assort.jpg",
  obertyvanie: "/redesign/svc/simone-4-wrap.jpg",
  uhod_dlya_molodosti_i_siyaniya_ella_perfect: "/redesign/svc/ella-1-perfect.jpg",
  premium_uhod_skinssime_globalnyy_lifting: "/redesign/svc/ella-2-lifting.jpg",
  uhod_morfostrukturirovaniya_age_doctor: "/redesign/svc/ella-3-age.jpg",
  omolozhenie_so_spirulinoj: "/redesign/svc/bernard-1-spirulina.jpg",
  shokoladnoe_fondyu: "/redesign/svc/bernard-2-chocolate.jpg",
  telo_s_ananasom: "/redesign/svc/bernard-3-pineapple.jpg",
  millezim: "/redesign/svc/phyts-millezim.jpg",
};

const byKey = {
  "epilyaciya/usiki": "/redesign/dep/mustache.jpg",
  "epilyaciya/boroda": "/redesign/dep/beard.jpg",
  "epilyaciya/zhivot": "/redesign/dep/stomach.jpg",
  "epilyaciya/grud_dlya_muzhchin_protsedura": "/redesign/dep/chest.jpg",
  "epilyaciya/plechi": "/redesign/dep/shoulders.jpg",
  "epilyaciya/nogi_do_kolena": "/redesign/dep/legs-calves.jpg",
  "epilyaciya/nogi_vyshe_kolena": "/redesign/dep/legs-thighs.jpg",
  "epilyaciya/nogi_polnostyu": "/redesign/dep/legs-full.jpg",
  "epilyaciya/yagodicy": "/redesign/dep/glutes.jpg",
  "epilyaciya/spina": "/redesign/dep/back.jpg",
  "epilyaciya/ruki": "/redesign/dep/arms.jpg",
  "epilyaciya/zona_podmyshek": "/redesign/dep/underarm.jpg",
  "epilyaciya/bikini_pod_trusiki": "/redesign/dep/bikini-classic.jpg",
  "epilyaciya/bikini_glubokoe": "/redesign/dep/bikini-deep.jpg",

  "lazernaya_epilyaciya/spina": "/redesign/dep/back.jpg",
  "lazernaya_epilyaciya/zhivot": "/redesign/dep/stomach.jpg",
  "lazernaya_epilyaciya/malaya_zona": "/redesign/dep/mustache.jpg",
  "lazernaya_epilyaciya/ruki_polnostyu": "/redesign/dep/arms.jpg",
  "lazernaya_epilyaciya/ruki_do_loktya": "/redesign/dep/shoulders.jpg",
  "lazernaya_epilyaciya/nogi_vyshe_kolena": "/redesign/dep/legs-thighs.jpg",
  "lazernaya_epilyaciya/nogi_do_kolena": "/redesign/dep/legs-calves.jpg",
  "lazernaya_epilyaciya/nogi_polnostyu": "/redesign/dep/legs-full.jpg",
  "lazernaya_epilyaciya/klassika_bikini": "/redesign/dep/bikini-classic.jpg",
  "lazernaya_epilyaciya/glubokoe_bikini": "/redesign/dep/bikini-deep.jpg",
  "lazernaya_epilyaciya/podmyshechnye_vpadiny": "/redesign/dep/underarm.jpg",
  "lazernaya_epilyaciya/glubokoe_bikini_podmyshki_nogi_polnostyu_ruki_polnostyu_spin":
    "/redesign/dep/legs-full.jpg",
  "lazernaya_epilyaciya/glubokoe_bikini_podmyshki_nogi_polnostyu":
    "/redesign/dep/bikini-deep.jpg",
  "lazernaya_epilyaciya/podmyshki_nogi_polnostyu_ruki_polnostyu":
    "/redesign/dep/arms.jpg",
  "lazernaya_epilyaciya/glubokoe_bikini_podmyshki_nogi_do_kolena_goleni":
    "/redesign/dep/legs-calves.jpg",
  "lazernaya_epilyaciya/glubokoe_bikini_podmyshki": "/redesign/dep/underarm.jpg",
};

let updated = 0;
for (const s of services) {
  const key = `${s.category}/${s.slug}`;
  let img = byKey[key];
  if (!img && s.category !== "lazernaya_epilyaciya" && s.category !== "epilyaciya") {
    img = bySlug[s.slug];
  }
  if (!img) continue;
  if (s.image === img && s.cardImage === img) continue;
  s.image = img;
  s.cardImage = img;
  updated++;
}

writeFileSync("data/services.json", JSON.stringify(services, null, 2) + "\n");
console.log("services updated", updated);

const counts = new Map();
for (const s of services) {
  const img = s.cardImage || s.image;
  if (!counts.has(img)) counts.set(img, []);
  counts.get(img).push(`${s.category}/${s.slug}`);
}
const dups = [...counts.entries()].filter(([, arr]) => arr.length > 1);
console.log("remaining dups:");
for (const [img, arr] of dups.sort((a, b) => b[1].length - a[1].length)) {
  console.log(arr.length, img, "->", arr.join(", "));
}
