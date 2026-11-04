// const sectionCoreografias = document.getElementById("Coreografias");
// const sectionConquistas = document.getElementById("Conquistas");


function definirIntegrante(integrante){
    const foto = document.getElementById("foto");
    const nome = document.getElementById("nome");
    const descricao = document.getElementById("descricao");
    foto.src = "../assets/integrantes/" + integrante.foto;
    nome.textContent = integrante.nome;
    descricao.textContent = integrante.descricao;
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

function criarCardCoreografia(coreografia){
    const div = document.createElement('div');
    const img = document.createElement('img');
    const nome = document.createElement('p');
    const data = document.createElement('p');

    // img.src = "../assets/conquistas/" + conquista.foto;
    // img.width=50;
    // img.height=50;
    data.textContent = coreografia.data_criacao;
    nome.textContent = coreografia.titulo;
    div.append(img, nome, data);
    return div;
}

function criarCardAdmin(integrante){
    const card = `
    <div>
        <img src="../assets/integrantes/${integrante.foto}" alt="" width=200 height=200>
        <p>${integrante.nome}</p>
        <span>
            <button onclick="editarFormulario('${integrante.id}', '${integrante.nome}', '${integrante.descricao}', '${integrante.foto}')">Editar</button>
            <button onclick="excluirIntegrante(${integrante.id})" >Excluir</button>
        </span>
    </div>
    `;

    return card;
}

function editarFormulario(id, nome, descricao, foto){
    const campo_id = document.getElementById("id");
    const campo_nome = document.getElementById("nome");
    const campo_descricao = document.getElementById("descricao");
    const campo_foto = document.getElementById("foto");
    const btn = document.getElementById("btnEnviar");

    campo_id.value = id;
    campo_nome.value = nome;
    campo_descricao.value = descricao;
    btn.value = "Atualizar";
}




async function popularCardsIntegrantesAdmin(){
    sectionIntegrantes = document.getElementById("integrantes");
    const dados = await carregarIntegrantes();

    dados.integrantes.forEach((integrante)=>{
        sectionIntegrantes.innerHTML += criarCardAdmin(integrante);
    });

}


// FUNCOES PARA CARREGAR OS DADOS
async function carregarIntegrantes(){
    try {
        const resposta = await fetch(
            "../backend/api_integrante.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "integrantes":[] };
    }
    
}

async function carregarIntegrante(){
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    try {
        const resposta = await fetch(
            "../backend/obter_integrante.php?id="+encodeURIComponent(id),
            { headers:{"Accept": "application/json"}}
        );

        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        definirIntegrante(dados.integrante);

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

async function excluirIntegrante(id){
    const resposta = await fetch(`../backend/api_integrante.php?id=${id}`,{
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


