async function popularCardsSairAdmin(){
    const sectionSair = document.getElementById("sair");
    const dados = await carregarSair();

    dados.imagens.forEach((sair)=>{
        sectionSair.append(criarCardAdmin(sair));
    });
}

function criarCardAdmin(sair) {
    const card = document.createElement("figure");
    const foto = document.createElement("img");
    const descricao = document.createElement("figcaption");
    const data = document.createElement("p");

    foto.src = `../assets/galeria/${encodeURIComponent(sair.foto)}`;
    foto.alt = sair.descricao || "Imagem da galeria";
    foto.loading = "lazy";
    descricao.textContent = sair.descricao || "";
    data.textContent = sair.data || "";

    card.append(foto, descricao, data);
    return card;
}

async function carregarSair() {
    try {
        const resposta = await fetch("../backend/sair.php", {
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