function criarCard(item){
    return `
    <div>
        <img src="../assets/conquistas/${item.foto}" alt="" width=200 height=200>
        <h3>${item.nome}</h3>
        <p>Evento ID: ${item.evento_id} | Coreografia ID: ${item.coreografia_id}</p>
        <span>
            <button onclick="editarFormulario('${item.id}', '${item.evento_id}', '${item.coreografia_id}', '${item.nome}', '${item.descricao}')">Editar</button>
            <button onclick="excluirConquista(${item.id})">Excluir</button>
        </span>
    </div>
    `;
}

function editarFormulario(id, evento_id, coreografia_id, nome, descricao){
    document.getElementById("id").value = id;
    document.getElementById("evento_id").value = evento_id;
    document.getElementById("coreografia_id").value = coreografia_id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("btnEnviar").value = "Atualizar";
}

async function popularCards(){
    const container = document.getElementById("conquistas");
    const dados = await carregarLista();
    dados.conquistas.forEach((item) => {
        container.innerHTML += criarCard(item);
    });
}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_conquista.php", { headers: {"Accept": "application/json"} });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "conquistas": [] };
    } catch(error) {
        console.log(error);
        return { "conquistas": [] };
    }
}

async function excluirConquista(id){
    const resposta = await fetch(`../backend/api_conquista.php?id=${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (resposta.ok && dados.sucesso) location.reload();
}