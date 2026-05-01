 var swiper = new Swiper(".mySwiper", {
     effect: "coverflow",
     grabCursor: true,
     centeredSlides: true,
     slidesPerView: "auto",
     autoplay: {
         delay: 2500,
         disableOnInteraction: false,
     },
     loop: true,
     coverflowEffect: {
         rotate: 50,
         stretch: 0,
         depth: 100,
         modifier: 1,
         slideShadows: false,
     },
     pagination: {
         el: ".swiper-pagination",
         clickable: true,

     },
 });
 var swiper = new Swiper(".mySwiper1", {
     slidesPerView: 3,
     spaceBetween: 30,

     pagination: {
         el: ".swiper-pagination",
         clickable: true,
     },
 });

 var swiper = new Swiper(".mySwiper2", {
     direction: "vertical",
     autoplay: {
         delay: 3000,
         disableOnInteraction: false,
     },
     loop: true,
     pagination: {
         el: ".swiper-pagination",
         clickable: true,
     },
 });