
async function popularCardscoreografiaAdmin(){
    const sectioncoreografia = document.getElementById("coreografia");
    const dados = await carregarcoreografia();
 
    dados.coreografia.forEach((coreografia)=>{
        sectioncoreografia.append(criarCardAdmin(coreografia));
    });
}
 
function criarCardAdmin(coreografia) {
    const card = document.createElement("div");
    const descricao = document.createElement("figcaption");
    const data = document.createElement("p");
 
    
    descricao.textContent = coreografia.descricao || "";
    data.textContent = coreografia.data || "";
 
    card.append(coreografia.titulo, coreografia.descricao, coreografia.data_criacao, coreografia.modalidade);
    return card;
}
 
async function carregarcoreografia() {
    try {
        const resposta = await fetch("../backend/coreografia.php", {
            headers: { Accept: "application/json" }
        });
        const dados = await resposta.json();
 
        if (!resposta.ok || !dados.sucesso) {
            throw new Error(dados.mensagem || "nao foi pssivel fazer o cadastro");
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