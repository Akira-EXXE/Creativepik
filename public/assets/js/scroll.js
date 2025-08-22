const slides = document.querySelector('.slides');
const buttons = document.querySelectorAll('.manual-btn');
const totalSlides = buttons.length;
let currentIndex = 0;
let autoplayTimer = null;
let idleTime = 3000; // 3 segundos sem interação para começar autoplay

// Função para mostrar slide
function showSlide(index) {
  slides.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
  currentIndex = index;
}

// Função de autoplay
function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }, 2000); // muda a cada 2s
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
