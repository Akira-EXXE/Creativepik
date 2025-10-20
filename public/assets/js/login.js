document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');
  const msgStatus = document.getElementById('msgStatus');
  const showRegisterBtn = document.getElementById('show-cadastro');
  const showLoginBtn = document.getElementById('show-login');

  // Preenche email se vier da conta recente
  const params = new URLSearchParams(window.location.search);
  const emailPreenchido = params.get('email');
  if (emailPreenchido) {
    const emailInput = formLogin.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = emailPreenchido;
    const senhaInput = formLogin.querySelector('input[name="senha"]');
    if (senhaInput) senhaInput.focus();
  }

  // Toggle entre login e cadastro
  const toggleForm = (tipo) => {
    if (tipo === 'cadastro') {
      formLogin.classList.remove('show'); formLogin.style.display = 'none';
      formCadastro.style.display = 'flex';
      setTimeout(() => formCadastro.classList.add('show'), 50);
    } else {
      formCadastro.classList.remove('show'); formCadastro.style.display = 'none';
      formLogin.style.display = 'flex';
      setTimeout(() => formLogin.classList.add('show'), 50);
    }
    msgStatus.style.display = 'none';
    msgStatus.classList.remove('msg-success', 'msg-error');
  };

  showRegisterBtn?.addEventListener('click', () => toggleForm('cadastro'));
  showLoginBtn?.addEventListener('click', () => toggleForm('login'));

  // ==========================
  // CADASTRO
  // ==========================
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formCadastro);

    try {
      const res = await fetch('/api/users/register', { method: 'POST', body: formData });
      let json = res.headers.get("content-type")?.includes("application/json") ? await res.json() : null;

      msgStatus.style.display = 'block';
      if (res.ok && json?.usuario) {
        msgStatus.classList.add('msg-success'); msgStatus.classList.remove('msg-error');
        msgStatus.innerText = json.message || 'Cadastro realizado!';

        const usuarioAtivo = { ...json.usuario, ultimaConexao: Date.now(), addConta: true };
        localStorage.setItem('usuario', JSON.stringify(usuarioAtivo));

        // Atualiza lista de usuários recentes
        const recentes = JSON.parse(localStorage.getItem('usuariosRecentes')) || [];
        const existe = recentes.find(u => u.email === usuarioAtivo.email);
        if (!existe) {
          recentes.unshift(usuarioAtivo);
          if (recentes.length > 5) recentes.pop();
          localStorage.setItem('usuariosRecentes', JSON.stringify(recentes));
        }

        setTimeout(() => window.location.href = 'index.html', 1200);
      } else {
        msgStatus.classList.add('msg-error'); msgStatus.classList.remove('msg-success');
        msgStatus.innerText = json?.error || 'Erro no cadastro!';
      }
    } catch (err) {
      msgStatus.style.display = 'block';
      msgStatus.classList.add('msg-error'); msgStatus.classList.remove('msg-success');
      msgStatus.innerText = 'Erro no servidor.';
      console.error(err);
    }
  });

  // ==========================
  // LOGIN
  // ==========================
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = { email: formLogin.email.value.trim(), senha: formLogin.senha.value.trim() };

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const json = await res.json();
      msgStatus.style.display = 'block';

      if (res.ok && json.usuario) {
        msgStatus.classList.add('msg-success'); msgStatus.classList.remove('msg-error');
        msgStatus.innerText = json.message || 'Login efetuado!';

        const usuarioAtivo = { ...json.usuario, ultimaConexao: Date.now(), addConta: true };
        localStorage.setItem('usuario', JSON.stringify(usuarioAtivo));

        const recentes = JSON.parse(localStorage.getItem('usuariosRecentes')) || [];
        const existe = recentes.find(u => u.email === usuarioAtivo.email);
        if (!existe) {
          recentes.unshift(usuarioAtivo);
          if (recentes.length > 5) recentes.pop();
          localStorage.setItem('usuariosRecentes', JSON.stringify(recentes));
        }

        setTimeout(() => window.location.href = 'index.html', 1200);
      } else {
        msgStatus.classList.add('msg-error'); msgStatus.classList.remove('msg-success');
        msgStatus.innerText = json?.error || 'Erro no login!';
      }
    } catch (err) {
      msgStatus.style.display = 'block';
      msgStatus.classList.add('msg-error'); msgStatus.classList.remove('msg-success');
      msgStatus.innerText = 'Erro no servidor.';
      console.error(err);
    }
  });
});
