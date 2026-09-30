"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Abonement } from "@/lib/content";
import { getSeasonalOffersTitle } from "@/lib/season";

export function SaleOffers({ abonements }: { abonements: Abonement[] }) {
  const [title, setTitle] = useState(getSeasonalOffersTitle);

  useEffect(() => {
    setTitle(getSeasonalOffersTitle());
  }, []);

  return (
    <section className="sale">
      <h3 className="sale__title" suppressHydrationWarning>
        {title}
      </h3>
      <div className="sale__content offer-grid">
        {abonements.map((abon) => (
          <article className="offer-card" key={abon.slug}>
            <div className="offer-card__media">
              <img
                src={abon.cardImage}
                className="offer-card__img"
                alt={abon.preview.name}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="offer-card__body">
              <h2 className="offer-card__title">
                <Link href={`/abon/${abon.slug}/`} className="offer-card__link">
                  {abon.preview.name}
                </Link>
              </h2>
              <p className="offer-card__label">Абонемент</p>
              <div className="offer-card__details">
                <div className="offer-card__details-inner">
                  <p className="offer-card__row">
                    <span className="offer-card__key">Стоимость:</span>{" "}
                    <span className="offer-card__value">{abon.preview.cost}</span>
                  </p>
                  <p className="offer-card__row">
                    <span className="offer-card__key">Что входит:</span>{" "}
                    <span className="offer-card__value">
                      {abon.preview.includes}
                    </span>
                  </p>
                  <p className="offer-card__row">
                    <span className="offer-card__key">Подарок:</span>{" "}
                    <span className="offer-card__value">{abon.preview.gift}</span>
                  </p>
                  <Link href={`/abon/${abon.slug}/`} className="offer-card__btn">
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
