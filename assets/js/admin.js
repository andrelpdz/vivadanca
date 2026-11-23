fetch('header.html')
    .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar o menu');
        return response.text();
    })
    .then(html => {
        document.querySelector('header').innerHTML = html;
    })
    .catch(error => console.error(error));

fetch('../backend/valida_login.php')
    .then(response => {
            if (!response.ok) throw new Error('Erro ao validar login');
            return response.text();
        })
        .then(html => {
          console.log(html);
          if(html.trim() != "logado"){
            location.href="/vivadanca/admin.php"
          }
        })
        .catch(error => console.error(error));

// Gerenciamento compartilhado dos cadastros com foto.
(() => {
if (!['coreografia', 'galeria'].includes(document.body.dataset.adminCollection)) return;
const adminCollection = document.body.dataset.adminCollection;
const adminConfig = {
  coreografia: { key: 'coreografias', folder: 'coreografias', fields: ['titulo', 'descricao', 'data_criacao', 'modalidade'] },
  conquista: { key: 'conquistas', folder: 'conquistas', fields: ['evento_id', 'coreografia_id', 'nome', 'descricao'] },
  galeria: { key: 'galeria', folder: 'galeria', fields: ['nome', 'descricao', 'data_foto'] }
}[adminCollection];
const adminContainer = document.getElementById(adminConfig.key);
const adminForm = document.querySelector('form.form-integrantes');
const adminPhoto = document.getElementById('foto');
const adminSubmit = document.getElementById('btnEnviar');
const adminNode = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const adminFeedback = adminNode('p', '', 'admin-acervo-feedback');
adminFeedback.setAttribute('role', 'status');
adminForm.prepend(adminFeedback);
const adminPreview = adminNode('img');
adminPreview.alt = 'Prévia da foto';
adminPreview.hidden = true;
adminPreview.style.cssText = 'max-width:220px;max-height:180px;object-fit:contain;margin-block:12px';
adminPhoto.after(adminPreview);
// const adminNew = adminNode('button', 'Novo cadastro');
// adminNew.type = 'button';
// adminNew.hidden = true;
// adminSubmit.after(adminNew);
const adminPhotoUrl = (record) => `../assets/${adminConfig.folder}/${encodeURIComponent(String(record.foto).split(/[\\/]/).pop())}`;
let previewObjectUrl;

function resetAdminForm() {
  adminForm.reset();
  document.getElementById('id').value = '';
  adminSubmit.value = 'Cadastrar';
  adminPhoto.required = adminCollection !== 'coreografia';
  adminPreview.hidden = true;
  // adminNew.hidden = true;
  adminFeedback.textContent = '';
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
}
// adminNew.addEventListener('click', resetAdminForm);
adminPhoto.addEventListener('change', () => {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  const file = adminPhoto.files[0];
  adminPreview.hidden = !file;
  if (file) adminPreview.src = previewObjectUrl = URL.createObjectURL(file);
});

function editAdminRecord(record) {
  adminForm.reset();
  document.getElementById('id').value = record.id;
  adminConfig.fields.forEach((field) => { document.getElementById(field).value = record[field] || ''; });
  adminSubmit.value = 'Atualizar';
  adminPhoto.required = false;
  adminPreview.hidden = !record.foto;
  if (record.foto) adminPreview.src = adminPhotoUrl(record);
  // adminNew.hidden = false;
  adminFeedback.textContent = 'Editando cadastro. Deixe a foto em branco para manter a atual.';
  adminForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function adminCard(record) {
  const card = adminNode('article', '', 'admin-acervo-card');
  const image = adminNode('img');
  image.alt = record.titulo || record.nome || record.descricao || 'Imagem do acervo';
  image.loading = 'lazy';
  image.onerror = () => { image.onerror = null; image.src = '../assets/img/logo.png'; image.style.objectFit = 'contain'; };
  image.src = record.foto ? adminPhotoUrl(record) : '../assets/img/logo.png';
  const body = adminNode('div');
  body.append(adminNode('h3', record.titulo || record.nome || record.descricao || 'Registro da galeria'));
  if (record.modalidade) body.append(adminNode('p', record.modalidade));
  if (adminCollection === 'galeria' && record.data_foto) {
    body.append(adminNode('p', `Data da foto: ${String(record.data_foto).slice(0, 10).split('-').reverse().join('/')}`));
  }
  if (record.evento_nome) body.append(adminNode('p', `Evento: ${record.evento_nome}`));
  if (record.coreografia_titulo) body.append(adminNode('p', `Coreografia: ${record.coreografia_titulo}`));
  if (record.descricao && (adminCollection !== 'galeria' || record.nome)) body.append(adminNode('p', record.descricao));
  const actions = adminNode('div', '', 'admin-acervo-actions');
  const edit = adminNode('button', 'Editar');
  edit.type = 'button';
  edit.addEventListener('click', () => editAdminRecord(record));
  const remove = adminNode('button', 'Excluir');
  remove.type = 'button';
  remove.addEventListener('click', async () => {
    if (!confirm('Excluir este registro?')) return;
    try {
      const response = await fetch(`../backend/api_${adminCollection}.php?id=${encodeURIComponent(record.id)}`, { method: 'DELETE', headers: { Accept: 'application/json' } });
      const data = await response.json();
      if (!response.ok || !data.sucesso) throw new Error(data.erro || 'Não foi possível excluir.');
      await loadAdminRecords();
    } catch (error) { adminFeedback.textContent = error.message; }
  });
  actions.append(edit, remove);
  body.append(actions);
  card.append(image, body);
  return card;
}

async function loadAdminRecords() {
  adminContainer.setAttribute('aria-busy', 'true');
  adminContainer.replaceChildren(adminNode('p', 'Carregando registros…'));
  try {
    const response = await fetch(`../backend/api_${adminCollection}.php`, { cache: 'no-store', headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok || !data.sucesso || !Array.isArray(data[adminConfig.key])) throw new Error('Não foi possível carregar o cadastro.');
    if (adminCollection === 'conquista') {
      for (const [field, key] of [['evento_id', 'eventos'], ['coreografia_id', 'coreografias']]) {
        const select = document.getElementById(field);
        const selected = select.value;
        select.replaceChildren(new Option('Selecione uma opção', ''));
        (data[key] || []).forEach((record) => select.add(new Option(record.nome || record.titulo, record.id)));
        select.value = selected;
      }
    }
    const records = data[adminConfig.key];
    adminContainer.classList.add('admin-acervo-grid');
    adminContainer.replaceChildren(...records.map(adminCard));
    if (!records.length) adminContainer.append(adminNode('p', 'Nenhum registro cadastrado.'));
  } catch (error) { adminContainer.replaceChildren(adminNode('p', error.message)); }
  finally { adminContainer.setAttribute('aria-busy', 'false'); }
}

adminForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(adminForm);
  formData.set('btnEnviar', adminSubmit.value);
  adminSubmit.disabled = true;
  adminFeedback.textContent = 'Salvando…';
  try {
    const response = await fetch(adminForm.action, { method: 'POST', body: formData });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.erro || 'Não foi possível salvar.');
    }
    // Existing endpoints redirect to their admin page on successful saves.
    if (!response.redirected) {
      const result = await response.json();
      if (!result.sucesso) throw new Error(result.erro || 'Não foi possível salvar.');
    }
    resetAdminForm();
    adminFeedback.textContent = 'Cadastro salvo com sucesso.';
    await loadAdminRecords();
  } catch (error) { adminFeedback.textContent = error.message; }
  finally { adminSubmit.disabled = false; }
});
loadAdminRecords();

})();
