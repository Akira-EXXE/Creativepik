document.addEventListener('DOMContentLoaded', () => {
  const menuDefault = document.getElementById('menu_defalt');
  const menuLogado = document.getElementById('menu_logado');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    // Mostra menu logado
    if (menuLogado) menuLogado.style.display = 'flex';
    if (menuDefault) menuDefault.style.display = 'none';
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
