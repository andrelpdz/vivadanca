async function popularCardsGaleriaAdmin(){
    const sectionGaleria = document.getElementById("galeria");
    const dados = await carregarGaleria();
 
    dados.galeria.forEach((galeria)=>{
        sectionGaleria.append(criarCardAdmin(galeria));
    });
}
 
function criarCardAdmin(galeria) {
    const card = document.createElement("figure");
    const foto = document.createElement("img");
    const descricao = document.createElement("figcaption");
    const data = document.createElement("p");
 
    foto.src = `../assets/galeria/${encodeURIComponent(galeria.foto)}`;
    foto.alt = galeria.descricao || "Imagem da galeria";
    foto.loading = "lazy";
    descricao.textContent = galeria.descricao || "";
    data.textContent = galeria.data || "";
 
    card.append(foto, descricao, data);
    return card;
}
 
async function carregarGaleria() {
    try {
        const resposta = await fetch("../backend/galeria.php", {
            headers: { Accept: "application/json" }
        });
        const dados = await resposta.json();
 
        if (!resposta.ok || !dados.sucesso) {
            throw new Error(dados.mensagem || "NÃ£o foi possÃ­vel carregar a galeria.");
        }
 
        return dados;
    } catch (erro) {
        console.error("Erro ao carregar a galeria:", erro);
        return {
            sucesso: false,
            mensagem: erro.message || "NÃ£o foi possÃ­vel carregar a galeria.",
            imagens: []
        };
    }
}

document.getElementById("auth").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    try {
        const resposta = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            throw new Error(dados.mensagem || "Não foi possível cadastrar a foto.");
        }

        form.reset();
        document.getElementById("galeria").replaceChildren();
        await popularCardsGaleriaAdmin();
    } catch (erro) {
        console.error("Erro ao cadastrar a foto:", erro);
    }
}); //mostrar as paginas sem precisar atualizar a pagina