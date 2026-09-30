"use client";

import { useEffect, useRef, useState } from "react";
import type { Specialist } from "@/lib/content";

const CTA_BY_SLUG: Record<string, string> = {
  "elena-sorokina": "Записаться к Елене",
  "viktoria-priemskaya": "Записаться к Виктории",
};

export function SpecialistDetail({ specialist }: { specialist: Specialist }) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiper: { destroy: () => void } | null = null;
    let cancelled = false;

    async function init() {
      if (!specialist.certificates.length || !swiperRef.current) return;
      const { default: Swiper } = await import("swiper");
      const { Navigation, Pagination } = await import("swiper/modules");
      await import("swiper/css");
      await import("swiper/css/navigation");
      await import("swiper/css/pagination");
      if (cancelled || !swiperRef.current) return;
      swiper = new Swiper(swiperRef.current, {
        modules: [Navigation, Pagination],
        slidesPerView: window.innerWidth >= 1024 ? 4 : 2,
        spaceBetween: window.innerWidth >= 1024 ? 30 : 20,
        centeredSlides: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    }

    init();
    return () => {
      cancelled = true;
      swiper?.destroy();
    };
  }, [specialist.certificates.length]);

  return (
    <section className="specialist">
      <h2 className="specialist__title">{specialist.title}</h2>
      <div className="specialist__main">
        <img
          className="specialist__img"
          src={specialist.image}
          alt={specialist.shortName}
          loading="lazy"
          decoding="async"
        />
        <div className="specialist__body">
          {specialist.body.map((block, i) => {
            if (block.type === "heading") {
              return (
                <p className="specialist__content" key={`h-${i}`}>
                  {block.text ?? ""}
                </p>
              );
            }
            return (
              <ul className="specialist__list" key={`l-${i}`}>
                {(block.items ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })}
          <a
            className="specialist__button"
            href={specialist.yclientsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CTA_BY_SLUG[specialist.slug] || "Записаться"}
          </a>
        </div>
      </div>
      {specialist.certificates.length ? (
        <>
          <h3 className="specialist__title">Сертификаты и дипломы</h3>
          <div className="swiper mySwiper" ref={swiperRef}>
            <div className="swiper-wrapper">
              {specialist.certificates.map((cert) => (
                <div className="swiper-slide" key={cert.src}>
                  <img
                    src={cert.src}
                    className="image"
                    alt={cert.alt}
                    onClick={() => setZoomSrc(cert.src)}
                  />
                </div>
              ))}
            </div>
            <div className="swiper-button-next" />
            <div className="swiper-button-prev" />
            <div className="swiper-pagination" />
          </div>
        </>
      ) : null}

      {zoomSrc ? (
        <section
          className="popup popup_open"
          id="img-zoom"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setZoomSrc(null);
          }}
        >
          <div className="popup__zoom">
            <button
              className="popup__button-close"
              type="button"
              onClick={() => setZoomSrc(null)}
            >
              <img
                src="/blocks/popup/file/Close.svg"
                alt="Закрыть"
                className="popup__close"
              />
            </button>
            <img src={zoomSrc} className="popup__zoom-photo" alt="Сертификат" />
          </div>
        </section>
      ) : null}
    </section>
  );
}
