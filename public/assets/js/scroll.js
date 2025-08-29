const slides = document.querySelector('.slides');
const buttons = document.querySelectorAll('.manual-btn');
const totalSlides = buttons.length;
let currentIndex = 0;
let autoplayTimer = null;
let idleTime = 5000; 

function showSlide(index) {
  slides.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
  currentIndex = index;
}


function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }, 5000); 
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

// Botões de navegação manual
buttons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    showSlide(i);
    stopAutoplay();
    // reinicia autoplay após idleTime sem interação
    setTimeout(startAutoplay, idleTime);
  });
});

// inicia autoplay após idleTime inicial
setTimeout(startAutoplay, idleTime);
