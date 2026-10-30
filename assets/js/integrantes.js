const sectionIntegrantes = document.getElementById("integrantes");

function criarCard(integrante){
    const div = document.createElement('div');
    const link = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');

    // btn de excluir
    const form = document.createElement('form');
    form.setAttribute("method", "DELETE");
    form.setAttribute("action", "../backend/api_integrante.php");
    const btn = document.createElement("input");
    btn.type = "submit";
    btn.value = "Excluir";
    
    const btnID = document.createElement("input")
    btnID.type = "hidden";
    btnID.value = integrante.id;
    btnID.name = "id";

    form.append(btn, btnID);


    // link.href = "integrante.html?id=" + integrante.id;
    img.src = "../assets/integrantes/" + integrante.foto;
    img.alt = "foto do integrante";
    img.width=200;
    img.height=200;
    p.textContent = integrante.nome;

    link.append(img, p);
    div.classList.add("integrante");
    div.append(link, form);

    return div;
}

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

        dados.integrantes.forEach((integrante)=>{
            sectionIntegrantes.append( criarCard(integrante) );
        });

        
    }catch(error) {
        console.log(error);
    }
    
}

carregarIntegrantes();
