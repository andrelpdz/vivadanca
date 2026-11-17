function criarCard(evento){
    return `
    <div>
        <h3>${evento.nome}</h3>
        <p>${evento.cidade} - ${evento.local}</p>
        <span>
            <button onclick="editarFormulario('${evento.id}', '${evento.nome}', '${evento.descricao}', '${evento.data_inicio}', '${evento.data_termino}', '${evento.cidade}', '${evento.local}', '${evento.premiacao}')">Editar</button>
            <button onclick="excluirEvento(${evento.id})">Excluir</button>
        </span>
    </div>
    `;
}

function editarFormulario(id, nome, descricao, data_inicio, data_termino, cidade, local, premiacao){
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("data_inicio").value = data_inicio;
    document.getElementById("data_termino").value = data_termino;
    document.getElementById("cidade").value = cidade;
    document.getElementById("local").value = local;
    document.getElementById("premiacao").value = premiacao;
    document.getElementById("btnEnviar").value = "Atualizar";
}

async function popularCards(){
    const container = document.getElementById("eventos");
    const dados = await carregarLista();
    dados.eventos.forEach((evento) => {
        container.innerHTML += criarCard(evento);
    });
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
    const resposta = await fetch(`../backend/api_evento.php?id=${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (resposta.ok && dados.sucesso) location.reload();
}