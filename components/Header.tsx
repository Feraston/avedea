"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <header className="header" id="header">
      <section className={`header__menu${menuOpen ? " menu_is-open" : ""}`}>
        <button
          type="button"
          className="header__toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          <img
            className="header__toggle-image"
            src="/blocks/header/file/menu.png"
            alt=""
          />
        </button>
        <div className="header__menu-container" id="mobile-nav">
          <img
            className="header__menu-logo"
            src="/blocks/header/file/logo.svg"
            alt="Avedea"
          />
          <nav className="header__menu-nav" aria-label="Мобильная навигация">
            <ul className="header__menu-body">
              <li className="header__menu-item animation">
                <Link
                  className="header__menu-link"
                  href="/"
                  onClick={() => setMenuOpen(false)}
                >
                  НА ГЛАВНУЮ
                </Link>
              </li>
              <li className="header__menu-item animation">
                <Link
                  className="header__menu-link"
                  href="/services/"
                  onClick={() => setMenuOpen(false)}
                >
                  УСЛУГИ
                </Link>
              </li>
              <li className="header__menu-item animation">
                <Link
                  className="header__menu-link"
                  href="/training/"
                  onClick={() => setMenuOpen(false)}
                >
                  ОБУЧЕНИЕ
                </Link>
              </li>
            </ul>
          </nav>
          <a
            className="header__menu-button"
            href={site.yclientsBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Запись онлайн
          </a>
        </div>
      </section>
      <Link className="logo" href="/">
        <img className="logo" src="/blocks/header/file/logo.svg" alt="Avedea" />
      </Link>
      <nav className="header__nav" aria-label="Основная навигация">
        <ul className="header__nav-body">
          <li className="header__nav-item animation">
            <Link className="header__nav-link" href="/services/">
              Услуги
            </Link>
          </li>
          <li className="header__nav-item animation">
            <Link className="header__nav-link" href="/training/">
              Обучение
            </Link>
          </li>
        </ul>
      </nav>
      <div className="header__contacts">
        <a href="#adress" className="header__adress">
          {site.addressShort.replace("Куникова, ", "Куникова,\u00a0")}
        </a>
        <a className="header__tel" href={`tel:${site.phone}`}>
          <img
            className="header__tel-img"
            src="/blocks/header/file/tel.svg"
            alt=""
          />
          <span className="header__tel-text">{site.phoneDisplay}</span>
        </a>
        <a
          className={`header__button${menuOpen ? " header__button-close" : ""}`}
          href={site.yclientsBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Запись онлайн
        </a>
      </div>
    </header>
  );
}
