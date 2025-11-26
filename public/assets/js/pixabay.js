document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // CONFIGURAÇÕES
    // ===========================
    const apiKey = "53241747-1bb8718cd7135f666f6c224c0"; 
    let page = 1;
    let query = "nature";     
    let isLoading = false;

    const gallery = document.querySelector(".pinterest-gallery");
    const searchInput = document.querySelector("#searchInput");
    const searchBtn = document.querySelector("#searchBtn");

    // Elementos do modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalAuthor = document.getElementById("modalAuthor");
    const modalTags = document.getElementById("modalTags");
    const modalLicense = document.getElementById("modalLicense");
    const modalSummary = document.getElementById("modalSummary");
    const modalClose = document.getElementById("closeModal");

    // Segurança extra
    if (!gallery) {
        console.error("Elemento .pinterest-gallery não encontrado!");
        return;
    }
    if (!searchInput || !searchBtn) {
        console.error("searchInput ou searchBtn não encontrados no HTML!");
        return;
    }

    // ===========================
    // ABRIR MODAL
    // ===========================
    function openModal(imgData) {
        modalImg.src = imgData.largeImageURL;
        modalAuthor.textContent = `Autor: ${imgData.user}`;
        modalTags.textContent = `Tags: ${imgData.tags}`;

        // PIXABAY TEM LICENÇA ÚNICA → DOMÍNIO PÚBLICO
        modalLicense.textContent = "Licença: Pixabay License (Domínio Público)";
        modalSummary.textContent =
            "Você pode usar esta imagem gratuitamente para qualquer finalidade, inclusive comercial caso tenha sido modificada, sem pedir permissão. Não é necessário atribuir o autor, mas é recomendado.";

        modal.style.display = "flex";
    }

    // ===========================
    // FECHAR O MODAL
    // ===========================
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // ===========================
    // FUNÇÃO PRINCIPAL DE BUSCA
    // ===========================
    async function loadImages(isNewSearch = false) {
        if (isLoading) return;
        isLoading = true;

        try {
            const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=30&page=${page}`;

            const response = await fetch(url);
            const data = await response.json();

            if (isNewSearch) {
                gallery.innerHTML = "";
                page = 1;
            }

            // Render images using the same structure / classes as local images (pin -> pin-image + pin-info)
            data.hits.forEach(img => {
                const pin = document.createElement('div');
                pin.classList.add('pin');

                const pinImage = document.createElement('div');
                pinImage.className = 'pin-image';
                const imageEl = document.createElement('img');
                imageEl.src = img.webformatURL;
                imageEl.alt = img.tags || 'Imagem';
                imageEl.loading = 'lazy';
                pinImage.appendChild(imageEl);

                const info = document.createElement('div');
                info.className = 'pin-info';
                const h3 = document.createElement('h3');
                // Use the tags as a readable title when possible
                h3.textContent = img.tags ? img.tags.split(',')[0] : 'Pixabay image';
                const p = document.createElement('p');
                p.textContent = img.tags || '';
                const small = document.createElement('small');
                small.textContent = `Autor: ${img.user} • Licença: Pixabay`;

                info.appendChild(h3);
                info.appendChild(p);
                info.appendChild(small);

                pin.appendChild(pinImage);
                pin.appendChild(info);

                // Ao clicar em uma imagem → abre modal com os dados
                pin.addEventListener('click', () => {
                    openModal(img);
                });

                gallery.appendChild(pin);
            });

            page++;
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        }

        isLoading = false;
    }

    // ===========================
    // BUSCA AO CLICAR NA LUPA
    // ===========================
    searchBtn.addEventListener("click", () => {
        query = searchInput.value.trim();
        loadImages(true);
    });

    // ===========================
    // BUSCA AO PRESSIONAR ENTER
    // ===========================
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            query = searchInput.value.trim();
            loadImages(true);
        }
    });

    // ===========================
    // SCROLL INFINITO
    // ===========================
    window.addEventListener("scroll", () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.offsetHeight - 300;

        if (scrollPosition >= documentHeight) {
            loadImages(false);
        }
    });

    // ===========================
    // CARREGAR IMAGENS INICIAIS
    // ===========================
    loadImages();
});
