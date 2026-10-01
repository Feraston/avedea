/**
 * Rebuild data/services.json from tmp/yclients-dump.json.
 * Keeps rich local copy where IDs/titles match; adds new YClients services;
 * remaps waxing IDs by fuzzy title; drops obsolete + non-catalog items.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dump = JSON.parse(readFileSync(path.join(ROOT, "tmp/yclients-dump.json"), "utf8"));
const local = JSON.parse(readFileSync(path.join(ROOT, "data/services.json"), "utf8"));
const abonements = JSON.parse(readFileSync(path.join(ROOT, "data/abonements.json"), "utf8"));

const BOOK = "https://b182496.yclients.com/company/185262/create-record";

const CAT_MAP = {
  17479269: { category: "hydrafacial", categoryTitle: "SPA Vortex Hydrafacial" },
  7743403: { category: "esteticheskaya_kosmetologiya", categoryTitle: "Эстетическая косметология" },
  7743397: { category: "vizazh", categoryTitle: "Оформление бровей и ресниц" },
  7743396: { category: "apparatnaya", categoryTitle: "Аппаратная косметология" },
  7743399: { category: "massazh_tela", categoryTitle: "СПА-массаж тела" },
  7743400: { category: "uhody_phuts_lico", categoryTitle: "Уходы PHYT'S — лицо" },
  7743398: { category: "massazh_lica", categoryTitle: "СПА-массаж лица" },
  7743401: { category: "uhody_phyts_telo", categoryTitle: "Уходы PHYT'S — тело" },
  14966135: { category: "esteticheskaya_kosmetologiya", categoryTitle: "Эстетическая косметология" },
  14387380: { category: "lazernaya_epilyaciya", categoryTitle: "Лазерная эпиляция" },
  14829704: { category: "ella_bache", categoryTitle: "Ella Baché" },
  13863043: { category: "thalgo", categoryTitle: "Thalgo" },
  12623655: { category: "obertyvanie_telo", categoryTitle: "Обертывание тела" },
  13064125: { category: "simone_mahler", categoryTitle: "Уходы Simone Mahler" },
  12902023: { category: "epilyaciya", categoryTitle: "Депиляция" },
  12201595: { category: "bernard_kasser", categoryTitle: "Уходы Бернард Кассьер" },
  27267219: { category: "permanent", categoryTitle: "Перманентный макияж" },
  28123398: { category: "piercing", categoryTitle: "Пирсинг" },
};

/** Skip retail / logistics / seminars / abonements-as-services (abonements live in abonements.json) */
const SKIP_CAT_IDS = new Set([
  10232467, // Доставка
  13122825, // Семинары
  21427503, // Комплексная процедура-уход (retail)
  9922149, // АБОНЕМЕНТЫ
  14257342, // Сертификат подарочный (empty in API)
]);

const COVER_BY_CAT = {
  hydrafacial: "/redesign/soft/promo-laser.jpg",
  esteticheskaya_kosmetologiya: "/blocks/uslugi/file/usluga11.jpg",
  vizazh: "/blocks/uslugi/file/usluga31.jpg",
  apparatnaya: "/blocks/greeting/file/apparat.png",
  massazh_tela: "/blocks/uslugi/file/usluga61.jpg",
  uhody_phuts_lico: "/blocks/uslugi/file/usluga51.jpg",
  massazh_lica: "/blocks/uslugi/file/usluga21.jpg",
  uhody_phyts_telo: "/blocks/uslugi/file/usluga64.jpg",
  lazernaya_epilyaciya: "/blocks/uslugi/file/usluga81.jpg",
  ella_bache: "/redesign/soft/about-soft.jpg",
  thalgo: "/blocks/uslugi/file/usluga71.jpg",
  obertyvanie_telo: "/blocks/uslugi/file/usluga71.jpg",
  simone_mahler: "/redesign/gen/texture.jpg",
  epilyaciya: "/redesign/dep/legs-thighs.jpg",
  bernard_kasser: "/blocks/uslugi/file/usluga75.jpg",
  permanent: "/blocks/uslugi/file/usluga31.jpg",
  piercing: "/redesign/gen/texture.jpg",
};

const DEP_IMAGES = {
  "ноги выше колена": "/redesign/dep/legs-thighs.jpg",
  "ноги полностью": "/redesign/dep/legs-full.jpg",
  ягодицы: "/redesign/dep/glutes.jpg",
  спина: "/redesign/dep/back.jpg",
  руки: "/redesign/dep/arms.jpg",
  "ноги до колена": "/redesign/dep/legs-calves.jpg",
  "бикини под трусики": "/redesign/dep/bikini-classic.jpg",
  "глубокое бикини": "/redesign/dep/bikini-deep.jpg",
  "зона подмышек": "/redesign/dep/underarm.jpg",
  подбородок: "/redesign/dep/chin.jpg",
};

