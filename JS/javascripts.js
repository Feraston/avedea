document.querySelector('.menu__toggle').onclick = () => {
  document.querySelector('.menu').classList.toggle('menu_is-open');
  document.querySelector('.header__button').classList.toggle('header__button-close');
}

