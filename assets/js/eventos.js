async function popularCardsEventosAdmin(){
    sectionEventos = document.getElementById("eventos");
    const dados = await carregarEventos();

    dados.eventos.forEach((evento)=>{
        sectionEventos.innerHTML += criarCardAdmin(evento);
    });

}

function criarCardAdmin(evento){
    const card = `
    <div>
        <img src="../assets/eventos/${evento.foto}" alt="" width=200 height=200>
        <p>${evento.nome}</p>
        <span>
            <button onclick="editarFormulario('${evento.id}', '${evento.nome}', '${evento.descricao}', '${evento.foto}')">Editar</button>
            <button onclick="excluirEvento(${evento.id})" >Excluir</button>
        </span>
    </div>
    `;

    return card;
}

async function carregarEventos(){
    try {
        const resposta = await fetch(
            "../backend/evento.php",
            { headers:{"Accept": "application/json"}}
        );
        const dados = await resposta.json();
        if(!resposta.ok || !dados.sucesso){
            throw new Error( dados.mensagem || "Não foi possivel carregar");
        }
        return dados;
        
    }catch(error) {
        console.log(error);
        return { "eventos":[] };
    }
    
}