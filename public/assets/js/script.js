// Seleciona todas as âncoras internas do menu
const links = document.querySelectorAll('nav a');
const main = document.getElementById('conteudo-principal');

// Função para carregar conteúdo via fetch
async function carregarPagina(href) {
  try {
    const res = await fetch(href);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const novoConteudo = doc.querySelector('main');
    if (novoConteudo) main.innerHTML = novoConteudo.innerHTML;
    window.history.pushState({}, '', href); // Atualiza a URL sem reload
  } catch (err) {
    console.error('Erro ao carregar página:', err);
    main.innerHTML = '<p>Erro ao carregar página.</p>';
  }
}

// Intercepta clique dos links internos
links.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    e.preventDefault();
    carregarPagina(href);
  });
});

// Botão voltar/avançar do navegador
window.addEventListener('popstate', () => {
  carregarPagina(window.location.pathname);
});
