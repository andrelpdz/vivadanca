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