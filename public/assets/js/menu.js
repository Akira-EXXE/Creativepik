document.addEventListener('DOMContentLoaded', () => {
  const menuDefault = document.getElementById('menu_defalt');
  const menuLogado = document.getElementById('menu_logado');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    // Mostra menu logado
    if (menuLogado) menuLogado.style.display = 'flex';
    if (menuDefault) menuDefault.style.display = 'none';

    // Atualiza nome e foto do usuário
    const avatarImgs = menuLogado.querySelectorAll('#perfil-btn img, .perfil-header img');
    avatarImgs.forEach(img => {
      img.src = `assets/img/${usuario.foto || 'avatar.png'}`;
    });

    const nomeElemento = menuLogado.querySelector('.perfil-header p strong');
    if (nomeElemento) nomeElemento.textContent = usuario.nome;
  } else {
    // Mostra menu padrão
    if (menuDefault) menuDefault.style.display = 'flex';
    if (menuLogado) menuLogado.style.display = 'none';
  }

  // Logout
  const logoutLink = menuLogado?.querySelector('a[href="logout.html"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.reload(); // recarrega para mostrar menu padrão
    });
  }
});

// Menu dropdown do perfil
const perfilBtn = document.getElementById('perfil-btn');
const perfilMenu = document.getElementById('perfil-menu');

if (perfilBtn && perfilMenu) {
  perfilBtn.addEventListener('click', e => {
    e.preventDefault();
    perfilMenu.style.display = perfilMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Fecha o menu se clicar fora
  document.addEventListener('click', e => {
    if (!perfilBtn.contains(e.target) && !perfilMenu.contains(e.target)) {
      perfilMenu.style.display = 'none';
    }
  });
}
