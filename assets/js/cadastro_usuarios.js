
const formulario = document.getElementById("auth");
const listaUsuarios = document.getElementById("listaUsuarios");
const mensagemVazia = document.getElementById("mensagemVazia");

const campoNome = document.getElementById("cadastroNome");
const campoEmail = document.getElementById("cadastroEmail");
const campoSenha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");

const idUsuario = document.getElementById("idUsuario");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

const tituloFormulario = document.getElementById("tituloFormulario");
const descricaoFormulario = document.getElementById("descricaoFormulario");

const URL_USUARIOS = "../backend/cadastro_usuarios.php";

let usuarios = [];

const todasPermissoes = [
    "Linha do tempo",
    "Integrantes",
    "Coreografias",
    "Conquistas",
    "Galerias"
];


// BUSCAR USUÁRIOS NO BANCO
async function carregarUsuarios() {

    try {

        const resposta = await fetch(URL_USUARIOS, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            throw new Error(dados.mensagem || "Erro ao carregar usuários.");
        }

        usuarios = dados.usuarios;

        return usuarios;

    } catch (erro) {

        console.error(erro);
        alert(erro.message);

        usuarios = [];

        return [];

    }
}


// LISTAR USUÁRIOS NA TABELA
async function listarUsuarios() {

    if (!listaUsuarios) return;

    await carregarUsuarios();

    listaUsuarios.innerHTML = "";

    if (mensagemVazia) {
        mensagemVazia.style.display =
            usuarios.length === 0 ? "block" : "none";
    }

    usuarios.forEach((usuario) => {

        const linha = document.createElement("tr");

        const dados = [
            usuario.nome,
            usuario.email,
            usuario.tipo_usuario === "admin"
                ? "Administrador"
                : "Editor",
            Array.isArray(usuario.permissoes)
                ? usuario.permissoes.join(", ") || "Nenhuma"
                : "Nenhuma"
        ];

        dados.forEach((valor) => {

            const coluna = document.createElement("td");

            coluna.textContent = valor;

            linha.appendChild(coluna);

        });


        // COLUNA DE AÇÕES
        const colunaAcoes = document.createElement("td");


        // BOTÃO ATUALIZAR
        const botaoAtualizar = document.createElement("button");

        botaoAtualizar.type = "button";
        botaoAtualizar.textContent = "Atualizar";
        botaoAtualizar.className = "btn-atualizar";

        botaoAtualizar.addEventListener("click", () => {
            atualizarUsuario(usuario);
        });


        // BOTÃO EXCLUIR
        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn-excluir";

        botaoExcluir.addEventListener("click", () => {
            excluirUsuario(usuario.id);
        });


        colunaAcoes.appendChild(botaoAtualizar);
        colunaAcoes.appendChild(botaoExcluir);

        linha.appendChild(colunaAcoes);

        listaUsuarios.appendChild(linha);

    });

}


// MARCAR TODAS AS PERMISSÕES QUANDO FOR ADMIN
document.querySelectorAll('input[name="tipo_usuario"]').forEach(radio => {

    radio.addEventListener("change", () => {

        if (radio.checked && radio.value === "admin") {

            document.querySelectorAll('input[name="permissoes"]').forEach(checkbox => {
                checkbox.checked = true;
            });

        }

    });

});


// CADASTRAR OU ATUALIZAR USUÁRIO
if (formulario) {

    formulario.addEventListener("submit", async function(event) {

        event.preventDefault();

        const id = idUsuario.value;

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim().toLowerCase();
        const senha = campoSenha.value;
        const confirmacao = confirmarSenha.value;

        const tipoSelecionado = document.querySelector(
            'input[name="tipo_usuario"]:checked'
        );

        if (!tipoSelecionado) {
            alert("Selecione o tipo de usuário.");
            return;
        }

        const tipo = tipoSelecionado.value;

        const permissoes = [
            ...document.querySelectorAll(
                'input[name="permissoes"]:checked'
            )
        ].map(item => item.value);


        // SE FOR CADASTRO
        if (!id) {

            if (!senha || !confirmacao) {
                alert("Preencha os campos de senha.");
                return;
            }

            if (senha !== confirmacao) {
                alert("As senhas não são iguais!");
                return;
            }

        }


        // DADOS DO CADASTRO
        const dadosUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            confirmacao: confirmacao,
            tipo: tipo,
            permissoes: permissoes
        };


        // SE FOR ATUALIZAÇÃO, ENVIA SOMENTE ID, TIPO E PERMISSÕES
        if (id) {

            dadosUsuario.id = id;

            delete dadosUsuario.nome;
            delete dadosUsuario.email;
            delete dadosUsuario.senha;
            delete dadosUsuario.confirmacao;

        }


        try {

            const resposta = await fetch(URL_USUARIOS, {

                method: id ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(dadosUsuario)

            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                throw new Error(
                    dados.mensagem || "Erro ao salvar usuário."
                );
            }

            alert(dados.mensagem);

            // RECARREGAR A PÁGINA APÓS SALVAR
            window.location.reload();

        } catch (erro) {

            alert(erro.message);
            console.error(erro);

        }

    });

}


