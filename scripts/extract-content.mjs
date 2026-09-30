import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const legacy = path.join(root, "_legacy");
const dataDir = path.join(root, "data");

fs.mkdirSync(dataDir, { recursive: true });

function readHtml(rel) {
  return fs.readFileSync(path.join(legacy, rel), "utf8");
}

function toPublicPath(src) {
  if (!src) return "";
  const cleaned = src.replace(/\\/g, "/");
  const idx = cleaned.indexOf("blocks/");
  if (idx !== -1) return "/" + cleaned.slice(idx);
  const img = cleaned.indexOf("image/");
  if (img !== -1) return "/" + cleaned.slice(img);
  if (cleaned.startsWith("/")) return cleaned;
  return cleaned;
}

function cleanText(text) {
  return (text || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPlaceholderDuration(text) {
  return !text || /-\s*ч/.test(text) || text.includes("--");
}

function parseDuration(moneyNodes) {
  for (const node of moneyNodes) {
    const t = cleanText(node);
    if (t.includes("Время:")) {
      const value = t.replace(/^Время:\s*/, "").trim();
      if (isPlaceholderDuration(value)) return undefined;
      return value;
    }
  }
  return undefined;
}

/** @returns {import('cheerio').CheerioAPI} */
function load(rel) {
  return cheerio.load(readHtml(rel));
}

function extractServices() {
  const $ = load("page/services.html");
  const services = [];
  let categoryTitle = "";
  let categorySlug = "";
  let order = 0;

  $("h3.services__category, div.services__service").each((_, el) => {
    const tag = el.tagName?.toLowerCase() || el.name;
    if (tag === "h3") {
      categoryTitle = cleanText($(el).text());
      return;
    }

    // Skip HTML-commented services — cheerio won't see them
    const $card = $(el);
    const title = cleanText($card.find(".services__service-name").first().text());
    const cardImage = toPublicPath($card.find("img.services__img").attr("src"));
    const href = $card.find("a.services__button").attr("href") || "";
    const moneyTexts = $card
      .find(".services__money")
      .map((_, n) => $(n).text())
      .get();
    const cardDuration = parseDuration(moneyTexts);

    const match = href.replace(/\\/g, "/").match(/uslugi\/([^/]+)\/([^/]+)\.html$/);
    if (!match) return;
    categorySlug = match[1];
    if (categorySlug === "arhiv") return;
    const slug = match[2];

    const detailRel = path
      .join("page", "uslugi", categorySlug, `${slug}.html`)
      .replace(/\\/g, "/");
    const detailPath = path.join(legacy, detailRel);
    if (!fs.existsSync(detailPath)) {
      console.warn("Missing detail page:", detailRel);
      return;
    }

    const $d = cheerio.load(fs.readFileSync(detailPath, "utf8"));
    const detailTitle = cleanText($d(".uslugi__title").first().text()) || title;
    const image = toPublicPath($d("img.uslugi__images").attr("src")) || cardImage;
    const detailMoney = $d(".uslugi__montime")
      .map((_, n) => $d(n).text())
      .get();
    const duration = parseDuration(detailMoney) || cardDuration;

    const description = [];
    const listItems = [];
    $d(".uslugi__toc")
      .children()
      .each((_, node) => {
        const $n = $d(node);
        if ($n.hasClass("uslugi__content")) {
          const t = cleanText($n.text());
          if (t && !t.startsWith("Цена:") && !t.startsWith("Время:")) {
            description.push(t);
          }
        }
        if ($n.hasClass("uslugi__list") || $n.is("ul")) {
          $n.find("li").each((__, li) => {
            const t = cleanText($d(li).text());
            if (t) listItems.push(t);
          });
        }
      });

    // Also catch lists that are siblings after content
    $d("ul.uslugi__list").each((_, ul) => {
      $d(ul)
        .find("li")
        .each((__, li) => {
          const t = cleanText($d(li).text());
          if (t && !listItems.includes(t)) listItems.push(t);
        });
    });

    const yclientsUrl =
      $d("a.uslugi__button").attr("href") ||
      "https://b182496.yclients.com/company/185262/record-type?o=s7743448";

    order += 1;
    services.push({
      slug,
      category: categorySlug,
      categoryTitle,
      title: detailTitle,
      image,
      cardImage: cardImage !== image ? cardImage : undefined,
      duration,
      description,
      listItems: listItems.length ? listItems : undefined,
      yclientsUrl,
      order,
    });
  });

  return services;
}

function extractAbonements() {
  const files = [
    { file: "page/abon/abon1.html", slug: "abon1", cardImage: "/blocks/sale/file/sale1.jpg" },
    { file: "page/abon/abon2.html", slug: "abon2", cardImage: "/blocks/sale/file/sale2.jpg" },
    { file: "page/abon/abon3.html", slug: "abon3", cardImage: "/blocks/sale/file/sale3.jpg" },
  ];

  return files.map((item, index) => {
    const $ = load(item.file);
    const title = cleanText($(".abonement__title").first().text());
    const image = toPublicPath($(".abonement__images").attr("src")) || item.cardImage;
    const summary = [];
    $(".abonement__toc > .abonement__content").each((_, el) => {
      // only direct top-level before expandable? take all top-level content not inside winclose
      const parent = $(el).parent();
      if (parent.hasClass("abonement__winclose")) return;
      const t = cleanText($(el).text());
      if (t) summary.push(t);
    });

    // Better: get content blocks that are direct children of toc before first button
    const topSummary = [];
    $(".abonement__toc")
      .children()
      .each((_, el) => {
        if (el.tagName === "button" || el.name === "button") return false;
        if ($(el).hasClass("abonement__content")) {
          const t = cleanText($(el).text());
          if (t) topSummary.push(t);
        }
      });

    const sections = [];
    $(".abonement__hidwin").each((_, btn) => {
      const label = cleanText($(btn).text());
      const panel = $(btn).next(".abonement__winclose");
      const paragraphs = [];
      const lists = [];
      panel.children().each((__, child) => {
        const $c = $(child);
        if ($c.hasClass("abonement__content")) {
          paragraphs.push(cleanText($c.text()));
        }
        if ($c.hasClass("abonement__list") || $c.is("ul")) {
          const items = $c
            .find("li")
            .map((___, li) => cleanText($(li).text()))
            .get()
            .filter(Boolean);
          if (items.length) lists.push(items);
        }
      });
      sections.push({ label, paragraphs, lists });
    });

    const yclientsUrl =
      $("a.abonement__button-abon").attr("href") ||
      "https://b182496.yclients.com/company/185262/record-type?o=s7743448";

    // Home sale card fields
    const saleTitles = [
      { name: "«Стройность кипариса»", cost: "33 600 руб (выгода до 8 000 рублей).", includes: "6 процедур «Биоактивное похудение».", gift: "на сумму 5600 рублей." },
      { name: "«Шелковая кожа»", cost: "20 100 руб (выгода до 3 000 рублей).", includes: "5 процедур для всего тела.", gift: "на сумму 2700 рублей." },
      { name: "«Император мечты»", cost: "40 000 руб (выгода до 8 000 рублей).", includes: "4 «Комплексных ухода для мужчин»", gift: "на сумму 7 500 рублей." },
    ];

    return {
      slug: item.slug,
      title: title || saleTitles[index].name,
      image,
      cardImage: item.cardImage,
      preview: saleTitles[index],
      summary: topSummary.length ? topSummary : summary,
      sections,
      yclientsUrl,
      order: index + 1,
    };
  });
}

function extractSpecialists() {
  const files = [
    {
      file: "page/spec/pers_es.html",
      slug: "elena-sorokina",
      legacySlug: "pers_es",
      homeImage: "/blocks/master/file/spec_es.jpg",
      posts: ["Идейный вдохновитель", "Основатель студии Avedea"],
      shortName: "Елена Сорокина",
    },
    {
      file: "page/spec/pers_vp.html",
      slug: "viktoria-priemskaya",
      legacySlug: "pers_vp",
      homeImage: "/blocks/master/file/spec_vp.png",
      posts: ["Косметолог-натуроэстетист"],
      shortName: "Виктория Приемская",
    },
    {
      file: "page/spec/pers_ak.html",
      slug: "anastasia-kravchenko",
      legacySlug: "pers_ak",
      homeImage: "/blocks/master/file/spec_ak.jpg",
      posts: ["Косметолог-натуроэстетист"],
      shortName: "Анастасия Кравченко",
    },
  ];

  return files.map((meta, index) => {
    const $ = load(meta.file);
    const title = cleanText($(".specialist__title").first().text());
    const image = toPublicPath($(".specialist__img").attr("src")) || meta.homeImage;
    const body = [];
    $(".specialist__body")
      .children()
      .each((_, el) => {
        const $el = $(el);
        if ($el.hasClass("specialist__content")) {
          body.push({ type: "heading", text: cleanText($el.text()) });
        } else if ($el.hasClass("specialist__list") || $el.is("ul")) {
          body.push({
            type: "list",
            items: $el
              .find("li")
              .map((__, li) => cleanText($(li).text()))
              .get()
              .filter(Boolean),
          });
        }
      });

    const yclientsUrl =
      $("a.specialist__button").attr("href") ||
      "https://b182496.yclients.com/company/185262/record-type?o=s7743448";

    const certificates = $(".swiper-slide img")
      .map((_, img) => ({
        src: toPublicPath($(img).attr("src")),
        alt: $(img).attr("alt") || "Сертификат",
      }))
      .get()
      .filter((c) => c.src);

    return {
      slug: meta.slug,
      legacySlug: meta.legacySlug,
      title,
      shortName: meta.shortName,
      posts: meta.posts,
      image,
      homeImage: meta.homeImage,
      body,
      certificates,
      yclientsUrl,
      order: index + 1,
    };
  });
}

function extractTraining() {
  const $ = load("page/training.html");
  const seminars = [];
  const names = $(".training__name").toArray();
  names.forEach((nameEl, i) => {
    const title = cleanText($(nameEl).text());
    // image is after hr following the name
    let img = "";
    let $cursor = $(nameEl);
    for (let j = 0; j < 5; j++) {
      $cursor = $cursor.next();
      if ($cursor.hasClass("training__img")) {
        img = toPublicPath($cursor.attr("src"));
        break;
      }
      if ($cursor.is("img.training__img")) {
        img = toPublicPath($cursor.attr("src"));
        break;
      }
    }
    // Also try sibling search
    if (!img) {
      const sectionImgs = $(".training__img").eq(i);
      img = toPublicPath(sectionImgs.attr("src"));
    }

    const main = $(".training__main").eq(i);
    const paragraphs = main
      .find(".training__content")
      .map((_, p) => {
        const $p = $(p);
        const label = cleanText($p.find(".training__weight").first().text());
        // clone without mutating
        const full = cleanText($p.text());
        return { label: label || undefined, text: full };
      })
      .get();

    const cta = $(".training__button").eq(i).attr("href") ||
      "https://forms.yandex.ru/u/6250ab4e6e96254a246c628e/";

    seminars.push({
      slug: title
        .toLowerCase()
        .replace(/[«»"]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-zа-я0-9-]/gi, ""),
      title,
      image: img,
      paragraphs,
      ctaUrl: cta,
      order: i + 1,
    });
  });

  return seminars;
}

function extractHome() {
  const $ = load("index.html");
  const about = $(".description__content")
    .map((_, p) => cleanText($(p).text()))
    .get()
    .filter(Boolean);

  const aboutImage = toPublicPath($(".description__images").attr("src"));

  // Laser popup prep (without prices)
  const prepItems = [];
  $("#new_popup .popup__list")
    .first()
    .find(".popup__card_content_two")
    .each((_, el) => {
      const t = cleanText($(el).text());
      if (t) prepItems.push(t);
    });

  const setNames = [];
  $("#new_popup .popup__content").each((_, el) => {
    const t = cleanText($(el).text());
    if (t.includes("СЕТы") || t.includes("Прайс")) return;
  });

  // Extract set card names only (no prices)
  const sets = [];
  $("#new_popup .popup__list")
    .eq(1)
    .find(".popup__card_content")
    .each((_, el) => {
      const t = cleanText($(el).text());
      if (t) sets.push(t);
    });

  const zones = [];
  $("#new_popup .popup__list")
    .eq(2)
    .find(".popup__card_content")
    .each((_, el) => {
      const t = cleanText($(el).text());
      if (t) zones.push(t);
    });

  return {
    about,
    aboutImage,
    laserPopup: {
      title: "Аппаратная косметология",
      prepTitle: "Подготовка к лазерной эпиляции",
      prepItems,
      setsTitle: "Лазерная эпиляция — выгодные сеты",
      sets,
      zonesTitle: "Зоны лазерной эпиляции",
      zones,
    },
  };
}

const services = extractServices();
const abonements = extractAbonements();
const specialists = extractSpecialists();
const training = extractTraining();
const home = extractHome();

fs.writeFileSync(path.join(dataDir, "services.json"), JSON.stringify(services, null, 2), "utf8");
fs.writeFileSync(path.join(dataDir, "abonements.json"), JSON.stringify(abonements, null, 2), "utf8");
fs.writeFileSync(path.join(dataDir, "specialists.json"), JSON.stringify(specialists, null, 2), "utf8");
fs.writeFileSync(path.join(dataDir, "training.json"), JSON.stringify(training, null, 2), "utf8");
fs.writeFileSync(path.join(dataDir, "home.json"), JSON.stringify(home, null, 2), "utf8");

console.log(`Services: ${services.length}`);
console.log(`Abonements: ${abonements.length}`);
console.log(`Specialists: ${specialists.length}`);
console.log(`Training: ${training.length}`);
console.log("Categories:", [...new Set(services.map((s) => s.category))].join(", "));
