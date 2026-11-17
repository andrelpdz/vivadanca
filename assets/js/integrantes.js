const grid = document.querySelector('#cast-grid');
const statusText = document.querySelector('#cast-status');
const countText = document.querySelector('#cast-count');
const searchInput = document.querySelector('#cast-search');
const retryButton = document.querySelector('#cast-retry');

let members = [];
let loaded = false;

const normalizeName = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

function memberPhoto(member) {
  return member.foto ? `../assets/integrantes/${encodeURIComponent(String(member.foto).split(/[\\/]/).pop())}` : '../assets/img/logo.png';
}

function setPhoto(image, member) {
  image.alt = member.nome;
  image.src = memberPhoto(member);
  image.addEventListener('error', () => {
    image.src = '../assets/img/logo.png';
    image.alt = `Viva Dança — ${member.nome}`;
    image.style.objectFit = 'contain';
  }, { once: true });
}


function renderMembers() {
  if (!loaded) return;
  const query = normalizeName(searchInput.value.trim());
  const visible = members.filter((member) => normalizeName(member.nome).includes(query));
  grid.replaceChildren();
  countText.textContent = `${visible.length} ${visible.length === 1 ? 'integrante' : 'integrantes'}`;
  statusText.hidden = visible.length > 0;
  statusText.textContent = members.length === 0 ? 'Ainda não há integrantes disponíveis para exibir.' : 'Nenhum integrante encontrado. Experimente outro nome.';
  visible.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'cast-card';
    const button = document.createElement('a');
    button.href = `integrante.html?id=${encodeURIComponent(member.id)}`;
    button.setAttribute('aria-label', `Conhecer ${member.nome}`);

    const photo = document.createElement('img');
    photo.loading = 'lazy';
    photo.width = 450;
    photo.height = 600;
    setPhoto(photo, member);
    const caption = document.createElement('div');
    caption.className = 'cast-card-caption';
    const label = document.createElement('span');
    label.className = 'eyebrow';
    label.textContent = 'Viva Dança';
    const name = document.createElement('h3');
    name.textContent = member.nome;
    const arrow = document.createElement('span');
    arrow.className = 'cast-card-arrow';
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    caption.append(label, name, arrow);
    button.append(photo, caption);

    card.append(button);
    if (member.descricao) {
      const description = document.createElement('p');
      description.textContent = member.descricao;
      card.append(description);
    }
    grid.append(card);
  });
}

async function loadMembers() {
  loaded = false;
  grid.setAttribute('aria-busy', 'true');
  statusText.hidden = false;
  statusText.textContent = 'Carregando os integrantes…';
  retryButton.hidden = true;
  try {
    const response = await fetch('../backend/api_integrante.php', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha ao consultar integrantes');
    const data = await response.json();
    if (!data.sucesso || !Array.isArray(data.integrantes)) throw new Error('Resposta inválida');
    members = data.integrantes.filter((member) => member && typeof member.nome === 'string' && member.nome.trim() && (member.ativo == null || String(member.ativo) === '1' || member.ativo === true));
    loaded = true;
    renderMembers();
  } catch {
    statusText.textContent = 'Não foi possível carregar os integrantes. Verifique se o servidor e o banco de dados estão disponíveis e tente novamente.';
    retryButton.hidden = false;
    countText.textContent = '';
  } finally {
    grid.setAttribute('aria-busy', 'false');
  }
}

searchInput.addEventListener('input', renderMembers);
retryButton.addEventListener('click', loadMembers);
loadMembers();