// ABRIR FORMULÁRIO PARA ATUALIZAR USUÁRIO
function atualizarUsuario(usuario) {

    // GUARDA O ID
    idUsuario.value = usuario.id;

    // PREENCHE NOME E EMAIL
    campoNome.value = usuario.nome;
    campoEmail.value = usuario.email;

    // NOME E EMAIL NÃO SERÃO ALTERADOS NESTA EDIÇÃO
    campoNome.readOnly = true;
    campoEmail.readOnly = true;

    // SENHA NÃO SERÁ ALTERADA
    campoSenha.value = "";
    confirmarSenha.value = "";

    campoSenha.disabled = true;
    confirmarSenha.disabled = true;

    // SELECIONA ADMIN OU EDITOR
    document.querySelectorAll('input[name="tipo_usuario"]').forEach(radio => {

        radio.checked = radio.value === usuario.tipo_usuario;

    });

    // PREENCHE AS PERMISSÕES
    const permissoesUsuario = Array.isArray(usuario.permissoes)
        ? usuario.permissoes
        : [];

    document.querySelectorAll('input[name="permissoes"]').forEach(checkbox => {

        if (usuario.tipo_usuario === "admin") {
            checkbox.checked = true;
        } else {
            checkbox.checked = permissoesUsuario.includes(checkbox.value);
        }

    });

    // ALTERA O TÍTULO E O BOTÃO
    tituloFormulario.textContent = "Atualizar usuário";
    descricaoFormulario.textContent = "Altere o tipo e as permissões do usuário";

    btnSalvar.textContent = "Salvar alterações";

    // VAI ATÉ O FORMULÁRIO
    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// CANCELAR E VOLTAR AO CADASTRO
if (btnCancelar) {

    btnCancelar.addEventListener("click", () => {

        idUsuario.value = "";

        campoNome.readOnly = false;
        campoEmail.readOnly = false;

        campoSenha.disabled = false;
        confirmarSenha.disabled = false;

        tituloFormulario.textContent = "Novo usuário";
        descricaoFormulario.textContent = "Registrar um novo usuário";

        btnSalvar.textContent = "Cadastrar usuário";

    });

}


// EXCLUIR USUÁRIO DO BANCO
async function excluirUsuario(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este usuário?"
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(URL_USUARIOS, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({ id: id })

        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {

            throw new Error(
                dados.mensagem || "Erro ao excluir usuário."
            );

        }

        alert(dados.mensagem);

        await listarUsuarios();

    } catch (erro) {

        alert(erro.message);
        console.error(erro);

    }

}


// CRIAR CARD DE USUÁRIO
function criarCardUsuarioAdmin(usuario) {

    const card = document.createElement("div");

    card.className = "card-usuario";

    const titulo = document.createElement("h3");
    titulo.textContent = usuario.nome;

    const codigo = document.createElement("p");
    codigo.textContent = "Código: " + usuario.id;

    const email = document.createElement("p");
    email.textContent = "E-mail: " + usuario.email;

    const registro = document.createElement("p");
    registro.textContent = "Registro: " + usuario.criado;

    card.append(titulo, codigo, email, registro);

    return card;

}


// POPULAR CARDS EM OUTRA PÁGINA
async function popularCardsUsuarioAdmin() {

    const sectionUsuarios = document.getElementById("usuarios");

    if (!sectionUsuarios) return;

    await carregarUsuarios();

    sectionUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {

        const card = criarCardUsuarioAdmin(usuario);

        sectionUsuarios.appendChild(card);

    });

}


// INICIAR A LISTAGEM AO ABRIR A PÁGINA
if (listaUsuarios) {
    listarUsuarios();
}
