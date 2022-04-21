document.querySelector('.menu__toggle').onclick = () => {
  document.querySelector('.menu').classList.toggle('menu_is-open');
  document.querySelector('.header__button').classList.toggle('header__button-close');
}

$(document).ready(function(){
  
  $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
          $('.scrollup').fadeIn();
      } else {
          $('.scrollup').fadeOut();
      }
      });
        
      $('.scrollup').click(function(){
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
  });

});