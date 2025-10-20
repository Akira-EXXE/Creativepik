document.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) window.location.reload();
  });

  const menuDefault = document.getElementById('menu_defalt');
  const menuLogado = document.getElementById('menu_logado');
  let usuario = JSON.parse(localStorage.getItem('usuario'));
  let usuariosRecentes = JSON.parse(localStorage.getItem('usuariosRecentes')) || [];

  // ==========================
  // EXIBIÇÃO DO MENU
  // ==========================
  const atualizarMenu = () => {
    if (usuario) {
      if (menuLogado) menuLogado.style.display = 'flex';
      if (menuDefault) menuDefault.style.display = 'none';

      // Avatar
      const avatarImgs = menuLogado?.querySelectorAll('#perfil-btn img, .perfil-header img') || [];
      const fotoUsuario = usuario.foto ? `/uploads/${usuario.foto}` : '/assets/img/avatar.jpg';
      avatarImgs.forEach(img => img.src = fotoUsuario);

      // Nome
      const nomeElemento = menuLogado?.querySelector('.perfil-header p strong');
      if (nomeElemento) nomeElemento.textContent = usuario.nome || 'Usuário';
    } else {
      if (menuDefault) menuDefault.style.display = 'flex';
      if (menuLogado) menuLogado.style.display = 'none';
      usuariosRecentes = [];
      localStorage.setItem('usuariosRecentes', JSON.stringify(usuariosRecentes));
    }
  };

  atualizarMenu();

  // ==========================
  // DROPDOWN DO PERFIL
  // ==========================
  const perfilBtn = document.getElementById('perfil-btn');
  const perfilMenu = document.getElementById('perfil-menu');

  const reconstruirDropdown = () => {
    if (!perfilMenu) return;

    const listaRecente = perfilMenu.querySelector('ul');
    listaRecente.innerHTML = ''; // limpa lista atual

    // Filtra apenas usuários adicionados via "Adicionar conta", que não sejam o usuário logado
    const contasValidas = usuariosRecentes
      .filter(u => u.addConta && (!usuario || u.email !== usuario.email))
      .slice(0, 5);

    // Usuários adicionados no topo
    contasValidas.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="#" class="usuario-recente" data-email="${u.email}">
          <img src="${u.foto ? '/uploads/' + u.foto : '/assets/img/avatar.jpg'}" alt="Avatar" class="avatar">
          ${u.nome}
        </a>`;
      listaRecente.appendChild(li);
    });

    // "Adicionar nova conta"
    const liNovaConta = document.createElement('li');
    liNovaConta.innerHTML = '<a href="#" id="addAccount">Adicionar conta</a>';
    listaRecente.appendChild(liNovaConta);

    // Logout
    const liLogout = document.createElement('li');
    liLogout.innerHTML = '<a href="#" id="logoutBtn">Sair</a>';
    listaRecente.appendChild(liLogout);

    // Eventos
    listaRecente.querySelectorAll('.usuario-recente').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const email = e.currentTarget.dataset.email;
        const usuarioSelecionado = usuariosRecentes.find(u => u.email === email);
        if (usuarioSelecionado) {
          const agora = Date.now();
          const limite = 60 * 60 * 1000; // 1 hora
          if (agora - usuarioSelecionado.ultimaConexao < limite) {
            window.location.href = `/login.html?email=${encodeURIComponent(usuarioSelecionado.email)}`;
          } else {
            window.location.href = '/login.html';
          }
        }
      });
    });

    document.getElementById('addAccount')?.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '/login.html';
    });

    document.getElementById('logoutBtn')?.addEventListener('click', e => {
      e.preventDefault();
      if (confirm("Tem certeza que deseja sair da sua conta?")) {
        // Remove usuário logado e todas as contas do dropdown
        localStorage.removeItem('usuario');
        usuariosRecentes = [];
        localStorage.setItem('usuariosRecentes', JSON.stringify(usuariosRecentes));
        window.location.href = '/login.html';
      }
    });
  };

  reconstruirDropdown();

  // Toggle do dropdown
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
