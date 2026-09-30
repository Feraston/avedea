"use client";

import Link from "next/link";
import { Popup, usePopup } from "@/components/Popup";
import { site } from "@/data/site";
import type { HomeContent } from "@/lib/content";

type Props = {
  laserPopup: HomeContent["laserPopup"];
};

function LaserPopupBody({ laserPopup }: Props) {
  return (
    <>
      <p className="popup-kicker">{laserPopup.prepTitle}</p>
      <ul>
        {laserPopup.prepItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="popup-kicker">{laserPopup.setsTitle}</p>
      <ul>
        {laserPopup.sets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="popup-kicker">{laserPopup.zonesTitle}</p>
      <ul>
        {laserPopup.zones.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={{ marginTop: "1.25rem" }}>
        Подробности и запись — в разделе{" "}
        <Link href="/services/lazernaya_epilyaciya/glubokoe_bikini/">услуг</Link>.
      </p>
    </>
  );
}

export function HomePromo({ laserPopup }: Props) {
  const { open, openPopup, closePopup } = usePopup();

  return (
    <>
      <section className="hero" aria-label="Avedea">
        <div className="hero__media" aria-hidden>
          <img
            src="/redesign/hero.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__shade" />
        </div>
        <div className="hero__content">
          <p className="hero__brand">{site.name}</p>
          <h1 className="hero__title">{site.heroTitle}</h1>
          <p className="hero__text">{site.tagline}</p>
          <div className="hero__actions">
            <a
              className="btn btn--primary"
              href={site.yclientsBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Записаться
            </a>
            <Link className="btn btn--ghost" href="/services/">
              Смотреть услуги
            </Link>
          </div>
        </div>
      </section>

      <section className="promo section--tight">
        <div className="wrap promo__grid">
          <div className="promo__copy">
            <p className="section__eyebrow">{site.promo.title}</p>
            <h2 className="section__title" style={{ color: "#f4f8f6" }}>
              {site.promo.subtitle}
            </h2>
            <p className="section__lead" style={{ color: "rgba(244,248,246,0.82)" }}>
              Современный лазерный уход с комфортной подготовкой и выгодными сетами
              зон. Подберём программу под вашу задачу.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn btn--light" type="button" onClick={openPopup}>
                Подробнее
              </button>
              <Link
                className="btn btn--ghost"
                href="/services/lazernaya_epilyaciya/glubokoe_bikini/"
              >
                К услугам
              </Link>
            </div>
          </div>
          <div className="promo__media">
            <img
              src="/redesign/promo-laser.jpg"
              alt="Лазерная эпиляция"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <Popup
        open={open}
        onClose={closePopup}
        id="new_popup"
        title={laserPopup.title}
      >
        <LaserPopupBody laserPopup={laserPopup} />
      </Popup>
    </>
  );
}

export function PromoLaser({
  laserPopup,
  showChip = true,
}: Props & { showChip?: boolean }) {
  const { open, openPopup, closePopup } = usePopup();

  if (!showChip) {
    return (
      <Popup open={open} onClose={closePopup} id="laser_popup" title={laserPopup.title}>
        <LaserPopupBody laserPopup={laserPopup} />
      </Popup>
    );
  }

  return (
    <>
      <section className="promo section--tight">
        <div className="wrap promo__grid">
          <div className="promo__copy">
            <p className="section__eyebrow">{site.promo.title}</p>
            <h2 className="section__title" style={{ color: "#f4f8f6" }}>
              {site.promo.subtitle}
            </h2>
            <button
              className="btn btn--light"
              type="button"
              onClick={openPopup}
              style={{ marginTop: "1.25rem" }}
            >
              Подробнее
            </button>
          </div>
          <div className="promo__media">
            <img
              src="/redesign/promo-laser.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
      <Popup open={open} onClose={closePopup} id="laser_popup" title={laserPopup.title}>
        <LaserPopupBody laserPopup={laserPopup} />
      </Popup>
    </>
  );
}

/** @deprecated use HomePromo */
export function Greeting(props: Props) {
  return <HomePromo {...props} />;
}