function norm(t) {
  return String(t)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»"'„“]/g, "")
    .replace(/депиляция\s*/g, "")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();
}

function slugify(title) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return String(title)
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "service";
}

function idFromUrl(u) {
  const m = String(u || "").match(/s(\d+)/);
  return m ? Number(m[1]) : null;
}

function bookUrl(id) {
  return `${BOOK}?o=m-1s${id}`;
}

function formatDuration(sec) {
  if (!sec || sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h && m) return `${h} ч ${String(m).padStart(2, "0")} м`;
  if (h) return `${h} ч 00 м`;
  return `${m} м`;
}

function formatPrice(min, max) {
  if (min == null) return "";
  const fmt = (n) => `${Number(n).toLocaleString("ru-RU")} ₽`;
  if (max != null && max !== min) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min);
}

function descriptionFromComment(comment) {
  if (!comment || !String(comment).trim()) {
    return ["Запись онлайн через YClients. Уточните детали у администратора студии."];
  }
  const parts = String(comment)
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts.slice(0, 6) : [String(comment).trim()];
}

function depImageFor(title) {
  const n = norm(title);
  for (const [key, img] of Object.entries(DEP_IMAGES)) {
    if (n.includes(key)) return img;
  }
  return null;
}

const rawHit = dump.responses.find((r) => /book_services/i.test(r.url));
const raw = JSON.parse(rawHit.body);
const ycAll = raw?.services || raw?.data?.services || [];
const seanceById = new Map(ycAll.map((s) => [s.id, s.seance_length]));
const commentById = new Map(ycAll.map((s) => [s.id, s.comment || ""]));
const imageById = new Map(
  ycAll.map((s) => {
    const img =
      s.image ||
      (Array.isArray(s.images) && s.images[0]
        ? typeof s.images[0] === "string"
          ? s.images[0]
          : s.images[0].path || s.images[0].url
        : null);
    return [s.id, img];
  }),
);

const searchHit = dump.responses.find((r) => /search-services$/i.test(r.url));
const searchRaw = searchHit ? JSON.parse(searchHit.body) : { data: [] };
const searchItems = Array.isArray(searchRaw.data)
  ? searchRaw.data
  : Object.values(searchRaw.data || {});
const notBookableIds = new Set(
  searchItems
    .filter(
      (x) =>
        x?.attributes?.is_bookable === false ||
        x?.attributes?.bookable_status === "not_bookable_with_selected_time",
    )
    .map((x) => Number(x.id)),
);

const compact = ycAll
  .filter((s) => !SKIP_CAT_IDS.has(s.category_id))
  .filter((s) => !notBookableIds.has(s.id))
  .map((s) => ({
    id: s.id,
    title: s.title,
    category_id: s.category_id,
    price_min: s.price_min,
    price_max: s.price_max,
    comment: s.comment || "",
  }));

console.log(
  `Filtered not_bookable: ${notBookableIds.size} ids; catalog candidates: ${compact.length}`,
);

const localById = new Map();
for (const s of local) {
  const id = idFromUrl(s.yclientsUrl);
  if (id) localById.set(id, s);
}

const localByNorm = new Map();
for (const s of local) {
  const keys = [norm(s.title), norm(s.title.replace(/^депиляция\s*/i, ""))];
  for (const k of keys) {
    if (!k) continue;
    if (!localByNorm.has(k)) localByNorm.set(k, []);
    localByNorm.get(k).push(s);
  }
}

function tokens(t) {
  return new Set(norm(t).split(" ").filter(Boolean));
}

function scoreTitle(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const x of ta) if (tb.has(x)) inter++;
  return inter / Math.max(ta.size, tb.size);
}

function pickLocal(yc, targetCategory) {
  const byId = localById.get(yc.id);
  if (byId) return { base: byId, matchKind: "id" };

  const n = norm(yc.title);
  const candidates = [
    ...(localByNorm.get(n) || []),
    ...[...localByNorm.entries()]
      .filter(([k]) => scoreTitle(k, n) >= 0.75)
      .flatMap(([, arr]) => arr),
  ];

  const unique = [...new Map(candidates.map((c) => [`${c.category}/${c.slug}`, c])).values()]
    .filter((c) => !usedLocalSlugs.has(`${c.category}/${c.slug}`));

  if (!unique.length) return { base: null, matchKind: "new" };

  const sameCat = unique.find((c) => c.category === targetCategory);
  const preferred = sameCat || unique.sort((a, b) => scoreTitle(b.title, yc.title) - scoreTitle(a.title, yc.title))[0];
  return { base: preferred, matchKind: "title" };
}

