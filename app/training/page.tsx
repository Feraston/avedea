import { Fragment } from "react";
import type { Metadata } from "next";
import { PromoLaser } from "@/components/PromoLaser";
import { getHome, getTraining } from "@/lib/content";

export const metadata: Metadata = {
  title: "Обучение",
  description: "Обучение и семинары PHYT'S в студии Avedea, Краснодар.",
  alternates: { canonical: "/training/" },
};

export default function TrainingPage() {
  const seminars = getTraining();
  const home = getHome();

  return (
    <main className="main">
      <PromoLaser laserPopup={home.laserPopup} />
      <section className="training">
        <h2 className="training__title">Обучение и семинары</h2>
        <hr className="training__hr" />
        {seminars.map((seminar) => (
          <Fragment key={seminar.slug}>
            <h3 className="training__name">{seminar.title}</h3>
            <hr className="training__hr" />
            {seminar.image ? (
              <img
                className="training__img"
                src={seminar.image}
                alt={seminar.title}
              />
            ) : null}
            <div className="training__main">
              {seminar.paragraphs.map((p, i) => (
                <p className="training__content" key={i}>
                  {p.text}
                </p>
              ))}
            </div>
            <a
              className="training__button"
              href={seminar.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Записаться
            </a>
          </Fragment>
        ))}
      </section>
    </main>
  );
}
