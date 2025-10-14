document.addEventListener('DOMContentLoaded', () => {
  const menuDefault = document.getElementById('menu_defalt');
  const menuLogado = document.getElementById('menu_logado');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    // Mostra menu logado e esconde o padrão
    if (menuLogado) menuLogado.style.display = 'flex';
    if (menuDefault) menuDefault.style.display = 'none';

    // Atualiza avatar no menu e dropdown
    const avatarImgs = menuLogado.querySelectorAll('#perfil-btn img, .perfil-header img');
    const fotoUsuario = usuario.foto ? `/uploads/${usuario.foto}` : '/assets/img/avatar.jpg';
    avatarImgs.forEach(img => img.src = fotoUsuario);

    // Atualiza nome do usuário
    const nomeElemento = menuLogado.querySelector('.perfil-header p strong');
    if (nomeElemento) nomeElemento.textContent = usuario.nome;
  } else {
    // Usuário não logado
    if (menuDefault) menuDefault.style.display = 'flex';
    if (menuLogado) menuLogado.style.display = 'none';
  }

  // Logout
  const logoutLink = menuLogado?.querySelector('a[href="/logout.html"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      // Redireciona para página inicial ou login
      window.location.href = '/';
    });
  }

  // Dropdown do perfil
  const perfilBtn = document.getElementById('perfil-btn');
  const perfilMenu = document.getElementById('perfil-menu');

  if (perfilBtn && perfilMenu) {
    perfilBtn.addEventListener('click', e => {
      e.preventDefault();
      perfilMenu.style.display = perfilMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', e => {
      if (!perfilBtn.contains(e.target) && !perfilMenu.contains(e.target)) {
        perfilMenu.style.display = 'none';
      }
    });
  }
});
