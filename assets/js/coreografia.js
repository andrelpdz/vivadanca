function criarCard(coreografia){
    return `
    <div>
        <h3>${coreografia.titulo} (${coreografia.modalidade})</h3>
        <p>${coreografia.descricao}</p>
        <span>
            <button onclick="editarFormulario('${coreografia.id}', '${coreografia.titulo}', '${coreografia.descricao}', '${coreografia.data_criacao}', '${coreografia.modalidade}')">Editar</button>
            <button onclick="excluirCoreografia(${coreografia.id})">Excluir</button>
        </span>
    </div>
    `;
}

function editarFormulario(id, titulo, descricao, data_criacao, modalidade){
    document.getElementById("id").value = id;
    document.getElementById("titulo").value = titulo;
    document.getElementById("descricao").value = descricao;
    document.getElementById("data_criacao").value = data_criacao;
    document.getElementById("modalidade").value = modalidade;
    document.getElementById("btnEnviar").value = "Atualizar";
}

async function popularCards(){
    const container = document.getElementById("coreografias");
    const dados = await carregarLista();
    dados.coreografias.forEach((c) => {
        container.innerHTML += criarCard(c);
    });
}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_coreografia.php", { headers: {"Accept": "application/json"} });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "coreografias": [] };
    } catch(error) {
        console.log(error);
        return { "coreografias": [] };
    }
}

async function excluirCoreografia(id){
    const resposta = await fetch(`../backend/api_coreografia.php?id=${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (resposta.ok && dados.sucesso) location.reload();
}