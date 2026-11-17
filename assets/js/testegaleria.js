const collectionKind = document.body.dataset.collection;
const settings = {
  achievements: { endpoint: 'api_conquista.php', key: 'conquistas', label: 'conquistas', empty: 'Ainda não há conquistas cadastradas no acervo.' },
  choreographies: { endpoint: 'api_coreografia.php', key: 'coreografias', label: 'coreografias', empty: 'Ainda não há coreografias cadastradas no repertório.' },
  gallery: { endpoint: 'api_galeria.php', key: 'galeria', label: 'registros', empty: 'Ainda não há imagens cadastradas na galeria.' }
}[collectionKind];
const archiveGrid = document.querySelector('#collection-grid');
const archiveStatus = document.querySelector('#collection-status');
const archiveCount = document.querySelector('#collection-count');
const archiveSearch = document.querySelector('#collection-search');
const archiveYear = document.querySelector('#collection-year');
const archiveRetry = document.querySelector('#collection-retry');
const archiveDialog = document.querySelector('#archive-lightbox');
const archiveSelectedId = new URLSearchParams(location.search).get('id');
let archiveRecords = [];
let archiveVisible = [];
let archiveReady = false;
let lightboxIndex = 0;
let lightboxTrigger;
const textNode = (tag, text, className) => {
  const element = document.createElement(tag);
  element.textContent = text ?? '';
  if (className) element.className = className;
  return element;
};
const normalizeArchive = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const recordTitle = (record) => record.titulo || record.nome || record.descricao || 'Registro do Viva Dança';
const recordYear = (record) => String(record.data_criacao || record.data_inicio || record.data || '').match(/^[1-9]\d{3}/)?.[0] || '';
const archiveImage = (record) => `../assets/${collectionKind === 'gallery' ? 'galeria' : collectionKind === 'choreographies' ? 'coreografias' : 'conquistas'}/${encodeURIComponent(String(record.foto).split(/[\\/]/).pop())}`;

function showLightbox(index, trigger) {
  lightboxIndex = index;
  if (trigger) lightboxTrigger = trigger;
  const record = archiveVisible[index];
  const image = document.querySelector('#lightbox-photo');
  image.alt = recordTitle(record);
  image.src = archiveImage(record);
  const caption = document.querySelector('#lightbox-caption');
  caption.replaceChildren();
  if (collectionKind === 'gallery') {
    const year = record.ano || recordYear(record);
    if (year) caption.append(textNode('span', String(year), 'lightbox-year'));
    caption.append(textNode('strong', record.nome || record.titulo || 'Registro do Viva Dança', 'lightbox-title'));
    if (record.descricao) caption.append(textNode('span', record.descricao, 'lightbox-description'));
  } else {
    caption.textContent = recordTitle(record);
  }
  document.querySelector('#lightbox-position').textContent = `${index + 1} / ${archiveVisible.length}`;
  document.querySelector('#lightbox-prev').disabled = index === 0;
  document.querySelector('#lightbox-next').disabled = index === archiveVisible.length - 1;
  if (!archiveDialog.open) archiveDialog.showModal();
  document.body.classList.add('lightbox-open');
}

function addPhoto(card, record, index) {
  if (!record.foto) {
    const placeholder = textNode('div', '', 'archive-placeholder');
    const logo = document.createElement('img');
    logo.src = '../assets/img/logo.png';
    logo.alt = '';
    placeholder.append(logo, textNode('span', 'Imagem ainda não cadastrada'));
    card.append(placeholder);
    return;
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Ampliar imagem: ${recordTitle(record)}`);
  button.setAttribute('aria-haspopup', 'dialog');
  const image = document.createElement('img');
  image.loading = 'lazy';
  image.width = 600;
  image.height = 450;
  image.alt = recordTitle(record);
  image.addEventListener('error', () => {
    button.disabled = true;
    button.classList.add('archive-photo-missing');
    button.removeAttribute('aria-haspopup');
    button.setAttribute('aria-label', 'Imagem indisponível');
    image.src = '../assets/img/logo.png';
    image.alt = 'Viva Dança';
    if (collectionKind !== 'gallery') card.append(textNode('p', 'O arquivo desta imagem não está disponível no acervo.', 'archive-photo-missing-note'));
  }, { once: true });
  image.src = archiveImage(record);
  button.append(image);
  button.addEventListener('click', () => showLightbox(index, button));
  card.append(button);
}

function createArchiveCard(record, index) {
  const card = document.createElement('article');
  card.className = 'archive-card';
  addPhoto(card, record, index);
  if (collectionKind === 'gallery') return card;
  const eyebrow = [recordYear(record), record.modalidade || record.evento_nome].filter(Boolean).join(' · ');
  if (eyebrow) card.append(textNode('p', eyebrow, 'eyebrow'));
  card.append(textNode('h3', collectionKind === 'gallery' ? (record.descricao || 'Registro do acervo') : recordTitle(record)));
  if (collectionKind === 'choreographies') {
    card.append(textNode('p', record.descricao || 'Uma criação do Viva Dança Sorocaba 60+.'));
    const link = textNode('a', 'Conheça a coreografia ↗', 'text-link');
    link.href = `testecoreografias.html?id=${encodeURIComponent(record.id)}#acervo`;
    card.append(link);
  } else if (collectionKind === 'achievements') {
    const details = document.createElement('details');
    details.append(textNode('summary', 'Conheça esta conquista'), textNode('p', record.descricao || 'Reconhecimento ao trabalho coletivo do Viva Dança.'));
    if (record.coreografia_titulo) {
      const link = textNode('a', record.coreografia_titulo + ' ↗', 'text-link');
      link.href = `testecoreografias.html?id=${encodeURIComponent(record.coreografia_id)}#acervo`;
      details.append(link);
    }
    card.append(details);
  }
  return card;
}

