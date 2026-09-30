import Link from "next/link";
import { HomePromo } from "@/components/PromoLaser";
import { SaleOffers } from "@/components/SaleOffers";
import { getAbonements, getHome, getSpecialists } from "@/lib/content";

export default function HomePage() {
  const home = getHome();
  const abonements = getAbonements();
  const specialists = getSpecialists();

  return (
    <main className="main">
      <HomePromo laserPopup={home.laserPopup} />
      <SaleOffers abonements={abonements} />

      <section className="description">
        <div className="description__img">
          <img
            src={home.aboutImage}
            className="description__images"
            alt="Студия Avedea"
            decoding="async"
          />
        </div>
        <div className="description__texts">
          {home.about.map((p, i) => (
            <p className="description__content" key={i}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <h2 className="master__title">Наши специалисты</h2>
      <section className="master">
        {specialists.map((spec) => (
          <div className="master__box" key={spec.slug}>
            <div className="master__content">
              <img
                className="master__img"
                src={spec.homeImage}
                alt={spec.shortName}
                loading="lazy"
                decoding="async"
              />
              <h2 className="master__name">
                {spec.shortName}
                {spec.posts.map((post) => (
                  <span key={post}>
                    <br />
                    <span className="master__post">{post}</span>
                  </span>
                ))}
              </h2>
              <Link href={`/specialists/${spec.slug}/`} className="master__link">
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
