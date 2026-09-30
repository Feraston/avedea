"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryCover } from "@/data/categories";
import type { Service } from "@/lib/content";
import { formatCategoryTitle, formatServiceCount } from "@/lib/format";

type Group = {
  category: string;
  categoryTitle: string;
  items: Service[];
};

export function ServicesCatalog({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const first = groups[0]?.category;
    return first ? { [first]: true } : {};
  });

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    if (!groups.some((g) => g.category === hash)) return;
    setOpen((prev) => ({ ...prev, [hash]: true }));
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [groups]);

  return (
    <section className="section">
      <div className="wrap">
        <p className="section__eyebrow">Каталог</p>
        <h2 className="section__title">Услуги студии</h2>
        <p className="section__lead">
          Выберите направление — внутри каждая процедура с описанием и записью онлайн.
        </p>

        <div className="svc-list" style={{ marginTop: "2rem" }}>
          {groups.map((group) => {
            const isOpen = open[group.category] ?? false;
            const cover = getCategoryCover(group.category);
            return (
              <div className="svc-group" key={group.category} id={group.category}>
                <button
                  type="button"
                  className="svc-group__head"
                  aria-expanded={isOpen}
                  aria-controls={`services-panel-${group.category}`}
                  onClick={() =>
                    setOpen((prev) => ({
                      ...prev,
                      [group.category]: !prev[group.category],
                    }))
                  }
                >
                  <img
                    className="svc-group__thumb"
                    src={cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h3 className="svc-group__title">
                      {formatCategoryTitle(group.category, group.categoryTitle)}
                    </h3>
                    <p className="svc-group__meta">
                      {formatServiceCount(group.items.length)}
                    </p>
                  </div>
                  <span className="svc-group__chev" aria-hidden>
                    ▾
                  </span>
                </button>
                <div
                  id={`services-panel-${group.category}`}
                  className={`svc-group__panel${isOpen ? " is-open" : ""}`}
                >
                  <div className="svc-group__panel-inner">
                    <div className="svc-items">
                      {group.items.map((service) => (
                        <Link
                          key={service.slug}
                          className="svc-item"
                          href={`/services/${service.category}/${service.slug}/`}
                        >
                          <img
                            src={service.cardImage || service.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <p className="svc-item__name">{service.title}</p>
                            <p className="svc-item__time">
                              {[
                                service.duration,
                                "priceLabel" in service ? service.priceLabel : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
