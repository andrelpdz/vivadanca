// CARREGAR USUÁRIOS
async function carregarUsuarios() {

    try {

        const resposta = await fetch(
            "../backend/usuario.php",
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            throw new Error("Erro ao carregar usuários");
        }

        return dados;

    } catch (error) {

        console.log(error);

        return { usuarios: [] };

    }

}


// POPULAR CARDS
async function popularCardsUsuarioAdmin() {

    const sectionUsuarios = document.getElementById("usuarios");

    const dados = await carregarUsuarios();

    sectionUsuarios.innerHTML = "";

    dados.usuarios.forEach((usuario) => {

        sectionUsuarios.innerHTML += criarCardUsuarioAdmin(usuario);

    });

}


// CRIAR CARD
function criarCardUsuarioAdmin(usuario) {

    return `
        <div class="card-usuario">

            <h3>${usuario.nome}</h3>

            <p><strong>Código:</strong> ${usuario.id}</p>

            <p><strong>E-mail:</strong> ${usuario.email}</p>

            <p><strong>Registro:</strong> ${usuario.criado}</p>

        </div>
    `;

}