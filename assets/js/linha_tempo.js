function criarCard(item){
    return `
    <div>
        <img src="../assets/linha_tempo/${item.foto}" alt="" width=200 height=200>
        <p><strong>Data:</strong> ${item.data}</p>
        <p>${item.descricao}</p>
        <span>
            <button onclick="editarFormulario('${item.id}', '${item.descricao}', '${item.data}')">Editar</button>
            <button onclick="excluirLinhaTempo(${item.id})">Excluir</button>
        </span>
    </div>
    `;
}

function editarFormulario(id, descricao, data){
    document.getElementById("id").value = id;
    document.getElementById("descricao").value = descricao;
    document.getElementById("data").value = data;
    document.getElementById("btnEnviar").value = "Atualizar";
}

async function popularCards(){
    const container = document.getElementById("linha_tempo");
    const dados = await carregarLista();
    dados.linha_tempo.forEach((item) => {
        container.innerHTML += criarCard(item);
    });
}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_linha_tempo.php", { headers: {"Accept": "application/json"} });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "linha_tempo": [] };
    } catch(error) {
        console.log(error);
        return { "linha_tempo": [] };
    }
}

async function excluirLinhaTempo(id){
    const resposta = await fetch(`../backend/api_linha_tempo.php?id=${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (resposta.ok && dados.sucesso) location.reload();
}