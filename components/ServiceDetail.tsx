import Link from "next/link";
import type { Service } from "@/lib/content";
import { getServiceNeighbors } from "@/lib/content";

export function ServiceDetail({ service }: { service: Service }) {
  const { prev, next } = getServiceNeighbors(service);

  return (
    <section className="detail">
      <div className="wrap">
        <div className="detail__nav">
          <Link href="/services/">← Все услуги</Link>
          {prev ? (
            <Link href={`/services/${prev.category}/${prev.slug}/`}>
              ← {prev.title}
            </Link>
          ) : null}
          {next ? (
            <Link href={`/services/${next.category}/${next.slug}/`}>
              {next.title} →
            </Link>
          ) : null}
        </div>

        <div className="detail__grid">
          <div className="detail__media">
            <img
              src={service.image}
              alt={service.title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="detail__body">
            <h1 className="detail__title">{service.title}</h1>
            <div className="detail__meta-row">
              {service.duration ? (
                <p className="detail__time">{service.duration}</p>
              ) : null}
              {"priceLabel" in service && service.priceLabel ? (
                <p className="detail__price">{service.priceLabel}</p>
              ) : null}
            </div>
            {service.description?.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {service.listItems?.length ? (
              <ul>
                {service.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="detail__actions">
              <a
                className="btn btn--primary"
                href={service.yclientsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Записаться
              </a>
              <Link className="btn btn--outline" href="/services/">
                К каталогу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
