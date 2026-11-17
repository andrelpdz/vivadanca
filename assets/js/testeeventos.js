const eventList = document.querySelector('#events-list');
const eventStatus = document.querySelector('#events-status');
const eventCount = document.querySelector('#events-count');
const eventRetry = document.querySelector('#events-retry');
const eventSearch = document.querySelector('#event-search');
const eventCity = document.querySelector('#event-city');
const eventYear = document.querySelector('#event-year');
const eventSort = document.querySelector('#event-sort');
let agendaEvents = [];
let period = 'upcoming';
let eventsLoaded = false;
const normalizeEvent = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const saoPauloDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).reduce((parts, part) => ({ ...parts, [part.type]: part.value }), {});

function dateKey(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[ T])/);
  if (!match || match[1] === '0000') return '';
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`);
  const key = `${match[1]}-${match[2]}-${match[3]}`;
  return Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== key ? '' : key;
}

function readableDate(value) {
  const key = dateKey(value);
  return key ? key.split('-').reverse().join('/') : 'A confirmar';
}

function addFact(list, label, value) {
  if (!value) return;
  const item = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = label;
  description.textContent = value;
  item.append(term, description);
  list.append(item);
}

function createEvent(event) {
  const entry = document.createElement('details');
  entry.className = 'event-entry';
  const summary = document.createElement('summary');
  summary.className = 'event-summary';
  const date = document.createElement(event.startKey ? 'time' : 'div');
  date.className = 'event-date';
  const day = document.createElement('span');
  day.className = 'event-day';
  day.textContent = event.startKey ? event.startKey.slice(8) : '—';
  const month = document.createElement('span');
  month.className = 'event-month';
  if (event.startKey) {
    date.dateTime = event.startKey;
    const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(new Date(`${event.startKey}T12:00:00Z`)).replace('.', '');
    month.append(document.createTextNode(monthName), document.createElement('br'), document.createTextNode(event.startKey.slice(0, 4)));
  } else month.textContent = 'Data a confirmar';
  date.append(day, month);
  const heading = document.createElement('div');
  const title = document.createElement('h4');
  title.textContent = event.nome || 'Encontro do Viva Dança';
  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = [event.cidade, event.local].filter(Boolean).join(' · ') || 'Local a confirmar';
  heading.append(title, meta);
  const arrow = document.createElement('span');
  arrow.className = 'event-arrow';
  arrow.textContent = '+';
  arrow.setAttribute('aria-hidden', 'true');
  summary.append(date, heading, arrow);
  const content = document.createElement('div');
  content.className = 'event-details';
  const description = document.createElement('p');
  description.textContent = event.descricao || 'Mais informações sobre este encontro serão divulgadas pelo grupo.';
  const facts = document.createElement('dl');
  facts.className = 'event-facts';
  addFact(facts, 'Data', readableDate(event.data_inicio));
  if (event.endKey && event.endKey !== event.startKey) addFact(facts, 'Até', readableDate(event.data_termino));
  addFact(facts, 'Cidade', event.cidade);
  addFact(facts, 'Local', event.local);
  content.append(description, facts);
  entry.append(summary, content);
  return entry;
}

function renderEvents() {
  if (!eventsLoaded) return;
  const current = saoPauloDate();
  const today = `${current.year}-${current.month}-${current.day}`;
  const query = normalizeEvent(eventSearch.value.trim());
  const visible = agendaEvents.filter((event) => {
    const isPast = Boolean(event.endKey || event.startKey) && (event.endKey || event.startKey) < today;
    return (period === 'past' ? isPast : !isPast)
      && (!eventCity.value || event.cidade === eventCity.value)
      && (!eventYear.value || event.startKey.slice(0, 4) === eventYear.value)
      && normalizeEvent([event.nome, event.descricao, event.cidade, event.local].join(' ')).includes(query);
  }).sort((a, b) => {
    if (!a.startKey) return b.startKey ? 1 : 0;
    if (!b.startKey) return -1;
    return eventSort.value === 'nearest' ? a.startKey.localeCompare(b.startKey) : b.startKey.localeCompare(a.startKey);
  });
  eventList.replaceChildren(...visible.map(createEvent));
  eventCount.textContent = `${visible.length} ${visible.length === 1 ? 'evento' : 'eventos'}`;
  eventStatus.hidden = visible.length > 0;
  const filtered = query || eventCity.value || eventYear.value;
  eventStatus.textContent = filtered ? 'Nenhum evento corresponde a estes filtros. Experimente outra busca.' : period === 'past' ? 'Ainda não há eventos anteriores cadastrados.' : 'Novos encontros serão anunciados por aqui. Acompanhe a programação em breve.';
}

async function loadEvents() {
  eventsLoaded = false;
  eventList.setAttribute('aria-busy', 'true');
  eventStatus.hidden = false;
  eventStatus.textContent = 'Carregando a programação…';
  eventRetry.hidden = true;
  try {
    const response = await fetch('../backend/api_evento.php', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha na consulta');
    const data = await response.json();
    if (!data.sucesso || !Array.isArray(data.eventos)) throw new Error('Resposta inválida');
    agendaEvents = data.eventos.filter((event) => event && typeof event === 'object').map((event) => ({ ...event, startKey: dateKey(event.data_inicio), endKey: dateKey(event.data_termino) }));
    for (const [select, values] of [[eventCity, [...new Set(agendaEvents.map((event) => event.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))], [eventYear, [...new Set(agendaEvents.map((event) => event.startKey.slice(0, 4)).filter(Boolean))].sort().reverse()]]) {
      select.replaceChildren(select.options[0]);
      values.forEach((value) => select.add(new Option(value, value)));
    }
    eventsLoaded = true;
    renderEvents();
  } catch {
    eventStatus.textContent = 'Não foi possível carregar a programação. Tente novamente em instantes.';
    eventRetry.hidden = false;
  } finally {
    eventList.setAttribute('aria-busy', 'false');
  }
}

document.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => {
  period = button.dataset.period;
  document.querySelectorAll('[data-period]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#period-title').textContent = button.textContent;
  eventSort.value = period === 'past' ? 'latest' : 'nearest';
  renderEvents();
}));
eventSearch.addEventListener('input', renderEvents);
[eventCity, eventYear, eventSort].forEach((select) => select.addEventListener('change', renderEvents));
eventRetry.addEventListener('click', loadEvents);
loadEvents();
