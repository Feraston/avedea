document.querySelector('.header__toggle').onclick = () => {
  document.querySelector('.header__menu').classList.toggle('menu_is-open');
  document.querySelector('.header__button').classList.toggle('header__button-close');
}

// собираем все якоря; устанавливаем время анимации и количество кадров
const anchors = [].slice.call(document.querySelectorAll('a[href*="#adress"]')),
      animationTime = 700,
      framesCount = 20;

anchors.forEach(function(item) {
  // каждому якорю присваиваем обработчик события
  item.addEventListener('click', function(e) {
    // убираем стандартное поведение
    e.preventDefault();
    
    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
    
    // запускаем интервал, в котором
    let scroller = setInterval(function() {
      // считаем на сколько скроллить за 1 такт
      let scrollBy = coordY / framesCount;
      
      // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
      // и дно страницы не достигнуто
      if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
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
  acc[i].addEventListener("click", function() {
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
  uslug[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.classList.toggle("services__winopen");
    } else {
      panel.classList.toggle("services__winopen");
    }
  });
}

if(window.innerWidth >= 1024){
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
const cardImg = document.querySelectorAll('.image');
const windowPopupZoomImg = document.querySelector('#img-zoom');
const imgZoom = document.querySelector('.popup__zoom-photo');
const popupList = document.querySelectorAll('.popup');

function openPopup(window) {
  window.classList.add('popup_open');
}

function closePopup(window) {
  window.classList.remove('popup_open');
}


function popupPhotoZoom(link) {
  imgZoom.setAttribute('src', link);
  openPopup(windowPopupZoomImg);
}

cardImg.forEach((item) => {
  item.addEventListener('click', ()=>{
    popupPhotoZoom(item.src);
  });
})

popupList.forEach((popup) => {
  popup.addEventListener('mousedown', (event)=> {
    if(event.target.classList.contains('popup__close') || event.target === event.currentTarget) {
      closePopup(popup)
    }
  });
});