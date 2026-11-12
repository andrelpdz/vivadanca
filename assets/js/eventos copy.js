



async function popularEventosAdmin(){
    // sectionEventos = document.getElementById("eventos");
    // var dados = await carregarCoreografias();
    // dados.coreografias.forEach((coreografia)=>{
    //     sectionEventos.innerHTML += cardCoreografiaAdmin(coreografia);
    // });

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
    form = document.getElementById("formEvento");
    form.addEventListener("submit", async (event)=>{
        // event.preventDefault();
        const integrantesSelecionado = Array.from(
            document.querySelectorAll('input[name="integrantes"]:checked')
        ).map(input=>Number(input.value));

        const listaIntegrantes = document.getElementById("listaIntegrantes");
        listaIntegrantes.value = integrantesSelecionado;
    });

}

