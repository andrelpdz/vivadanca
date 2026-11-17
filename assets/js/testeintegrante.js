const memberId = new URLSearchParams(window.location.search).get('id');
const profileStatus = document.querySelector('#profile-status');
const profileRetry = document.querySelector('#profile-retry');
const profileSection = document.querySelector('#member-profile');
const workSection = document.querySelector('#member-work');

function formattedDate(value) {
  if (!value) return '';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match && match[1] !== '0000' ? `${match[3]}/${match[2]}/${match[1]}` : '';
}

function renderWork(target, items, type) {
  target.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'work-empty';
    empty.textContent = type === 'choreography' ? 'Ainda não há coreografias vinculadas a este integrante.' : 'Ainda não há conquistas vinculadas a este integrante.';
    target.append(empty);
    return;
  }
  items.forEach((item, index) => {
    const row = document.createElement('article');
    row.className = 'work-row';
    const number = document.createElement('span');
    number.className = 'work-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    const name = document.createElement('h4');
    name.textContent = (type === 'choreography' ? item.titulo : item.nome) || 'Registro do acervo';
    if (type === 'choreography' && item.id != null) {
      const link = document.createElement('a');
      link.href = `testecoreografias.html?id=${encodeURIComponent(item.id)}#acervo`;
      link.textContent = name.textContent + ' ↗';
      name.replaceChildren(link);
    }
    content.append(name);
    if (type === 'achievement' && item.nome_evento) {
      const event = document.createElement('p');
      event.textContent = item.nome_evento;
      content.append(event);
    }
    row.append(number, content);
    const rawDate = type === 'choreography' ? item.data_criacao : item.data_inicio;
    const date = formattedDate(rawDate);
    if (date) {
      const time = document.createElement('time');
      time.className = 'work-date';
      time.dateTime = String(rawDate).slice(0, 10);
      time.textContent = date;
      row.append(time);
    }
    target.append(row);
  });
}

async function loadProfile() {
  profileRetry.hidden = true;
  profileStatus.hidden = false;
  profileSection.hidden = true;
  workSection.hidden = true;
  if (!memberId || !/^[1-9]\d*$/.test(memberId)) {
    profileStatus.textContent = 'Escolha um integrante na listagem para conhecer sua história.';
    return;
  }
  profileStatus.textContent = 'Carregando a história deste integrante…';
  profileSection.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(`../backend/obter_integrante.php?id=${encodeURIComponent(memberId)}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha na consulta');
    const data = await response.json();
    if (!data.sucesso) throw new Error('Resposta inválida');
    const member = data.integrante;
    if (!member || typeof member.nome !== 'string') {
      profileStatus.textContent = 'Este integrante não foi encontrado. Volte à listagem para escolher outro perfil.';
      return;
    }
    document.title = `${member.nome} — Viva Dança`;
    document.querySelector('#member-name').textContent = member.nome;
    document.querySelector('#breadcrumb-name').textContent = member.nome;
    document.querySelector('#member-description').textContent = member.descricao || 'Integrante do Viva Dança Sorocaba 60+. Sua história faz parte do movimento que construímos juntos.';
    const photo = document.querySelector('#member-photo');
    photo.alt = member.nome;
    photo.onerror = () => {
      photo.onerror = null;
      photo.src = '../assets/img/logo.png';
      photo.style.objectFit = 'contain';
      photo.alt = `Viva Dança — ${member.nome}`;
    };
    photo.src = member.foto ? `../assets/integrantes/${encodeURIComponent(String(member.foto).split(/[\\/]/).pop())}` : '../assets/img/logo.png';
    const choreographies = Array.isArray(data.coreografias) ? data.coreografias.filter(Boolean) : [];
    const achievements = Array.isArray(data.conquistas) ? data.conquistas.filter(Boolean) : [];
    document.querySelector('#choreography-count').textContent = `(${choreographies.length})`;
    document.querySelector('#achievement-count').textContent = `(${achievements.length})`;
    renderWork(document.querySelector('#choreographies-list'), choreographies, 'choreography');
    renderWork(document.querySelector('#achievements-list'), achievements, 'achievement');
    profileStatus.hidden = true;
    profileSection.hidden = false;
    workSection.hidden = false;
  } catch {
    profileStatus.textContent = 'Não foi possível carregar este perfil. Tente novamente em instantes ou volte à listagem de integrantes.';
    profileRetry.hidden = false;
  } finally {
    profileSection.setAttribute('aria-busy', 'false');
  }
}
profileRetry.addEventListener('click', loadProfile);
loadProfile();
