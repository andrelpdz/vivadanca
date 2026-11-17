function criarCard(item){
    return `
    <div>
        <img src="../assets/galeria/${item.foto}" alt="" width=200 height=200>
        <p>${item.descricao}</p>
        <span>
            <button onclick="editarFormulario('${item.id}', '${item.descricao}')">Editar</button>
            <button onclick="excluirGaleria(${item.id})">Excluir</button>
        </span>
    </div>
    `;
}

function editarFormulario(id, descricao){
    document.getElementById("id").value = id;
    document.getElementById("descricao").value = descricao;
    document.getElementById("btnEnviar").value = "Atualizar";
}

async function popularCards(){
    const container = document.getElementById("galeria");
    const dados = await carregarLista();
    dados.galeria.forEach((item) => {
        container.innerHTML += criarCard(item);
    });

}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_galeria.php", { headers: {"Accept": "application/json"} });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "galeria": [] };
    } catch(error) {
        console.log(error);
        return { "galeria": [] };
    }
}

async function excluirGaleria(id){
    const resposta = await fetch(`../backend/api_galeria.php?id=${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (resposta.ok && dados.sucesso) location.reload();
}
