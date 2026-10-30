//-> Controle Menu
const icoMenu = document.querySelector("#icoMenu");
const nav = document.querySelector("nav");
icoMenu.addEventListener("mousemove", () => {
    nav.classList.toggle("ativo");
});

//-> Controle Agenda
// Cada evento da agenda é um "objeto" dentro da lista (os dois últimos são exemplos, troque pelos reais)
const eventos = [
    { dia: "09", mes: "Nov", ano: "2026", hora: "18:00", local: "Sesc", cidade: "Sorocaba-SP", rua: "R. Barão de Piratininga, 555" },
    { dia: "21", mes: "Nov", ano: "2026", hora: "19:30", local: "Teatro Exemplo", cidade: "Votorantim-SP", rua: "Rua Exemplo, 100" },
    { dia: "05", mes: "Dez", ano: "2026", hora: "20:00", local: "Praça Exemplo", cidade: "Itu-SP", rua: "Av. Exemplo, 250" }
];
let eventoAtual = 0; // posição do evento que está aparecendo (0 = o primeiro)

const agendaInfo = document.querySelector(".agenda-info");
const agendaData = document.querySelector(".agenda-data");
const agendaDescricao = document.querySelector(".agenda-descricao");

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

document.querySelector("#agendaBtDir").addEventListener("click", () => {
    eventoAtual = (eventoAtual + 1) % eventos.length; // avança e volta ao início no fim
    trocarEvento();
});
document.querySelector("#agendaBtEsq").addEventListener("click", () => {
    eventoAtual = (eventoAtual - 1 + eventos.length) % eventos.length; // volta e vai ao fim no início
    trocarEvento();
});

//-> Controle Por trás do palco
// Caminho relativo à PÁGINA (não ao CSS), por isso é "assets/img/..." e não "../img/..."
// Troque pelas 6 fotos reais da equipe
const fotos = [
    "assets/img/banner.png",
    "assets/img/banner2.png",
    "assets/img/banner3.png",
    "assets/img/banner4.png",
    "assets/img/banner5.png",
    "assets/img/banner6.png"
];
let fotoAtual = 0;

const palcoFoto = document.querySelector(".palco-foto");
const palcoContador = document.querySelector(".palco-controles span");

function trocarFoto() {
    palcoFoto.classList.add("some");
    setTimeout(() => {
        palcoFoto.style.backgroundImage = `url(${fotos[fotoAtual]})`;
        palcoContador.textContent = `${fotoAtual + 1}/${fotos.length}`;
        palcoFoto.classList.remove("some");
    }, 300);
}

document.querySelector("#palcoBtDir").addEventListener("click", () => {
    fotoAtual = (fotoAtual + 1) % fotos.length;
    trocarFoto();
});
document.querySelector("#palcoBtEsq").addEventListener("click", () => {
    fotoAtual = (fotoAtual - 1 + fotos.length) % fotos.length;
    trocarFoto();
});