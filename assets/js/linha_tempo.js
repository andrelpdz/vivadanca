async function popularCardsLinha_tempoAdmin(){
    const sectionlinha_tempo = document.getElementById("linha_tempo");
    const dados = await carregarLinha_tempo();

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
        <img src="../assets/integrantes/${linha_tempo.foto}" alt="" width=200 height=200>
        <p>${linha_tempo.descricao}</p>
        <span>
            ${linha_tempo.data}
        </span>
    </div>
    `;

    return card;
}