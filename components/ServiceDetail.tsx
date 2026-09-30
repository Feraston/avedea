import Link from "next/link";
import type { Service } from "@/lib/content";
import { getServiceNeighbors } from "@/lib/content";

export function ServiceDetail({ service }: { service: Service }) {
  const { prev, next } = getServiceNeighbors(service);

  return (
    <section className="uslugi">
      <div className="uslugi__navig">
        <Link className="uslugi__navig-prev" href="/services/">
          ← Все услуги
        </Link>
      </div>
      <div className="uslugi__navig-categ">
        {prev ? (
          <Link
            className="uslugi__navig-button"
            href={`/services/${prev.category}/${prev.slug}/`}
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="uslugi__navig-button"
            href={`/services/${next.category}/${next.slug}/`}
          >
            {next.title} →
          </Link>
        ) : null}
      </div>
      <h2 className="uslugi__title">{service.title}</h2>
      <div className="uslugi__contents">
        <div className="uslugi__img">
          <img
            src={service.image}
            className="uslugi__images"
            alt={service.title}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="uslugi__toc">
          {service.duration ? (
            <div className="uslugi__data-main">
              <div className="uslugi__data">
                <img
                  className="uslugi__icon"
                  src="/blocks/services/file/time-left.png"
                  alt=""
                />
                <p className="uslugi__montime">Время: {service.duration}</p>
              </div>
            </div>
          ) : null}
          {service.description?.map((p) => (
            <p className="uslugi__content" key={p.slice(0, 40)}>
              {p}
            </p>
          ))}
          {service.listItems?.length ? (
            <ul className="uslugi__list">
              {service.listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <a
            className="uslugi__button"
            href={service.yclientsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Записаться
          </a>
        </div>
      </div>
    </section>
  );
}
