const eventos = [
    { dia: "09", mes: "Nov", ano: "2026", hora: "18:00", local: "Sesc", cidade: "Sorocaba-SP", rua: "R. Barão de Piratininga, 555" },
    { dia: "21", mes: "Nov", ano: "2026", hora: "19:30", local: "Teatro Exemplo", cidade: "Votorantim-SP", rua: "Rua Exemplo, 100" },
    { dia: "05", mes: "Dez", ano: "2026", hora: "20:00", local: "Praça Exemplo", cidade: "Itu-SP", rua: "Av. Exemplo, 250" }
];
let eventoAtual = 0; // posição do evento que está aparecendo (0 = o primeiro)

const agendaInfo = document.querySelector(".agenda-info");
const agendaData = document.querySelector(".agenda-data");
const agendaDescricao = document.querySelector(".agenda-descricao");
const palcoFoto = document.querySelector(".palco-foto");
const palcoContador = document.querySelector(".palco-controles span");

try{
    document.querySelector("#palcoBtDir").addEventListener("click", () => {
        fotoAtual = (fotoAtual + 1) % fotos.length;
        trocarFoto();
    });
    document.querySelector("#palcoBtEsq").addEventListener("click", () => {
        fotoAtual = (fotoAtual - 1 + fotos.length) % fotos.length;
        trocarFoto();
    });  

    document.querySelector("#agendaBtDir").addEventListener("click", () => {
        eventoAtual = (eventoAtual + 1) % eventos.length; // avança e volta ao início no fim
        trocarEvento();
    });
    document.querySelector("#agendaBtEsq").addEventListener("click", () => {
        eventoAtual = (eventoAtual - 1 + eventos.length) % eventos.length; // volta e vai ao fim no início
        trocarEvento();
    });
}catch(erro){
    console.log("Elementos de navegação nao carregados!");
}

function mostrarEvento() {
    const e = eventos[eventoAtual];
    agendaData.innerHTML = `
        <span class="numero">${e.dia}</span> ${e.mes}<br>
        <span class="numero ano">${e.ano}</span><br>
        <span class="numero">${e.hora}</span>hrs`;
    agendaDescricao.innerHTML = `
        ${e.local}<br>
        ${e.cidade}<br>
        <span class="rua">${e.rua}</span>`;
}

// 1) some (fade out) -> 2) troca o conteúdo -> 3) aparece (fade in)
function trocarEvento() {
    agendaInfo.classList.add("some");
    setTimeout(() => {
        mostrarEvento();
        agendaInfo.classList.remove("some");
    }, 300); // 300 = 0.3s, o mesmo tempo da transition no CSS
}
//-> Controle Por trás do palco
// Caminho relativo à PÁGINA (não ao CSS), por isso é "assets/img/..." e não "../img/..."
// Troque pelas 6 fotos reais da equipe
const fotos = [
    "assets/img/palco1.png",
    "assets/img/palco2.png",
    "assets/img/palco3.png",
    "assets/img/palco4.png",
    "assets/img/palco5.png",
    "assets/img/palco6.png"
];
let fotoAtual = 0;


