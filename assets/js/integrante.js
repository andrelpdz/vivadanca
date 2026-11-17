function criarCard(integrante){
    const card = `
    <div>
        <img src="../assets/integrantes/${integrante.foto}" alt="" width=200 height=200>
        <p>${integrante.nome}</p>
        <span>
            <button onclick="editarFormulario('${integrante.id}', '${integrante.nome}', '${integrante.descricao}', '${integrante.foto}', '${integrante.ativo}')">Editar</button>
            <button onclick="excluirIntegrante(${integrante.id})" >Excluir</button>
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

async function popularCards(){
    sectionIntegrantes = document.getElementById("integrantes");
    const dados = await carregarLista();

    dados.integrantes.forEach((integrante)=>{
        sectionIntegrantes.innerHTML += criarCard(integrante);
    });

}

async function carregarLista(){
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