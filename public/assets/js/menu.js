let usuarioLogado = false;

const menuDefault = document.getElementById("menu_defalt");
const menuLogado = document.getElementById("menu_logado");

function alternarMenu() {
  if (usuarioLogado) {
    menuDefault.style.display = "none";
    menuLogado.style.display = "block";
  } else {
    menuDefault.style.display = "block";
    menuLogado.style.display = "none";
  }
}

const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

showRegister.addEventListener('click', () => {
  loginForm.classList.remove('show');
  loginForm.style.display = 'none';
  registerForm.style.display = 'flex';
  setTimeout(() => registerForm.classList.add('show'), 10);
});

showLogin.addEventListener('click', () => {
  registerForm.classList.remove('show');
  registerForm.style.display = 'none';
  loginForm.style.display = 'flex';
  setTimeout(() => loginForm.classList.add('show'), 10);
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  usuarioLogado = true;
  alternarMenu();
  window.location.href = "public/index.html";
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  usuarioLogado = true;
  alternarMenu();
  window.location.href = "public/index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  alternarMenu();
});
