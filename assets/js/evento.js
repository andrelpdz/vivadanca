function criarCard(evento){
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
        ${evento.premiacao || 'Nenhuma'}</p>

        <span>
            <button type="button"
                onclick='editarFormulario(${JSON.stringify(evento)})'>
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

function formatarData(dataStr) {
    if (!dataStr) return '';
    // Converte de "YYYY-MM-DD HH:mm:ss" para formato amigável brasileiro se necessário
    return dataStr;
}

function editarFormulario(evento){
    document.getElementById("id").value = evento.id;
    document.getElementById("nome").value = evento.nome;
    document.getElementById("descricao").value = evento.descricao;
    
    // Formata o datetime para o input datetime-local (substitui espaço por 'T')
    document.getElementById("data_inicio").value = evento.data_inicio ? evento.data_inicio.replace(' ', 'T') : '';
    document.getElementById("data_termino").value = evento.data_termino ? evento.data_termino.replace(' ', 'T') : '';
    
    document.getElementById("cidade").value = evento.cidade;
    document.getElementById("local").value = evento.local;
    document.getElementById("premiacao").value = evento.premiacao;
    
    const btn = document.getElementById("btnEnviar");
    btn.value = "Atualizar";
    
    // Opcional: rolar a página para o topo onde está o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function popularCards(){
    const container = document.getElementById("eventos");
    if (!container) return;
    container.innerHTML = "";
    const dados = await carregarLista();
    dados.eventos.forEach((evento) => {
        container.innerHTML += criarCard(evento);
    });
    // Se utilizar ícones Lucide no projeto
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_evento.php", { headers: {"Accept": "application/json"} });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "eventos": [] };
    } catch(error) {
        console.log(error);
        return { "eventos": [] };
    }
}

async function excluirEvento(id){
    if(!confirm("Deseja realmente excluir este evento?")) return;
    try {
        const resposta = await fetch(`../backend/api_evento.php?id=${id}`, {
            method: "DELETE",
            headers: {"Accept": "application/json"},
        });
        const dados = await resposta.json();
        if (resposta.ok && dados.sucesso) location.reload();
    } catch(error) {
        console.log(error);
    }
}