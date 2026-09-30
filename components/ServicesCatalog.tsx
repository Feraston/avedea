"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content";

type Group = {
  category: string;
  categoryTitle: string;
  items: Service[];
};

export function ServicesCatalog({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section className="services">
      <h2 className="services__title">Услуги</h2>
      <hr className="services__hr" />
      {groups.map((group) => {
        const isOpen = open[group.category] ?? false;
        return (
          <Fragment key={group.category}>
            <h3
              className={`services__category${isOpen ? " active" : ""}`}
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  [group.category]: !prev[group.category],
                }))
              }
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`services-panel-${group.category}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen((prev) => ({
                    ...prev,
                    [group.category]: !prev[group.category],
                  }));
                }
              }}
            >
              {group.categoryTitle}
            </h3>
            <div
              id={`services-panel-${group.category}`}
              className={`services__winclose${isOpen ? " services__winopen" : ""}`}
            >
              {group.items.map((service) => (
                <div className="services__service" key={service.slug}>
                  <img
                    className="services__img"
                    src={service.cardImage || service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <h4 className="services__service-name">{service.title}</h4>
                  {service.duration ? (
                    <div className="services__data">
                      <img
                        className="services__icon"
                        src="/blocks/services/file/time-left.png"
                        alt=""
                      />
                      <p className="services__money">Время: {service.duration}</p>
                    </div>
                  ) : null}
                  <Link
                    className="services__button"
                    href={`/services/${service.category}/${service.slug}/`}
                  >
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
