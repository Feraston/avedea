import { site } from "@/data/site";

export function Footer() {
  const socials = [
    { href: site.vkUrl, src: "/blocks/footer/file/vk.png", alt: "VK" },
    site.telegramUrl
      ? {
          href: site.telegramUrl,
          src: "/blocks/footer/file/telegram.png",
          alt: "Telegram",
        }
      : null,
    site.whatsappUrl
      ? {
          href: site.whatsappUrl,
          src: "/blocks/footer/file/WhatsApp.png",
          alt: "WhatsApp",
        }
      : null,
  ].filter(Boolean) as { href: string; src: string; alt: string }[];

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__socials">
          <div className="footer__telefone">
            <img
              src="/blocks/footer/file/tel.png"
              className="footer__tel-icon"
              alt=""
            />
            <div>
              <a className="footer__tel" href={`tel:${site.phone}`}>
                <img
                  className="footer__tel-img"
                  src="/blocks/header/file/tel.svg"
                  alt=""
                />
                <span className="footer__tel-text">{site.phoneDisplay}</span>
              </a>
            </div>
          </div>
          <div className="footer__adress">
            <img
              src="/blocks/footer/file/gps.png"
              className="footer__adr-icon"
              alt=""
            />
            <p className="footer__adr">{site.addressFull}</p>
          </div>
          {socials.length ? (
            <div className="footer__social">
              <p className="footer__social-text">Мы в соцсетях:</p>
              <div className="footer__social-links">
                {socials.map((s) => (
                  <a
                    key={s.alt}
                    href={s.href}
                    className="footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className="footer__image" src={s.src} alt={s.alt} />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="footer__links">
          <a
            className="footer__button"
            href={site.yclientsBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Запись онлайн
          </a>
        </div>
        <div id="adress" className="footer__maps">
          <iframe
            src={site.mapEmbedUrl}
            className="footer__map"
            title="Карта Avedea"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <div className="footer__terms">
        <p className="footer__copyright">© {site.copyrightYears}</p>
        <p className="footer__privacy">Avedea Holistic cosmetology</p>
      </div>
    </footer>
  );
}
