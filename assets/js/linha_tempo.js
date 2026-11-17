function popularAnosSelect() {
    const select = document.getElementById("data");
    if (!select) return;
    
    const anoAtual = new Date().getFullYear(); // Pega 2026 (ou o ano corrente)
    for (let ano = anoAtual; ano >= 2000; ano--) {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    }
}

function criarCard(item){
    return `
    <div>
        <img src="../assets/linha_tempo/${item.foto}" alt="" width=200 height=200>
        <p><strong>Ano:</strong> ${item.data}</p>
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
    document.getElementById("data").value = data; // Seleciona automaticamente o ano correspondente no select
    document.getElementById("btnEnviar").value = "Atualizar";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function popularCards(){
    const container = document.getElementById("linha_tempo");
    if (!container) return;
    
    const dados = await carregarLista();
    container.innerHTML = "";
    
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
    if(!confirm("Deseja realmente excluir este item?")) return;
    try {
        const resposta = await fetch(`../backend/api_linha_tempo.php?id=${id}`, {
            method: "DELETE",
            headers: {"Accept": "application/json"},
        });
        const dados = await resposta.json();
        if (resposta.ok && dados.sucesso) location.reload();
    } catch(error) {
        console.log(error);
    }
}