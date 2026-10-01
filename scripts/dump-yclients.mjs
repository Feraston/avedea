/**
 * Temporary: dump YClients booking catalog to a local JSON file.
 * Opens the public widget, intercepts API responses, writes disk only.
 *
 * Usage: node scripts/dump-yclients.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "tmp");
const OUT_FILE = path.join(OUT_DIR, "yclients-dump.json");

const COMPANY_ID = "185262";
const FORM_ID = "182496";
const START_URL = `https://b${FORM_ID}.yclients.com/company/${COMPANY_ID}/personal/select-services?o=`;

const INTERESTING =
  /book_services|book_staff|search-services|promo_blocks|certificate|abonement|gift|loyalty|applications|availability|custom_fields|feature_flags|location\/185262/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const captured = [];
  const seen = new Set();

  console.log("Launching browser…");
  // Prefer installed browsers to avoid downloading Playwright Chromium (~200MB).
  let browser;
  const channels = ["chrome", "msedge"];
  browser = null;
  for (const channel of channels) {
    try {
      browser = await chromium.launch({ headless: true, channel });
      console.log(`Using channel: ${channel}`);
      break;
    } catch (e) {
      console.log(`Channel ${channel} unavailable: ${e.message?.split("\n")[0]}`);
    }
  }
  if (!browser) {
    console.log("Falling back to Playwright Chromium…");
    browser = await chromium.launch({ headless: true });
  }
  const context = await browser.newContext({
    locale: "ru-RU",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    viewport: { width: 420, height: 900 },
  });
  const page = await context.newPage();

  page.on("response", async (response) => {
    try {
      const url = response.url();
      if (!INTERESTING.test(url)) return;
      if (response.status() >= 400) return;
      const ct = response.headers()["content-type"] || "";
      if (!/json|javascript|text/i.test(ct) && !url.includes("/api/")) return;

      const body = await response.text();
      if (!body || body.length < 3) return;

      const key = `${response.status()} ${url} ${body.length}`;
      if (seen.has(key)) return;
      seen.add(key);

      captured.push({
        url,
        status: response.status(),
        contentType: ct,
        length: body.length,
        at: new Date().toISOString(),
        body,
      });
      console.log(`  + ${response.status()} ${body.length}B  ${url.slice(0, 120)}`);
    } catch {
      // Ignore aborted/closed responses.
    }
  });

  console.log("Opening widget:", START_URL);
  await page.goto(START_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("text=Выбрать услуги", { timeout: 60000 }).catch(() => {});
  await sleep(4000);

  // Scroll to trigger lazy loads.
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 1200);
    await sleep(400);
  }

  // Try opening certificates / abonements promo if present.
  const certBtn = page.getByRole("button", {
    name: /сертификат|абонемент/i,
  });
  if (await certBtn.first().isVisible().catch(() => false)) {
    console.log("Opening certificates / abonements…");
    await certBtn.first().click({ timeout: 5000 }).catch(() => {});
    await sleep(3500);
    // Go back to services if a sheet opened.
    const back = page.locator('[aria-label*="Назад"], button:has-text("Назад"), a:has-text("Назад")').first();
    if (await back.isVisible().catch(() => false)) {
      await back.click().catch(() => {});
      await sleep(1500);
    } else {
      await page.keyboard.press("Escape").catch(() => {});
      await sleep(800);
      await page.goto(START_URL, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
      await sleep(2500);
    }
  }

  // Soft reload once more to re-hit availability endpoints if first pass was thin.
  if (!captured.some((c) => /book_services/i.test(c.url))) {
    console.log("book_services not seen yet — reloading…");
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await sleep(5000);
  }

  await browser.close();

  // Parse compact summaries for quick inspection (full bodies stay in file).
  const summary = {
    dumpedAt: new Date().toISOString(),
    companyId: COMPANY_ID,
    formId: FORM_ID,
    startUrl: START_URL,
    responseCount: captured.length,
    urls: captured.map((c) => ({
      url: c.url,
      status: c.status,
      length: c.length,
    })),
  };

  const servicesHit = captured.find((c) => /book_services/i.test(c.url));
  let servicesCompact = null;
  if (servicesHit) {
    try {
      const parsed = JSON.parse(servicesHit.body);
      const services =
        parsed?.data?.services || parsed?.services || parsed?.data || [];
      const categories =
        parsed?.data?.category ||
        parsed?.data?.categories ||
        parsed?.category ||
        [];
      if (Array.isArray(services)) {
        servicesCompact = {
          count: services.length,
          categories: Array.isArray(categories)
            ? categories.map((c) => ({
                id: c.id,
                title: c.title,
                weight: c.weight,
              }))
            : categories,
          services: services.map((s) => ({
            id: s.id,
            title: s.title,
            category_id: s.category_id ?? s.categoryId,
            price_min: s.price_min ?? s.priceMin,
            price_max: s.price_max ?? s.priceMax,
            seance_length: s.seance_length ?? s.seanceLength,
            prepaid: s.prepaid,
            comment: typeof s.comment === "string" ? s.comment.slice(0, 120) : undefined,
          })),
        };
      }
    } catch (e) {
      summary.servicesParseError = String(e);
    }
  }

  const staffHit = captured.find((c) => /book_staff/i.test(c.url));
  let staffCompact = null;
  if (staffHit) {
    try {
      const parsed = JSON.parse(staffHit.body);
      const staff = parsed?.data?.staff || parsed?.staff || parsed?.data || [];
      if (Array.isArray(staff)) {
        staffCompact = staff.map((s) => ({
          id: s.id,
          name: s.name ?? s.title,
          specialization: s.specialization,
          bookable: s.bookable,
        }));
      }
    } catch (e) {
      summary.staffParseError = String(e);
    }
  }

  const dump = {
    summary,
    servicesCompact,
    staffCompact,
    responses: captured,
  };

  await writeFile(OUT_FILE, JSON.stringify(dump, null, 2), "utf8");
  console.log(`\nWrote ${OUT_FILE}`);
  console.log(`Responses: ${captured.length}`);
  if (servicesCompact) console.log(`Services: ${servicesCompact.count}`);
  if (staffCompact) console.log(`Staff: ${staffCompact.length}`);
  if (!servicesCompact) {
    console.warn(
      "WARNING: no book_services payload captured. Open the dump urls list and retry.",
    );
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
