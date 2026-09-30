import type { Metadata } from "next";
import { getTraining } from "@/lib/content";

export const metadata: Metadata = {
  title: "Обучение",
  description: "Обучение и семинары PHYT'S в студии Avedea, Краснодар.",
  alternates: { canonical: "/training/" },
};

export default function TrainingPage() {
  const seminars = getTraining();

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__media" aria-hidden>
          <img src="/redesign/gen/banner.jpg" alt="" />
          <div className="page-hero__shade" />
        </div>
        <div className="page-hero__content">
          <h1 className="page-hero__title">Обучение</h1>
          <p className="page-hero__text">
            Семинары и программы PHYT&apos;S для специалистов, которые хотят
            глубже понимать натуральный уход.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {seminars.map((seminar) => (
            <article className="train-card" key={seminar.slug}>
              {seminar.image ? (
                <img
                  src={seminar.image}
                  alt={seminar.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <img
                  src="/redesign/training.jpg"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div>
                <h2 className="train-card__title">{seminar.title}</h2>
                {seminar.paragraphs.map((p, i) => (
                  <p key={i} style={{ color: "var(--ink-soft)" }}>
                    {p.text}
                  </p>
                ))}
                <a
                  className="btn btn--primary"
                  href={seminar.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: "1rem" }}
                >
                  Записаться
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
