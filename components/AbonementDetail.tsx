"use client";

import { useState } from "react";
import type { Abonement } from "@/lib/content";

export function AbonementDetail({ abonement }: { abonement: Abonement }) {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  return (
    <section className="detail">
      <div className="wrap">
        <div className="detail__grid">
          <div className="detail__media">
            <img
              src={abonement.image}
              alt={abonement.title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="detail__body">
            <h1 className="detail__title">{abonement.title}</h1>
            {abonement.summary.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}

            <div className="acc">
              {abonement.sections.map((section, index) => (
                <div key={section.label}>
                  <button
                    className="acc__btn"
                    type="button"
                    aria-expanded={!!open[index]}
                    onClick={() =>
                      setOpen((prev) => ({ ...prev, [index]: !prev[index] }))
                    }
                  >
                    <span>{section.label}</span>
                    <span aria-hidden>{open[index] ? "−" : "+"}</span>
                  </button>
                  <div
                    className={`acc__panel${open[index] ? " is-open" : ""}`}
                  >
                    <div className="acc__panel-inner">
                      {section.paragraphs.map((p) => (
                        <p key={p.slice(0, 40)}>{p}</p>
                      ))}
                      {section.lists.map((list, li) => (
                        <ul key={li}>
                          {list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="detail__actions">
              <a
                className="btn btn--primary"
                href={abonement.yclientsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Приобрести абонемент
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
