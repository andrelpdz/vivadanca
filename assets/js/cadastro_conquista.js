
function definirConquista(conquista){
    const foto = document.getElementById("foto");
    const nome = document.getElementById("nome");
    const descricao = document.getElementById("descricao");
    foto.src = "../assets/conquistas/" + conquista.foto;
    nome.textContent = conquista.nome;
    descricao.textContent = conquista.descricao;
}

function criarCardConquista(conquista){
    const div = document.createElement('div');
    const img = document.createElement('img');
    const data = document.createElement('p');
    const nomeEvento = document.createElement('p');
    const local = document.createElement('p');
    const nomeConquista = document.createElement('p');

    img.src = "../assets/conquistas/" + conquista.foto;
    img.width=50;
    img.height=50;
    data.textContent = conquista.data_inicio;
    nomeEvento.textContent = conquista.nome_evento;
    local.textContent = "Sorocaba";
    nomeConquista.textContent = conquista.nome;

    div.append(img, data, nomeEvento, local, nomeConquista);
    return div;
}

function criarCardConquista(conquista){
    const div = document.createElement('div');
    const img = document.createElement('img');
    const nome = document.createElement('p');
    const data = document.createElement('p');

    // img.src = "../assets/conquistas/" + conquista.foto;
    // img.width=50;
    // img.height=50;
    data.textContent = conquista.data_criacao;
    nome.textContent = conquista.titulo;
    div.append(img, nome, data);
    return div;
}

function criarCardAdmin(conquista){
    const card = `
    <div>
        <img src="../assets/conquistas/${conquista.foto}" alt="" width=200 height=200>
        <p>${conquista.nome}</p>
        <span>
            <button onclick="editarFormulario('${conquista.id}', '${conquista.nome}', '${conquista.descricao}', '${conquista.foto}', '${conquista.ativo}')">Editar</button>
            <button onclick="excluirConquista(${conquista.id})" >Excluir</button>
        </span>
    </div>
    `;

    return card;
}

function editarFormulario(id, nome, descricao, foto, ativo){
    const campo_id = document.getElementById("id");
    const campo_nome = document.getElementById("nome");
    const campo_descricao = document.getElementById("descricao");
    const campo_foto = document.getElementById("foto");
    const campo_ativo = document.getElementById("ativo");
    const btn = document.getElementById("btnEnviar");

    campo_id.value = id;
    campo_nome.value = nome;
    campo_descricao.value = descricao;
    campo_ativo.checked = ativo;
    btn.value = "Atualizar";
}

async function popularCardsConquistaAdmin(){
    sectionConquista = document.getElementById("conquista");
    const dados = await carregarConquistas();

    dados.conquista.forEach((conquista)=>{
        sectionConquista.innerHTML += criarCardAdmin(conquista);
    });

}


// FUNCOES PARA CARREGAR OS DADOS
async function carregarConquistas(){
    try {
        const resposta = await fetch(
            "../backend/conquista.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "conquista":[] };
    }
    
}

async function carregarConquista(){
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    try {
        const resposta = await fetch(
            "../backend/conquista.php?id="+encodeURIComponent(id), 
            { headers:{"Accept": "application/json"}}
        );

        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        definirConquista(dados.conquista);

        dados.coreografias.forEach((coreografia)=>{
            sectionCoreografias.append( criarCardCoreografia(coreografia) );
        });

        dados.conquistas.forEach((conquista)=>{
            sectionConquistas.append( criarCardConquista(conquista) );
        });

        
    }catch(error) {
        console.log(error);
    }
    
}

async function excluirConquista(id){
    const resposta = await fetch(`../backend/conquista.php?id=${id}`,{
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (!resposta.ok || !dados.sucesso){
        console.log("Erro ao excluir o integrante!");
        return;
    }
    location.reload();
}


