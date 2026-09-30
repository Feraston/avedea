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
    <div className="popup__new_body">
      <h2 className="popup__new_title">{laserPopup.title}</h2>
      <p className="popup__content">{laserPopup.prepTitle}</p>
      <ul className="popup__list">
        {laserPopup.prepItems.map((item) => (
          <li key={item} className="popup__list_cards popup__list_card_content">
            <div className="popup__list_card">
              <div className="popup__card_content_two">{item}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="popup__content">{laserPopup.setsTitle}</p>
      <ul className="popup__list">
        {laserPopup.sets.map((item) => (
          <li key={item} className="popup__list_cards">
            <div className="popup__list_card">
              <div className="popup__card_content">{item}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="popup__content">{laserPopup.zonesTitle}</p>
      <ul className="popup__list">
        {laserPopup.zones.map((item) => (
          <li key={item} className="popup__list_cards">
            <div className="popup__list_card">
              <div className="popup__card_content">{item}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="popup__content">
        Подробности и запись — в разделе{" "}
        <Link href="/services/lazernaya_epilyaciya/glubokoe_bikini/">услуг</Link>.
      </p>
    </div>
  );
}

/** Hero + mobile promo chip sharing one laser popup instance. */
export function HomePromo({ laserPopup }: Props) {
  const { open, openPopup, closePopup } = usePopup();

  return (
    <>
      <section className="greeting">
        <div className="greeting__grad-one" />
        <h1 className="greeting__title">{site.heroTitle}</h1>
        <p className="greating__subtitle">{site.tagline}</p>
        <div className="greeting__new">
          <div className="greeting__new_title">{site.promo.title}</div>
          <div className="greeting__new_subtitle">{site.promo.subtitle}</div>
          <button
            className="greeting__new_button"
            type="button"
            onClick={openPopup}
          >
            ПОДРОБНЕЕ
          </button>
        </div>
        <div className="greeting__grad-two" />
      </section>

      <div className="price__new">
        <div className="price__new_title">{site.promo.title}</div>
        <div className="price__new_subtitle">{site.promo.subtitle}</div>
        <button className="price__new_button" type="button" onClick={openPopup}>
          ПОДРОБНЕЕ
        </button>
      </div>

      <Popup open={open} onClose={closePopup} id="new_popup" title={laserPopup.title}>
        <LaserPopupBody laserPopup={laserPopup} />
      </Popup>
    </>
  );
}

/** Re-export for training/services pages that only need the mobile chip + popup. */
export function PromoLaser({
  laserPopup,
  showChip = true,
}: Props & { showChip?: boolean }) {
  const { open, openPopup, closePopup } = usePopup();

  return (
    <>
      {showChip ? (
        <div className="price__new">
          <div className="price__new_title">{site.promo.title}</div>
          <div className="price__new_subtitle">{site.promo.subtitle}</div>
          <button
            className="price__new_button"
            type="button"
            onClick={openPopup}
          >
            ПОДРОБНЕЕ
          </button>
        </div>
      ) : null}
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
