"use client";

import { useState } from "react";
import type { Abonement } from "@/lib/content";

export function AbonementDetail({ abonement }: { abonement: Abonement }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <section className="abonement">
      <h2 className="abonement__title">{abonement.title}</h2>
      <div className="abonement__contents">
        <div className="abonement__img">
          <img
            src={abonement.image}
            className="abonement__images"
            alt={abonement.title}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="abonement__toc">
          {abonement.summary.map((p) => (
            <p className="abonement__content" key={p.slice(0, 48)}>
              {p}
            </p>
          ))}
          {abonement.sections.map((section, index) => (
            <div key={section.label}>
              <button
                className={`abonement__hidwin${open[index] ? " active" : ""}`}
                type="button"
                onClick={() =>
                  setOpen((prev) => ({ ...prev, [index]: !prev[index] }))
                }
              >
                {section.label}
              </button>
              <div
                className={`abonement__winclose${open[index] ? " abonement__winopen" : ""}`}
              >
                {section.paragraphs.map((p) => (
                  <p className="abonement__content" key={p.slice(0, 40)}>
                    {p}
                  </p>
                ))}
                {section.lists.map((list, li) => (
                  <ul className="abonement__list" key={li}>
                    {list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
          <a
            className="abonement__button-abon"
            href={abonement.yclientsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Приобрести абонемент
          </a>
        </div>
      </div>
    </section>
  );
}
