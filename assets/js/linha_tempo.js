async function popularCardsLinha_tempoAdmin(){
    const sectionlinha_tempo = document.getElementById("linha_tempo");
    const dados = await carregarLinha_tempo();
    console.log(dados.linha_tempo);
    dados.linha_tempo.forEach((linha_tempo)=>{
        sectionlinha_tempo.innerHTML += criarCardAdmin(linha_tempo);
    });
}


// FUNCOES PARA CARREGAR OS DADOS
async function carregarLinha_tempo(){
    try {
        const resposta = await fetch(
            "../backend/linha_tempo.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "linha_tempo":[] };
    }
    
}


function criarCardAdmin(linha_tempo){
    const card = `
    <div>
        <img src="../assets/linha_tempo/${linha_tempo.foto}" alt="" width=200 height=200>
        <p>${linha_tempo.descricao}</p>
        <span>
            ${linha_tempo.data}
            <button onclick="editarFormulario('${linha_tempo.id}', '${linha_tempo.data}', '${linha_tempo.descricao}', '${linha_tempo.foto}',)">Editar</button>
            <button onclick="excluirLinha_tempo(${linha_tempo.id})" >Excluir</button> 
        </span>
    </div>
    `;

    return card;
}
function editarFormulario(id, ano, descricao, foto){
    const campo_id = document.getElementById("id");
    const campo_ano = document.getElementById("ano");
    const campo_descricao = document.getElementById("descricao");
    const campo_foto = document.getElementById("foto");
    const btn = document.getElementById("btnEnviar");

    campo_id.value = id;
    campo_ano.value = ano;
    campo_descricao.value = descricao;
    //campo_foto.value = foto;

    btn.value = "Atualizar";
}
async function excluirLinha_tempo(id){
    const resposta = await fetch(`../backend/linha_tempo.php?id=${id}`,{
        method: "DELETE",
        headers: {"Accept": "application/json"},
    });
    const dados = await resposta.json();
    if (!resposta.ok || !dados.sucesso){
        console.log("Erro ao excluir o Linha do tempo");
        return;
    }
    location.reload();
}