function renderChoreographyDetail(record) {
  const card = document.createElement('article');
  card.className = 'archive-card archive-detail';
  archiveVisible = [record];
  addPhoto(card, record, 0);
  card.append(textNode('p', 'Repertório · Viva Dança', 'eyebrow'), textNode('h3', record.titulo), textNode('p', record.descricao || 'Uma criação do Viva Dança Sorocaba 60+.'));
  const facts = document.createElement('dl');
  for (const [label, value] of [['Criação', record.data_criacao ? String(record.data_criacao).slice(0, 10).split('-').reverse().join('/') : ''], ['Modalidade', record.modalidade]]) {
    if (!value) continue;
    const group = document.createElement('div');
    group.append(textNode('dt', label), textNode('dd', value));
    facts.append(group);
  }
  card.append(facts);
  const gallery = textNode('a', 'Visite nossa galeria →', 'text-link');
  gallery.href = 'testegaleria.html';
  card.append(gallery);
  archiveGrid.append(card);
  document.title = `${record.titulo} — Viva Dança`;
}

function renderArchive() {
  if (!archiveReady) return;
  archiveGrid.replaceChildren();
  archiveStatus.hidden = true;
  if (collectionKind === 'choreographies' && archiveSelectedId !== null) {
    document.querySelector('.archive-tools').hidden = true;
    document.querySelector('#collection-back').hidden = false;
    document.querySelector('#collection-title').textContent = 'Uma obra, uma história.';
    const selected = archiveRecords.find((record) => String(record.id) === archiveSelectedId);
    if (selected) renderChoreographyDetail(selected);
    else {
      archiveStatus.hidden = false;
      archiveStatus.textContent = 'Esta coreografia não foi encontrada. Volte ao repertório para escolher outra obra.';
    }
    return;
  }
  const query = normalizeArchive(archiveSearch.value.trim());
  archiveVisible = archiveRecords.filter((record) => (!archiveYear.value || recordYear(record) === archiveYear.value) && normalizeArchive([recordTitle(record), record.descricao, record.evento_nome, record.coreografia_titulo, record.modalidade].join(' ')).includes(query));
  archiveGrid.replaceChildren(...archiveVisible.map(createArchiveCard));
  archiveCount.textContent = `${archiveVisible.length} ${settings.label}`;
  archiveStatus.hidden = archiveVisible.length > 0;
  archiveStatus.textContent = archiveRecords.length ? 'Nenhum registro corresponde aos filtros. Experimente outra busca.' : settings.empty;
}

async function loadArchive() {
  archiveReady = false;
  archiveGrid.setAttribute('aria-busy', 'true');
  archiveRetry.hidden = true;
  archiveStatus.hidden = false;
  archiveStatus.textContent = 'Carregando o acervo…';
  try {
    const response = await fetch(`../backend/${settings.endpoint}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha na consulta');
    const data = await response.json();
    if (!data.sucesso || !Array.isArray(data[settings.key])) throw new Error('Resposta inválida');
    archiveRecords = data[settings.key].filter((record) => record && typeof record === 'object').sort((a, b) => recordYear(b).localeCompare(recordYear(a)));
    const years = [...new Set(archiveRecords.map(recordYear).filter(Boolean))].sort().reverse();
    archiveYear.replaceChildren(new Option('Todos os anos', ''));
    years.forEach((year) => archiveYear.add(new Option(year, year)));
    archiveReady = true;
    renderArchive();
  } catch {
    archiveStatus.textContent = 'Não foi possível carregar o acervo. Tente novamente em instantes.';
    archiveRetry.hidden = false;
  } finally {
    archiveGrid.setAttribute('aria-busy', 'false');
  }
}

archiveSearch.addEventListener('input', renderArchive);
archiveYear.addEventListener('change', renderArchive);
archiveRetry.addEventListener('click', loadArchive);
document.querySelector('#lightbox-close').addEventListener('click', () => archiveDialog.close());
document.querySelector('#lightbox-prev').addEventListener('click', () => { if (lightboxIndex > 0) showLightbox(lightboxIndex - 1); });
document.querySelector('#lightbox-next').addEventListener('click', () => { if (lightboxIndex < archiveVisible.length - 1) showLightbox(lightboxIndex + 1); });
archiveDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && lightboxIndex > 0) { event.preventDefault(); showLightbox(lightboxIndex - 1); }
  if (event.key === 'ArrowRight' && lightboxIndex < archiveVisible.length - 1) { event.preventDefault(); showLightbox(lightboxIndex + 1); }
});
archiveDialog.addEventListener('click', (event) => {
  const bounds = archiveDialog.getBoundingClientRect();
  if (event.target === archiveDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) archiveDialog.close();
});
archiveDialog.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  lightboxTrigger?.focus();
});
loadArchive();
