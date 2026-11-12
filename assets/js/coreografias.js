


function cardCoreografiaAdmin(coreografia){
    const card = `
    <div>
        <p>${coreografia.titulo}</p>
        <span>
            <button data-info='${JSON.stringify(coreografia)}'
                onclick="editarCoreografia(this.dataset.info)">
                Atualizar
            </button>

            <button onclick="excluirCoreografia(${coreografia.id})" >Excluir</button>
        </span>
    </div>
    `;
    return card;
}


function editarCoreografia(coreografia){
    coreografia = JSON.parse(coreografia);

    const btn = document.getElementById("btnEnviar");
    const id = document.getElementById("id");
    const tipo = document.getElementById("tipo");
    const titulo = document.getElementById("titulo");
    const descricao = document.getElementById("descricao");
    const data_criacao = document.getElementById("data_criacao");
    const modalidade = document.getElementById("modalidade");
    const integrantes = document.getElementById("integrantes");
    
    tipo.value = "PUT";
    id.value = coreografia.id;
    titulo.value = coreografia.titulo;
    descricao.value = coreografia.descricao;
    data_criacao.value = coreografia.data_criacao;
    modalidade.value = coreografia.modalidade;
    btn.value = "Atualizar";

    const listaIntegrantes= Array.from(
        document.querySelectorAll('input[name="integrantes"]')
    );
    listaIntegrantes.forEach(item => {
        item.checked = false;
        if (coreografia.integrantes.includes(item.value)){
            item.checked = true;
        }
    });
}




async function popularCoreografiasAdmin(){
    sectionCoreografias = document.getElementById("coreografias");
    var dados = await carregarCoreografias();
    dados.coreografias.forEach((coreografia)=>{
        sectionCoreografias.innerHTML += cardCoreografiaAdmin(coreografia);
    });

    sectionIntegrantes = document.getElementById("integrantes");
    var dados = await carregarIntegrantes();
    dados.integrantes.forEach((integrante)=>{
        var card = `
        <div>
            <input type="checkbox" value="${integrante.id}" name="integrantes">
            <label>${integrante.nome}</label>
        </div>
        `;
        sectionIntegrantes.innerHTML += card;
    });

    // evento para personalizar antes do envio do FORMS
    form = document.getElementById("formCoreografia");
    form.addEventListener("submit", async (event)=>{
        // event.preventDefault();
        const integrantesSelecionado = Array.from(
            document.querySelectorAll('input[name="integrantes"]:checked')
        ).map(input=>Number(input.value));

        const listaIntegrantes = document.getElementById("listaIntegrantes");
        listaIntegrantes.value = integrantesSelecionado;
    });

}


// FUNCOES PARA CARREGAR OS DADOS
async function carregarCoreografias(){
    try {
        const resposta = await fetch(
            "../backend/api_coreografia.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "coreografias":[] };
    }
    
}

async function carregarCoreografia(){
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    try {
        const resposta = await fetch(
            "../backend/api_coreografia.php?id="+encodeURIComponent(id),
            { headers:{"Accept": "application/json"}}
        );

        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
    }
    
}

async function excluirCoreografia(id){
    const resposta = await fetch(`../backend/api_coreografia.php?id=${id}`,{
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (!resposta.ok || !dados.sucesso){
        return;
    }
    location.reload();
}

