const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const msgStatus = document.getElementById('msgStatus');
    const showRegisterBtn = document.getElementById('show-cadastro');
    const showLoginBtn = document.getElementById('show-login');

    const toggleForm = (tipo) => {
      if (tipo === 'cadastro') {
        formLogin.classList.remove('show');
        formLogin.style.display = 'none';
        formCadastro.style.display = 'flex';
        setTimeout(() => formCadastro.classList.add('show'), 50);
      } else {
        formCadastro.classList.remove('show');
        formCadastro.style.display = 'none';
        formLogin.style.display = 'flex';
        setTimeout(() => formLogin.classList.add('show'), 50);
      }
      msgStatus.style.display = 'none';
      msgStatus.classList.remove('msg-success', 'msg-error');
    };

    showRegisterBtn?.addEventListener('click', () => toggleForm('cadastro'));
    showLoginBtn?.addEventListener('click', () => toggleForm('login'));

    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(formCadastro);

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          body: formData
        });

        let json;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          json = await res.json();
        } else {
          const text = await res.text();
          console.error("Resposta do servidor não é JSON:", text);
          throw new Error(text);
        }

        msgStatus.style.display = 'block';

        if (res.ok) {
          msgStatus.classList.remove('msg-error');
          msgStatus.classList.add('msg-success');
          msgStatus.innerText = json.message || 'Cadastro realizado!';
          if (json.usuario) localStorage.setItem('usuario', JSON.stringify(json.usuario));
          setTimeout(() => window.location.href = 'index.html', 1200);
        } else {
          msgStatus.classList.remove('msg-success');
          msgStatus.classList.add('msg-error');
          msgStatus.innerText = json.error || 'Erro no cadastro!';
        }
      } catch (err) {
        msgStatus.style.display = 'block';
        msgStatus.classList.remove('msg-success');
        msgStatus.classList.add('msg-error');
        msgStatus.innerText = 'Erro no servidor.';
        console.error("Erro no envio do cadastro:", err);
      }
    });

    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const dados = {
        email: formLogin.email.value.trim(),
        senha: formLogin.senha.value.trim()
      };

      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });

        const json = await res.json();
        msgStatus.style.display = 'block';

        if (res.ok) {
          msgStatus.classList.remove('msg-error');
          msgStatus.classList.add('msg-success');
          msgStatus.innerText = json.message || 'Login efetuado!';
          if (json.usuario) localStorage.setItem('usuario', JSON.stringify(json.usuario));
          setTimeout(() => window.location.href = 'index.html', 1200);
        } else {
          msgStatus.classList.remove('msg-success');
          msgStatus.classList.add('msg-error');
          msgStatus.innerText = json.error || 'Erro no login!';
        }
      } catch (err) {
        msgStatus.style.display = 'block';
        msgStatus.classList.remove('msg-success');
        msgStatus.classList.add('msg-error');
        msgStatus.innerText = 'Erro no servidor.';
        console.error("Erro no envio do login:", err);
      }
    });