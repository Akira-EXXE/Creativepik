document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.pinterest-gallery');
  const imageModal = document.getElementById('imageModal');
  const modalContent = imageModal?.querySelector('.modal-content');
  const modalImg = document.getElementById('modalImg');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalTags = document.getElementById('modalTags');
  const modalLicense = document.getElementById('modalLicense');
  const modalSummary = document.getElementById('modalSummary');
  const closeModalBtn = document.getElementById('closeModal');

  if (!gallery) return;

  const fetchImages = async () => {
    const tries = ['/api/images', '/db/images.json'];
    for (const url of tries) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) return data;
      } catch (err) {
        // tenta próxima fonte
        console.warn(`Falha ao buscar ${url}:`, err.message || err);
      }
    }
    return [];
  };

  const openModal = (img) => {
    if (!imageModal) return;
    modalImg.src = img.url;
    modalImg.alt = img.titulo || 'Imagem';
    modalAuthor.textContent = img.autor ? `Autor: ${img.autor}` : 'Autor: Desconhecido';
    modalTags.textContent = img.tags || '';
    modalLicense.textContent = img.licenca_nome ? `Licença: ${img.licenca_nome}` : '';
    modalSummary.textContent = img.descricao || '';
    imageModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!imageModal) return;
    imageModal.style.display = 'none';
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  // fechar ao clicar no X, fora do conteúdo ou ESC
  closeModalBtn?.addEventListener('click', closeModal);
  imageModal?.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  const render = (images) => {
    // garantir ordem: mais recentes primeiro (id desc)
    images.sort((a, b) => (b.id || 0) - (a.id || 0));

    // limpa galeria
    gallery.innerHTML = '';

    images.forEach(img => {
      const card = document.createElement('div');
      card.className = 'pin';

      const pinImage = document.createElement('div');
      pinImage.className = 'pin-image';
      const imageEl = document.createElement('img');
      imageEl.src = img.url;
      imageEl.alt = img.titulo || 'Imagem';
      imageEl.loading = 'lazy';
      pinImage.appendChild(imageEl);

      const info = document.createElement('div');
      info.className = 'pin-info';
      const h3 = document.createElement('h3');
      h3.textContent = img.titulo || '';
      const p = document.createElement('p');
      p.textContent = img.descricao || '';
      const small = document.createElement('small');
      const parts = [];
      if (img.autor) parts.push(img.autor);
      if (img.licenca_nome) parts.push(`Licença: ${img.licenca_nome}`);
      small.textContent = parts.join(' • ');

      info.appendChild(h3);
      info.appendChild(p);
      info.appendChild(small);

      card.appendChild(pinImage);
      card.appendChild(info);

      // clique abre modal com dados completos
      card.addEventListener('click', () => openModal(img));

      // inserir no topo (garante nova imagem apareça primeira)
      gallery.insertBefore(card, gallery.firstChild);
    });

    if (images.length === 0) {
      gallery.innerHTML = '<p style="padding:16px;color:#666">Nenhuma imagem encontrada.</p>';
    }
  };

  (async () => {
    const images = await fetchImages();
    render(images);
  })();
});