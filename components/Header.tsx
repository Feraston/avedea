"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`site-header${solid || menuOpen ? " is-solid" : ""}${overHero ? " is-over-hero" : ""}`}
      >
        <div className="site-header__inner">
          <Link className="site-brand" href="/" onClick={close}>
            <img
              className="site-brand__mark"
              src="/blocks/header/file/logo.svg"
              alt=""
            />
            <span className="site-brand__name">{site.name}</span>
          </Link>

          <nav className="site-nav" aria-label="Основная навигация">
            <Link href="/services/">Услуги</Link>
            <Link href="/training/">Обучение</Link>
            <a href="#contacts">Контакты</a>
          </nav>

          <div className="site-header__actions">
            <a className="site-header__phone" href={`tel:${site.phone}`}>
              {site.phoneDisplay}
            </a>
            <a
              className="btn btn--primary site-header__book"
              href={site.yclientsBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Запись
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="menu-toggle__bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        id="mobile-nav"
        hidden={!menuOpen}
      >
        <nav aria-label="Мобильная навигация">
          <ul className="mobile-nav__links">
            <li>
              <Link href="/" onClick={close}>
                Главная
              </Link>
            </li>
            <li>
              <Link href="/services/" onClick={close}>
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/training/" onClick={close}>
                Обучение
              </Link>
            </li>
            <li>
              <a href="#contacts" onClick={close}>
                Контакты
              </a>
            </li>
          </ul>
        </nav>
        <div className="mobile-nav__meta">
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          <p>{site.addressShort}</p>
          <a
            className="btn btn--light"
            href={site.yclientsBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            Запись онлайн
          </a>
        </div>
      </div>
    </>
  );
}
