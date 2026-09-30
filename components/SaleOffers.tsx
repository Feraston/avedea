"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { Abonement } from "@/lib/content";
import { getSeasonalOffersTitle } from "@/lib/season";

const OFFER_IMAGES = [
  "/redesign/offer-1.jpg",
  "/redesign/offer-2.jpg",
  "/redesign/offer-3.jpg",
];

export function SaleOffers({ abonements }: { abonements: Abonement[] }) {
  const [title, setTitle] = useState(getSeasonalOffersTitle);

  useEffect(() => {
    setTitle(getSeasonalOffersTitle());
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <p className="section__eyebrow">Абонементы</p>
          <h2 className="section__title" suppressHydrationWarning>
            {title}
          </h2>
          <p className="section__lead">
            Курсы процедур с выгодой и подарками — спокойный темп заботы о коже и теле.
          </p>
        </Reveal>
        <div className="offers__grid">
          {abonements.map((abon, i) => (
            <Reveal key={abon.slug} delay={i * 80}>
              <Link className="offer" href={`/abon/${abon.slug}/`}>
                <div className="offer__media">
                  <img
                    src={OFFER_IMAGES[i] || abon.cardImage}
                    alt={abon.preview.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="offer__body">
                  <p className="offer__label">Абонемент</p>
                  <h3 className="offer__title">{abon.preview.name}</h3>
                  <p className="offer__meta">{abon.preview.cost}</p>
                  <p className="offer__meta">{abon.preview.includes}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
