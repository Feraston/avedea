const buttonServiceMobile = document.querySelector(".header__menu-container");
const buttonServiceHeader = document.querySelector(".header__contacts");
const buttonServiceFooter = document.querySelector(".footer__links");
const mainSelection = document.querySelector(".main");

// Общая кнопка Заказа услуги в мобильных
function linkServisMobile() {
  const linkService = document.createElement("a");
  linkService.className = "header__menu-button";
  linkService.setAttribute(
    "href",
    "https://b182496.yclients.com/company/185262/record-type?o=s7743448"
  );
  linkService.innerHTML = "Запись онлайн";
  buttonServiceMobile.append(linkService);
}

// Общая кнопка Заказа услуги в десктоп
function linkServisHeader() {
  const linkService = document.createElement("a");
  linkService.className = "header__button";
  linkService.setAttribute(
    "href",
    "https://b182496.yclients.com/company/185262/record-type?o=s7743448"
  );
  linkService.innerHTML = "Запись онлайн";
  buttonServiceHeader.append(linkService);
}

// Общая кнопка Заказа услуги в футере
function linkServisFooter() {
  const linkService = document.createElement("a");
  linkService.className = "footer__button";
  linkService.setAttribute(
    "href",
    "https://b182496.yclients.com/company/185262/record-type?o=s7743448"
  );
  linkService.innerHTML = "Запись онлайн";
  buttonServiceFooter.append(linkService);
}

// Общий запуск
linkServisMobile();
linkServisHeader();
linkServisFooter();

// Общая шапка
function greeting() {
  const greetingBody = document.createElement("section");
  greetingBody.className = "greeting";
  mainSelection.prepend(greetingBody);

  const greetingGradOne = document.createElement("div");
  greetingGradOne.className = "greeting__grad-one";
  greetingBody.append(greetingGradOne);

  const greetingTitle = document.createElement("h1");
  greetingTitle.className = "greeting__title";
  greetingTitle.innerHTML = "Cтудия эстетической косметологии";
  greetingBody.append(greetingTitle);

  const greetingSubTitle = document.createElement("p");
  greetingSubTitle.className = "greating__subtitle";
  greetingSubTitle.innerHTML = "Осознанная забота о себе.";
  greetingBody.append(greetingSubTitle);

  const greetingNew = document.createElement("div");
  greetingNew.className = "greeting__new";
  greetingBody.append(greetingNew);

  const greetingNewTitle = document.createElement("div");
  greetingNewTitle.className = "greeting__new_title";
  greetingNewTitle.innerHTML = "Новинка";
  greetingNew.append(greetingNewTitle);

  const greetingNewSubTitle = document.createElement("div");
  greetingNewSubTitle.className = "greeting__new_subtitle";
  greetingNewSubTitle.innerHTML = "Лазерная эпиляция";
  greetingNew.append(greetingNewSubTitle);

  const greetingNewButton = document.createElement("button");
  greetingNewButton.className = "greeting__new_button";
  greetingNewButton.innerHTML = "ПОДРОБНЕЕ";
  greetingNew.append(greetingNewButton);

  const windowPopupZoomImg = document.querySelector("#new_popup");
  const popupList = document.querySelectorAll(".popup");

  function openPopup(window) {
    window.classList.add("popup_open");
  }
  
  function closePopup(window) {
    window.classList.remove("popup_open");
  }

  greetingNewButton.addEventListener("click", () => {
    openPopup(windowPopupZoomImg);
  });

  const priceNew = document.querySelector(".price__new_button");
  priceNew.addEventListener("click", () => {
    openPopup(windowPopupZoomImg);
  });

  popupList.forEach((popup) => {
    popup.addEventListener("mousedown", (event) => {
      if (
        event.target.classList.contains("popup__close") ||
        event.target === event.currentTarget
      ) {
        closePopup(popup);
      }
    });
  });

  const greetingGradTwo = document.createElement("div");
  greetingGradTwo.className = "greeting__grad-two";

  greetingBody.append(greetingGradTwo);
}

// Запуск шапки
greeting();

document.querySelector(".header__toggle").onclick = () => {
  document.querySelector(".header__menu").classList.toggle("menu_is-open");
  document
    .querySelector(".header__button")
    .classList.toggle("header__button-close");
};

// собираем все якоря; устанавливаем время анимации и количество кадров
const anchors = [].slice.call(document.querySelectorAll('a[href*="#adress"]')),
  animationTime = 700,
  framesCount = 20;

anchors.forEach(function (item) {
  // каждому якорю присваиваем обработчик события
  item.addEventListener("click", function (e) {
    // убираем стандартное поведение
    e.preventDefault();

    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY =
      document.querySelector(item.getAttribute("href")).getBoundingClientRect()
        .top + window.pageYOffset;

    // запускаем интервал, в котором
    let scroller = setInterval(function () {
      // считаем на сколько скроллить за 1 такт
      let scrollBy = coordY / framesCount;

      // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
      // и дно страницы не достигнуто
      if (
        scrollBy > window.pageYOffset - coordY &&
        window.innerHeight + window.pageYOffset < document.body.offsetHeight
      ) {
        // то скроллим на к-во пикселей, которое соответствует одному такту
        window.scrollBy(0, scrollBy);
      } else {
        // иначе добираемся до элемента и выходим из интервала
        window.scrollTo(0, coordY);
        clearInterval(scroller);
      }
      // время интервала равняется частному от времени анимации и к-ва кадров
    }, animationTime / framesCount);
  });
});

// Кнопка, которая открывает блок ниже в абонементе
const acc = document.getElementsByClassName("abonement__hidwin");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.classList.toggle("abonement__winopen");
    } else {
      panel.classList.toggle("abonement__winopen");
    }
  });
}

// Кнопка, которая открывает блок ниже в услугах
const uslug = document.getElementsByClassName("services__category");
for (let i = 0; i < uslug.length; i++) {
  uslug[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.classList.toggle("services__winopen");
    } else {
      panel.classList.toggle("services__winopen");
    }
  });
}

if (window.innerWidth >= 1024) {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
} else {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 20,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// ПОПАП
const cardImg = document.querySelectorAll(".image");
const windowPopupZoomImg = document.querySelector("#img-zoom");
const imgZoom = document.querySelector(".popup__zoom-photo");
const popupList = document.querySelectorAll(".popup");

function openPopup(window) {
  window.classList.add("popup_open");
}

function closePopup(window) {
  window.classList.remove("popup_open");
}

function popupPhotoZoom(link) {
  imgZoom.setAttribute("src", link);
  openPopup(windowPopupZoomImg);
}

cardImg.forEach((item) => {
  item.addEventListener("click", () => {
    popupPhotoZoom(item.src);
  });
});

popupList.forEach((popup) => {
  popup.addEventListener("mousedown", (event) => {
    if (
      event.target.classList.contains("popup__close") ||
      event.target === event.currentTarget
    ) {
      closePopup(popup);
    }
  });
});
