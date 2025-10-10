
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const showRegisterBtn = document.getElementById('show-cadastro');
const showLoginBtn = document.getElementById('show-login');

function toggleForm(tipo) {
  if (!loginForm || !registerForm) return;

  if (tipo === 'cadastro') {
    loginForm.classList.remove('show');
    registerForm.style.display = 'flex';
    setTimeout(() => registerForm.classList.add('show'), 50);
    
    loginForm.style.display = 'none';
  } else if (tipo === 'login') {
    registerForm.classList.remove('show');
    loginForm.style.display = 'flex';
    setTimeout(() => loginForm.classList.add('show'), 50);
    
    registerForm.style.display = 'none';
  }
}

showRegisterBtn?.addEventListener('click', () => toggleForm('cadastro'));
showLoginBtn?.addEventListener('click', () => toggleForm('login'));


document.addEventListener('DOMContentLoaded', () => {
  if (loginForm && registerForm) {
    loginForm.style.display = 'flex';
    loginForm.classList.add('show');
    registerForm.style.display = 'none';
  }
});