function displayTitle(ycTitle, baseTitle, matchKind) {
  let t = String(ycTitle).replace(/\.$/, "").trim();
  const m = t.match(/^депиляция\s*[«"'](.+?)[»"']$/i);
  if (m) {
    const inner = m[1].trim();
    return inner.charAt(0).toUpperCase() + inner.slice(1);
  }
  if (matchKind === "id" && baseTitle) return baseTitle;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const usedLocalSlugs = new Set();
const usedYcIds = new Set();
const out = [];
const report = {
  keptMatchedById: [],
  remappedByTitle: [],
  added: [],
  removed: [],
  skippedCats: [...SKIP_CAT_IDS],
};

function uniqueSlug(base, category) {
  let slug = base;
  let i = 2;
  while (usedLocalSlugs.has(`${category}/${slug}`)) {
    slug = `${base}_${i++}`;
  }
  usedLocalSlugs.add(`${category}/${slug}`);
  return slug;
}

const orderByCat = new Map();

for (const yc of compact) {
  const map = CAT_MAP[yc.category_id];
  if (!map) {
    console.warn("Unmapped category", yc.category_id, yc.title);
    continue;
  }
  usedYcIds.add(yc.id);

  const { base, matchKind } = pickLocal(yc, map.category);

  const order = (orderByCat.get(map.category) || 0) + 1;
  orderByCat.set(map.category, order);

  const cover =
    depImageFor(yc.title) ||
    (imageById.get(yc.id) && String(imageById.get(yc.id)).startsWith("http")
      ? imageById.get(yc.id)
      : null) ||
    COVER_BY_CAT[map.category] ||
    "/redesign/gen/texture.jpg";
  const seance = seanceById.get(yc.id);
  const duration = formatDuration(seance) || base?.duration || "";
  const title = displayTitle(yc.title, base?.title, matchKind);
  const fullComment = commentById.get(yc.id) || yc.comment || "";

  if (base && matchKind !== "new") {
    const slug = uniqueSlug(base.slug, map.category);
    out.push({
      ...base,
      slug,
      category: map.category,
      categoryTitle: map.categoryTitle,
      title,
      duration: duration || base.duration,
      yclientsUrl: bookUrl(yc.id),
      yclientsId: yc.id,
      priceLabel: formatPrice(yc.price_min, yc.price_max),
      order,
      image: base.image || cover,
      cardImage: base.cardImage || base.image || cover,
    });
    if (matchKind === "id") report.keptMatchedById.push({ id: yc.id, title: yc.title });
    else report.remappedByTitle.push({ id: yc.id, from: base.title, to: title });
  } else {
    const slug = uniqueSlug(slugify(title), map.category);
    const desc = descriptionFromComment(fullComment);
    out.push({
      slug,
      category: map.category,
      categoryTitle: map.categoryTitle,
      title,
      image: cover,
      cardImage: cover,
      duration,
      description: desc,
      yclientsUrl: bookUrl(yc.id),
      yclientsId: yc.id,
      priceLabel: formatPrice(yc.price_min, yc.price_max),
      order,
    });
    report.added.push({ id: yc.id, title, category: map.category });
  }
}

for (const s of local) {
  const id = idFromUrl(s.yclientsUrl);
  const still = id && usedYcIds.has(id);
  const remapped = report.remappedByTitle.some((r) => norm(r.from) === norm(s.title));
  // also check if local slug still in out
  const kept = out.some((o) => o.slug === s.slug && (o.yclientsId === id || norm(o.title) === norm(s.title)));
  if (!still && !remapped && !kept) {
    report.removed.push({ id, title: s.title, slug: s.slug, category: s.category });
  }
}

// Stable category order for site
const CAT_ORDER = [
  "hydrafacial",
  "esteticheskaya_kosmetologiya",
  "apparatnaya",
  "uhody_phuts_lico",
  "uhody_phyts_telo",
  "bernard_kasser",
  "simone_mahler",
  "ella_bache",
  "thalgo",
  "massazh_lica",
  "massazh_tela",
  "obertyvanie_telo",
  "vizazh",
  "permanent",
  "epilyaciya",
  "lazernaya_epilyaciya",
  "piercing",
];

out.sort((a, b) => {
  const ai = CAT_ORDER.indexOf(a.category);
  const bi = CAT_ORDER.indexOf(b.category);
  const ao = ai === -1 ? 999 : ai;
  const bo = bi === -1 ? 999 : bi;
  if (ao !== bo) return ao - bo;
  return a.order - b.order;
});

// Re-number order within categories
const seenCat = new Map();
for (const s of out) {
  const n = (seenCat.get(s.category) || 0) + 1;
  seenCat.set(s.category, n);
  s.order = n;
}

writeFileSync(path.join(ROOT, "data/services.json"), JSON.stringify(out, null, 2) + "\n", "utf8");

// Sync abonement booking URLs by fuzzy title match against dump abonements category
const abonYc = ycAll.filter((s) => s.category_id === 9922149);
let abonUpdated = 0;
const abonOut = abonements.map((a) => {
  const n = norm(a.title + " " + (a.preview?.name || ""));
  const hit =
    abonYc.find((y) => norm(y.title).includes(norm(a.preview?.name || "").replace(/[«»"]/g, ""))) ||
    abonYc.find((y) => {
      const yn = norm(y.title);
      return yn.includes("стройность") && n.includes("стройность")
        || yn.includes("шелковая") && n.includes("шелковая")
        || yn.includes("император") && n.includes("император");
    });
  if (!hit) return a;
  abonUpdated++;
  return { ...a, yclientsUrl: bookUrl(hit.id), yclientsId: hit.id };
});
writeFileSync(path.join(ROOT, "data/abonements.json"), JSON.stringify(abonOut, null, 2) + "\n", "utf8");

// Gifts / certificates catalog for homepage (YClients has empty cert category — curated CTAs)
const gifts = [
  {
    slug: "gift-any",
    title: "Подарочный сертификат",
    eyebrow: "Подарок",
    lead: "На любую процедуру или сумму — красивый способ сказать «заботься о себе».",
    cta: "Выбрать в записи",
    href: "https://b182496.yclients.com/company/185262/personal/select-services?o=",
    image: "/redesign/soft/abon-2.jpg",
  },
  {
    slug: "gift-hydrafacial",
    title: "HydraFacial в подарок",
    eyebrow: "Сияние",
    lead: "Вакуумный гидропилинг и комплексный уход — готовое впечатление без раздумий.",
    cta: "К процедуре",
    href: bookUrl(17479311),
    image: "/redesign/soft/promo-laser.jpg",
  },
  {
    slug: "gift-abon",
    title: "Абонемент с подарком",
    eyebrow: "Курс",
    lead: "Несколько процедур выгоднее разовых визитов — и с бонусом для домашнего ухода.",
    cta: "Смотреть абонементы",
    href: "#abonements",
    image: "/redesign/soft/abon-1.jpg",
  },
];
writeFileSync(path.join(ROOT, "data/gifts.json"), JSON.stringify(gifts, null, 2) + "\n", "utf8");

// Keep removed/hidden routes in generateStaticParams so old URLs redirect cleanly under output:export
const fallbackPath = path.join(ROOT, "data/service-fallbacks.json");
let existingFallbacks = [];
try {
  existingFallbacks = JSON.parse(readFileSync(fallbackPath, "utf8"));
} catch {
  existingFallbacks = [];
}
const fallbackMap = new Map(
  existingFallbacks.map((p) => [`${p.category}/${p.slug}`, p]),
);
for (const s of report.removed) {
  if (s.category && s.slug) {
    fallbackMap.set(`${s.category}/${s.slug}`, {
      category: s.category,
      slug: s.slug,
    });
  }
}
// also archive anything that was live before but filtered as not_bookable this run
for (const s of local) {
  const stillLive = out.some(
    (o) => o.category === s.category && o.slug === s.slug,
  );
  if (!stillLive) {
    fallbackMap.set(`${s.category}/${s.slug}`, {
      category: s.category,
      slug: s.slug,
    });
  }
}
writeFileSync(
  fallbackPath,
  JSON.stringify([...fallbackMap.values()], null, 2) + "\n",
  "utf8",
);

const summary = {
  localBefore: local.length,
  after: out.length,
  matchedById: report.keptMatchedById.length,
  remappedByTitle: report.remappedByTitle.length,
  added: report.added.length,
  removed: report.removed.length,
  abonUpdated,
  addedTitles: report.added.map((a) => `${a.category}: ${a.title}`),
  removedTitles: report.removed.map((a) => `${a.category}: ${a.title}`),
  remapped: report.remappedByTitle,
};
writeFileSync(path.join(ROOT, "tmp/yclients-sync-report.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  localBefore: summary.localBefore,
  after: summary.after,
  matchedById: summary.matchedById,
  remappedByTitle: summary.remappedByTitle,
  added: summary.added,
  removed: summary.removed,
  abonUpdated: summary.abonUpdated,
  removedTitles: summary.removedTitles,
}, null, 2));