function trocarFoto() {
    palcoFoto.classList.add("some");
    setTimeout(() => {
        palcoFoto.style.backgroundImage = `url(${fotos[fotoAtual]})`;
        palcoContador.textContent = `${fotoAtual + 1}/${fotos.length}`;
        palcoFoto.classList.remove("some");
    }, 300);
}

 
//-> EVENTOS DAS PAGINAS
//-> INTEGRANTES
async function popularIntegrantes(){
    sectionIntegrantes = document.querySelector(".integrantes-galeria");
    const dados = await carregarIntegrantes();
 
    dados.integrantes.forEach((integrante)=>{
        sectionIntegrantes.innerHTML += cardIntegrantes(integrante);
    });
} 
async function carregarIntegrantes(){
    try {
        const resposta = await fetch(
            "backend/api_integrante.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;        
    }catch(error) {
        console.log(error);
        return { "integrantes":[] };
    }    
} 
function cardIntegrantes(integrante){
    const card = `
    <a class="item integrante-link" href="#">
        <div class="foto" style="background-image:url('assets/integrantes/${integrante.foto}');"></div>
        <div class="descricao">${integrante.nome}</div>
    </a>
    `;
    return card;
}

//-> INTEGRANTE - Dados especificos de um integrante
async function dadosIntegrante(id){
    sectionIntegrantes = document.querySelector(".profile-feedback");
    const dados = await carregarIntegrante(id);
    console.log(dados);
    sectionIntegrantes.innerHTML = "";   
    sectionIntegrantes.innerHTML += `<h1>${dados.integrantes.nome}</h1>`;
    sectionIntegrantes.innerHTML += `<img class="perfil" src="../assets/integrantes/${dados.integrantes.foto}" >`; 
    let i = nl2br(dados.integrantes.descricao);
    sectionIntegrantes.innerHTML += `<p>${i}</p>`;
    
} 
async function carregarIntegrante(id){
    try {
        const resposta = await fetch(
            "../backend/api_integrante.php?id="+id,
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;        
    }catch(error) {
        console.log(error);
        return { "integrantes":[] };
    }    
}


//-> COREOGRAFIA
async function popularCoreografias(){
    sectionCoreografias = document.querySelector(".lista-cards");
    const dados = await carregarCoreografias();
    
    dados.coreografias.forEach((coreografia)=>{
        sectionCoreografias.innerHTML += cardCoreografias(coreografia);
    });
} 
async function carregarCoreografias(){
    try {
        const resposta = await fetch(
            "backend/api_coreografia.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;        
    }catch(error) {
        console.log(error);
        return { "coreografias":[] };
    }    
} 
function cardCoreografias(coreografia){
    const card = `
   <div class="card">
                <a href=""><img src="assets/integrantes/Rectangle 34.png" alt="Noite em Paris"></a>
                <div class="corpo">

                    <h3>${coreografia.titulo}</h3>
                    <span class="ano">${coreografia.data_criacao}</span>
                    <p>${coreografia.descricao}</p>
                    <span class="tag">${coreografia.modalidade}</span>
                    <button>></button>
                </div>
            </div>
    
    `;
    return card
}

//-> GALERIA
async function popularGalerias(){
    const sectionGalerias = document.querySelector(".galeria-imagens");
    const dados = await carregarGalerias();

    sectionGalerias.replaceChildren(...dados.galeria.map(cardGalerias));
}
async function carregarGalerias(){
    try {
        const resposta = await fetch(
            "backend/api_galeria.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;        
    }catch(error) {
        console.log(error);
        return { "galeria": [] };
    }    
} 
function cardGalerias(galeria){
    const card = document.createElement("a");
    card.className = "item galeria-link";
    card.href = "#";

    const foto = document.createElement("div");
    foto.className = "foto";
    foto.style.backgroundImage = `url("assets/galeria/${encodeURIComponent(galeria.foto)}")`;
    card.append(foto);

    if (galeria.descricao) {
        const descricao = document.createElement("p");
        descricao.textContent = galeria.descricao;
        card.append(descricao);
    }

    const data = galeria.data_foto;
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const legenda = document.createElement("time");
        legenda.dateTime = data;
        legenda.textContent = data.split("-").reverse().join("/");
        card.append(legenda);
    }

    return card;
}

//-> LINHA DO TEMPO
async function popularLinhaTempo(){
    sectionLinhaTempo = document.querySelector(".linhatempo");
    const dados = await carregarLinhaTempo();

    dados.linha_tempo.forEach((linhatempo)=>{
        sectionLinhaTempo.innerHTML += cardLinhaTempo(linhatempo);
    });
}
async function carregarLinhaTempo(){
    try {
        const resposta = await fetch(
            "backend/api_linha_tempo.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;        
    }catch(error) {
        console.log(error);
        return { "linhatempo": [] };
    }    
} 
function cardLinhaTempo(linhatempo){
    const card = `<li><div>
                    <img src="assets/linha_tempo/${linhatempo.foto}" alt="Imagem Linha do tempo" draggable="false">
                    <p>${linhatempo.data}<br>${linhatempo.descricao}</p>
                </div></li>`;
    return card;
}

function nl2br(str, isXhtml = true) {
    if (typeof str !== 'string') {
        return ''; // Retorna vazio se não for string
    }
    const breakTag = isXhtml ? '<br />' : '<br>';
    // Substitui \r\n, \n ou \r por <br>
    return str.replace(/(\r\n|\n|\r)/g, breakTag);
}

// Listagem e ampliacao compartilhadas pelas paginas publicas.
window.iniciarColecaoPublica = function(config) {
if (!document.querySelector('#collection-grid')) return;
const collectionKind = config.kind;
const settings = config;
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
// Na galeria, o ano representa a data da foto, não a data do cadastro.
const recordYear = (record) => String(collectionKind === 'gallery' ? (record.data_foto || '') : (record.data_criacao || record.data_inicio || record.data || '')).match(/^[1-9]\d{3}/)?.[0] || '';
const archiveImage = (record) => `../assets/${collectionKind === 'gallery' ? 'galeria' : collectionKind === 'choreographies' ? 'coreografias' : 'conquistas'}/${encodeURIComponent(String(record.foto).split(/[\\/]/).pop())}`;

const archiveClear = textNode('button', 'Limpar filtros', 'filter-reset');
archiveClear.type = 'button';
archiveClear.hidden = true;
document.querySelector('.archive-tools').append(archiveClear);
archiveClear.addEventListener('click', () => {
  archiveSearch.value = '';
  archiveYear.value = '';
  renderArchive();
  archiveSearch.focus();
});
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
    const dateMatch = String(record.data_foto || '').match(/^([1-9]\d{3})-(\d{2})-(\d{2})$/);
    if (dateMatch) {
      const date = textNode('time', dateMatch[1], 'lightbox-year');
      date.dateTime = dateMatch[0];
      caption.append(date);
    }
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
    link.href = `coreografias.html?id=${encodeURIComponent(record.id)}#acervo`;
    card.append(link);
  } else if (collectionKind === 'achievements') {
    const details = document.createElement('details');
    details.append(textNode('summary', 'Conheça esta conquista'), textNode('p', record.descricao || 'Reconhecimento ao trabalho coletivo do Viva Dança.'));
    if (record.coreografia_titulo) {
      const link = textNode('a', record.coreografia_titulo + ' ↗', 'text-link');
      link.href = `coreografias.html?id=${encodeURIComponent(record.coreografia_id)}#acervo`;
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
  gallery.href = 'galeria.html';
  card.append(gallery);
  archiveGrid.append(card);
  document.title = `${record.titulo} — Viva Dança`;
}

function renderArchive() {
  if (!archiveReady) return;
  archiveClear.hidden = !archiveSearch.value.trim() && !archiveYear.value;
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
    const response = await fetch(`../backend/${settings.endpoint}`, { cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha na consulta');
    const data = await response.json();
    if (!data.sucesso || !Array.isArray(data[settings.key])) throw new Error('Resposta inválida');
    let records = data[settings.key].filter((record) => record && typeof record === 'object');
    if (collectionKind === 'achievements' && records.length) {
      // Usa as datas dos eventos existentes sem alterar o cadastro de conquistas.
      try {
        const eventsResponse = await fetch('../backend/api_evento.php', { cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          if (eventsData.sucesso && Array.isArray(eventsData.eventos)) {
            const eventsById = new Map(eventsData.eventos.map((event) => [String(event.id), event]));
            records = records.map((record) => {
              const event = eventsById.get(String(record.evento_id));
              return event ? { ...record, data_inicio: record.data_inicio || event.data_inicio, cidade: record.cidade || event.cidade } : record;
            });
          }
        }
      } catch { /* Os cards continuam disponíveis se a consulta complementar falhar. */ }
    }
    archiveRecords = records.sort((a, b) => recordYear(b).localeCompare(recordYear(a)));
    const years = [...new Set(archiveRecords.map(recordYear).filter(Boolean))].sort().reverse();
    archiveYear.replaceChildren(new Option('Todos os anos', ''));
    years.forEach((year) => archiveYear.add(new Option(year, year)));
    archiveYear.disabled = years.length === 0;
    archiveYear.closest('label').hidden = years.length === 0;
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
};
