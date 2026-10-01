"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import type { Specialist } from "@/lib/content";

const CTA_BY_SLUG: Record<string, string> = {
  "elena-sorokina": "Записаться к Елене",
  "viktoria-priemskaya": "Записаться к Виктории",
};

export function SpecialistDetail({ specialist }: { specialist: Specialist }) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  return (
    <section className="detail">
      <div className="wrap">
        <div className="spec-hero">
          <div className="spec-hero__photo">
            <img
              src={asset(specialist.image)}
              alt={specialist.shortName}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="detail__body">
            <h1 className="detail__title">{specialist.title}</h1>
            <p className="section__lead" style={{ marginTop: 0 }}>
              {specialist.posts.join(" · ")}
            </p>
            {specialist.body.map((block, i) => {
              if (block.type === "heading") {
                return <h3 key={`h-${i}`}>{block.text ?? ""}</h3>;
              }
              return (
                <ul key={`l-${i}`}>
                  {(block.items ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            })}
            <div className="detail__actions">
              <a
                className="btn btn--primary"
                href={specialist.yclientsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CTA_BY_SLUG[specialist.slug] || "Записаться"}
              </a>
            </div>
          </div>
        </div>

        {specialist.certificates.length ? (
          <div className="spec-certs">
            <h2 className="section__title" style={{ fontSize: "1.8rem" }}>
              Сертификаты и дипломы
            </h2>
            <div className="spec-certs__grid" style={{ marginTop: "1.25rem" }}>
              {specialist.certificates.map((cert) => (
                <button
                  key={cert.src}
                  type="button"
                  onClick={() => setZoomSrc(asset(cert.src))}
                  aria-label={`Открыть ${cert.alt}`}
                >
                  <img src={asset(cert.src)} alt={cert.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {zoomSrc ? (
        <div
          className="popup-zoom"
          role="dialog"
          aria-modal="true"
          aria-label="Сертификат"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setZoomSrc(null);
          }}
        >
          <button
            className="popup-dialog__close"
            type="button"
            style={{ position: "fixed", top: "1rem", right: "1rem" }}
            onClick={() => setZoomSrc(null)}
            aria-label="Закрыть"
          >
            ✕
          </button>
          <img src={zoomSrc} alt="Сертификат" />
        </div>
      ) : null}
    </section>
  );
}
