import Link from "next/link";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__atmosphere" aria-hidden>
        <img src={asset("/redesign/gen/texture.jpg")} alt="" />
        <div className="not-found__veil" />
        <div className="not-found__glow" />
      </div>

      <div className="wrap not-found__inner">
        <p className="not-found__brand">{site.name}</p>
        <p className="not-found__code" aria-hidden>
          404
        </p>
        <h1 className="not-found__title">Страница не нашлась</h1>
        <p className="not-found__text">
          Возможно, услуга исчезла из записи или ссылка устарела. Вернитесь на
          главную или откройте актуальный каталог.
        </p>
        <div className="not-found__actions">
          <Link className="btn btn--primary" href="/">
            На главную
          </Link>
          <Link className="btn btn--outline" href="/services/">
            Каталог услуг
          </Link>
          <a
            className="btn btn--ghost"
            href={site.yclientsBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Записаться
          </a>
        </div>
      </div>
    </main>
  );
}
