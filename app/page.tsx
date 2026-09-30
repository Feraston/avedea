import Link from "next/link";
import { HomePromo } from "@/components/PromoLaser";
import { Reveal } from "@/components/Reveal";
import { SaleOffers } from "@/components/SaleOffers";
import { getCategoryCover } from "@/data/categories";
import {
  getAbonements,
  getHome,
  getServicesByCategory,
  getSpecialists,
} from "@/lib/content";
import { formatCategoryTitle, formatProcedureCount } from "@/lib/format";

export default function HomePage() {
  const home = getHome();
  const abonements = getAbonements();
  const specialists = getSpecialists();
  const groups = getServicesByCategory();

  return (
    <main>
      <HomePromo laserPopup={home.laserPopup} />
      <SaleOffers abonements={abonements} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <p className="section__eyebrow">Направления</p>
            <h2 className="section__title">Что мы делаем</h2>
            <p className="section__lead">
              От уходов PHYT&apos;S и массажа до лазерной эпиляции — выберите
              направление и найдите свою процедуру.
            </p>
          </Reveal>
          <div className="cats__grid">
            {groups.map((group, i) => (
              <Reveal key={group.category} delay={(i % 3) * 70}>
                <Link
                  className="cat-tile"
                  href={`/services/#${group.category}`}
                >
                  <img
                    src={getCategoryCover(group.category)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cat-tile__label">
                    <h3 className="cat-tile__name">
                      {formatCategoryTitle(group.category, group.categoryTitle)}
                    </h3>
                    <p className="cat-tile__count">
                      {formatProcedureCount(group.items.length)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "1.75rem" }}>
            <Link className="btn btn--outline" href="/services/">
              Весь каталог услуг
            </Link>
          </div>
        </div>
      </section>

      <section className="section about">
        <div className="wrap about__grid">
          <Reveal>
            <div className="about__media">
              <img
                src="/redesign/about.jpg"
                alt="Студия Avedea"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="about__text">
              <p className="section__eyebrow">О студии</p>
              <h2 className="section__title">Avedea</h2>
              {home.about.slice(0, 4).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <p className="section__eyebrow">Команда</p>
            <h2 className="section__title">Наши специалисты</h2>
          </Reveal>
          <div className="specs__grid">
            {specialists.map((spec, i) => (
              <Reveal key={spec.slug} delay={i * 90}>
                <Link className="spec-card" href={`/specialists/${spec.slug}/`}>
                  <div className="spec-card__media">
                    <img
                      src={spec.homeImage}
                      alt={spec.shortName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="spec-card__body">
                    <h3 className="spec-card__name">{spec.shortName}</h3>
                    <p className="spec-card__posts">{spec.posts.join(" · ")}</p>
                    <span className="spec-card__cta">Подробнее →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
