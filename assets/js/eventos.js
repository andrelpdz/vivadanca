let listaEventos = [];

async function popularCardsEventosAdmin() {
    const sectionEventos = document.getElementById("eventos");
    const dados = await carregarEventos();

    listaEventos = dados.eventos;

    sectionEventos.innerHTML = "";

    dados.eventos.forEach((evento) => {
        sectionEventos.innerHTML += criarCardAdmin(evento);
    });
    lucide.createIcons();
}

function criarCardAdmin(evento) {
    const card = `
    <div class="card-evento">

        <h3>${evento.nome}</h3>
        <p class="tipo-evento">${evento.descricao}</p>

        <hr>

        <p><i data-lucide="calendar-days"></i> <strong>Data de início</strong><br>
        ${formatarData(evento.data_inicio)}</p>

        <p><i data-lucide="calendar-check"></i> <strong>Data de término</strong><br>
        ${formatarData(evento.data_termino)}</p>

        <p><i data-lucide="map-pin"></i> <strong>Localização</strong><br>
        ${evento.cidade} - ${evento.local}</p>

        <p><i data-lucide="trophy"></i> <strong>Premiação</strong><br>
        ${evento.premiacao}</p>

        <span>
            <button type="button"
                onclick="editarFormulario('${evento.id}')">
                Editar
            </button>

            <button type="button"
                onclick="excluirEvento(${evento.id})">
                Excluir
            </button>
        </span>

    </div>
    `;

    return card;
}

function formatarData(data) {
    if (!data) return "";

    const partes = data.replace("T", " ").split(" ");
    const dia = partes[0].split("-").reverse().join("/");
    const hora = partes[1] ? partes[1].substring(0, 5) : "";

    return dia + (hora ? " às " + hora : "");
}

async function carregarEventos(){
    try {
        const resposta = await fetch(
            "../backend/evento.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "eventos":[] };
    }
    
}
function editarFormulario(id) {
    const evento = listaEventos.find(e => String(e.id) === String(id));

    if (!evento) return;

    document.getElementById("id").value = evento.id;
    document.getElementById("nome").value = evento.nome;
    document.getElementById("descricao").value = evento.descricao;

    document.getElementById("data_inicio").value =
        evento.data_inicio.replace(" ", "T").substring(0, 16);

    document.getElementById("data_termino").value =
        evento.data_termino.replace(" ", "T").substring(0, 16);

    document.getElementById("cidade").value = evento.cidade;
    document.getElementById("local").value = evento.local;
    document.getElementById("premiacao").value = evento.premiacao;

    document.getElementById("btnEnviar").textContent = "Atualizar Evento";

    document.getElementById("formEvento").scrollIntoView({
        behavior: "smooth"
    });
}

async function excluirEvento(id){
    const resposta = await fetch(`../backend/evento.php?id=${id}`,{
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (!resposta.ok || !dados.sucesso){
        console.log("Erro ao excluir o evento!");
        return;
    }
    location.reload();
}