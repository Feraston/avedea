"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { Abonement } from "@/lib/content";
import { getSeasonalOffersTitle } from "@/lib/season";

const OFFER_IMAGES = [
  "/redesign/soft/abon-1.jpg",
  "/redesign/soft/abon-2.jpg",
  "/redesign/soft/abon-3.jpg",
];

export type GiftOffer = {
  slug: string;
  title: string;
  eyebrow: string;
  lead: string;
  cta: string;
  href: string;
  image: string;
};

export function SaleOffers({
  abonements,
  gifts = [],
}: {
  abonements: Abonement[];
  gifts?: GiftOffer[];
}) {
  const [title, setTitle] = useState(getSeasonalOffersTitle);

  useEffect(() => {
    setTitle(getSeasonalOffersTitle());
  }, []);

  return (
    <section className="section" id="offers">
      <div className="wrap">
        <Reveal>
          <p className="section__eyebrow">Предложения</p>
          <h2 className="section__title" suppressHydrationWarning>
            {title}
          </h2>
          <p className="section__lead">
            Абонементы с выгодой, подарочные сертификаты и готовые идеи — чтобы
            забота о себе (или о близком человеке) начиналась легко.
          </p>
        </Reveal>

        {gifts.length ? (
          <div className="gifts">
            <Reveal>
              <p className="gifts__eyebrow">Сертификаты и подарки</p>
            </Reveal>
            <div className="gifts__grid">
              {gifts.map((gift, i) => {
                const external = /^https?:\/\//.test(gift.href);
                const hashOnly =
                  gift.href.startsWith("#") ||
                  /^\/?#.+/.test(gift.href);
                const hashHref = hashOnly
                  ? `#${gift.href.replace(/^\/?#/, "")}`
                  : gift.href;
                const className = `gift gift--${(i % 3) + 1}`;
                const inner = (
                  <>
                    <div className="gift__glow" aria-hidden />
                    <div className="gift__media">
                      <img
                        src={gift.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="gift__body">
                      <p className="gift__label">{gift.eyebrow}</p>
                      <h3 className="gift__title">{gift.title}</h3>
                      <p className="gift__lead">{gift.lead}</p>
                      <span className="gift__cta">{gift.cta}</span>
                    </div>
                  </>
                );
                return (
                  <Reveal key={gift.slug} delay={i * 70}>
                    {external || hashOnly ? (
                      <a
                        className={className}
                        href={hashOnly ? hashHref : gift.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link className={className} href={gift.href}>
                        {inner}
                      </Link>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="offers__grid" id="abonements">
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
