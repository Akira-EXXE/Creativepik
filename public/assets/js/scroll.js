// Garantir que o script só rode quando o HTML estiver completamente carregado
window.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     SLIDER / CARROSSEL
  ========================================== */

  const slides = document.querySelector('.slides');
  const buttons = document.querySelectorAll('.manual-btn');
  const totalSlides = buttons.length;

  let currentIndex = 0;
  let autoplayTimer = null;
  let idleTime = 5000; // tempo sem interação antes de retomar autoplay

  // Função para mudar o slide
  function showSlide(index) {
    if (!slides) return; // evita erro se .slides não existir
    slides.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
    currentIndex = index;
  }

  // Inicia autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      showSlide(currentIndex);
    }, 5000);
  }

  // Para autoplay
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Botões manuais do slide
  if (buttons.length > 0) {
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        showSlide(i);
        stopAutoplay();
        setTimeout(startAutoplay, idleTime);
      });
    });

    // Inicia autoplay após tempo inicial
    setTimeout(startAutoplay, idleTime);
  }

  /* ==========================================
     GALERIA ESTILO PINTEREST (MASONRY)
  ========================================== */

  const gallery = document.querySelector('.pinterest-gallery');
  const pins = document.querySelectorAll('.pin');

  function resizeMasonry() {
    pins.forEach(pin => {
      pin.style.breakInside = 'avoid'; // evita que as imagens quebrem feio
    });
  }

  if (gallery) {
    resizeMasonry();
    window.addEventListener('resize', resizeMasonry);
  }

});
