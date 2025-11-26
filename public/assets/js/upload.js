document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const input = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const status = document.getElementById('status');
  const titleInput = document.getElementById('title');
  const licenseSelect = document.getElementById('license');
  const licenseDesc = document.getElementById('licenseDesc');

  // carrega licenças do servidor (APENAS do banco)
  const loadLicenses = async () => {
    try {
      const res = await fetch('/api/licenses', { cache: 'no-store' });
      if (res.status === 204) { // sem conteúdo
        licenseSelect.innerHTML = '<option value="">Nenhuma licença disponível</option>';
        licenseDesc.textContent = '';
        console.warn('Nenhuma licença cadastrada no banco.');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Resposta inválida do servidor');
      // popula select
      licenseSelect.innerHTML = '<option value="">--Selecione--</option>';
      data.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id ?? l.nome ?? '';
        opt.textContent = l.nome ?? (`Licença ${l.id ?? ''}`);
        opt.dataset.desc = l.descricao ?? '';
        opt.dataset.logo = l.logo ?? '';
        licenseSelect.appendChild(opt);
      });
      console.log(`Licenças carregadas do banco (${data.length})`);
    } catch (err) {
      console.error('Não foi possível carregar licenças do banco:', err.message || err);
      licenseSelect.innerHTML = '<option value="">Erro ao carregar licenças</option>';
      licenseDesc.textContent = 'Não foi possível carregar licenças do servidor. Contate o administrador.';
    }
  };

  licenseSelect?.addEventListener('change', () => {
    const opt = licenseSelect.selectedOptions[0];
    const desc = opt?.dataset?.desc || '';
    licenseDesc.textContent = desc;
  });

  // inicializa licenças
  loadLicenses();

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) { preview.style.display = 'none'; return; }
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = 'block';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.files[0]) return alert('Selecione uma imagem');
    if (!titleInput.value || titleInput.value.trim() === '') return alert('Título é obrigatório');

    status.textContent = 'Enviando...';
    const fd = new FormData();
    fd.append('image', input.files[0]);
    fd.append('title', titleInput.value.trim());
    // support both english id="description" and portuguese id="descricao" so older versions don't break
    const descriptionEl = document.getElementById('description') || document.getElementById('descricao');
    const descriptionValue = descriptionEl ? (descriptionEl.value || '') : '';
    fd.append('description', descriptionValue);
    fd.append('license', licenseSelect.value || ''); // envia id (se preenchido)
    // if user is logged in, attach userId (saved by login.js in localStorage as 'usuario')
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (usuario && usuario.id) fd.append('userId', String(usuario.id));
    } catch (_) {
      // ignore JSON parse errors
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const contentType = res.headers.get('content-type') || '';
      let payload;
      if (contentType.includes('application/json')) {
        payload = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Resposta inesperada do servidor: ${text.substring(0,200)}`);
      }

      if (!res.ok) throw new Error(payload.error || 'Erro no upload');

      status.textContent = 'Enviado com sucesso!';
      setTimeout(() => { window.location.href = '/'; }, 900);
    } catch (err) {
      console.error(err);
      status.textContent = 'Falha no envio: ' + err.message;
      alert('Erro no upload: ' + err.message);
    }
  });
});