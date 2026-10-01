import Link from "next/link";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

export function Footer() {
  const socials = [
    { href: site.vkUrl, src: asset("/redesign/icons/vk.svg"), alt: "VK" },
    site.telegramUrl
      ? {
          href: site.telegramUrl,
          src: asset("/redesign/icons/telegram.svg"),
          alt: "Telegram",
        }
      : null,
    site.whatsappUrl
      ? {
          href: site.whatsappUrl,
          src: asset("/redesign/icons/whatsapp.svg"),
          alt: "WhatsApp",
        }
      : null,
  ].filter(Boolean) as { href: string; src: string; alt: string }[];

  return (
    <footer className="site-footer" id="contacts">
      <div className="wrap site-footer__grid">
        <div>
          <div className="site-footer__brand">{site.name}</div>
          <p className="site-footer__tag">{site.tagline}</p>
          <p className="site-footer__tag" style={{ marginTop: "1rem" }}>
            {site.addressFull}
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <a
              className="btn btn--ghost"
              href={site.yclientsBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Запись онлайн
            </a>
          </div>
        </div>

        <div className="site-footer__cols">
          <div>
            <p className="site-footer__label">Навигация</p>
            <ul className="site-footer__list">
              <li>
                <Link href="/">Главная</Link>
              </li>
              <li>
                <Link href="/services/">Услуги</Link>
              </li>
              <li>
                <Link href="/training/">Обучение</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="site-footer__label">Связь</p>
            <ul className="site-footer__list">
              <li>
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </li>
            </ul>
            {socials.length ? (
              <div className="site-footer__socials" style={{ marginTop: "1rem" }}>
                {socials.map((s) => (
                  <a
                    key={s.alt}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.alt}
                  >
                    <img src={s.src} alt="" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className="site-footer__label">Как нас найти</p>
          <iframe
            src={site.mapEmbedUrl}
            className="site-footer__map"
            title="Карта Avedea"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="wrap site-footer__bottom">
        <span>© {site.copyrightYears} {site.name}</span>
        <span>Holistic cosmetology · Краснодар</span>
      </div>
    </footer>
  );
}
