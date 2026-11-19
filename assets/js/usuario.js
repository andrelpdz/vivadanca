
/* =========================================
   USUÁRIOS - VIVA DANÇA
   ========================================= */

(() => {
    // Evita inicializar o arquivo mais de uma vez
    if (window.usuarioJSInicializado) return;
    window.usuarioJSInicializado = true;

    document.addEventListener("DOMContentLoaded", iniciarUsuarios);

    function iniciarUsuarios() {
        const form = document.getElementById("auth");

        // Carrega a tabela uma única vez
        popularTabelaUsuarios();

        if (!form) return;

        // Evita adicionar vários eventos submit
        if (form.dataset.usuarioEvento === "true") return;
        form.dataset.usuarioEvento = "true";

        form.addEventListener("submit", salvarUsuario);
    }

    /* =========================================
       SALVAR / CADASTRAR / EDITAR
       ========================================= */

    async function salvarUsuario(e) {
        e.preventDefault();

        const form = document.getElementById("auth");
        const idUsuario = document.getElementById("idUsuario").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const editando = idUsuario !== "";

        if (!editando && senha.length < 8) {
            alert("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (senha !== "" || confirmarSenha !== "") {
            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem.");
                return;
            }

            if (senha.length < 8) {
                alert("A senha deve ter pelo menos 8 caracteres.");
                return;
            }
        }

        const btnSalvar = document.getElementById("btnSalvar");
        const textoOriginal = btnSalvar.value;

        btnSalvar.disabled = true;
        btnSalvar.value = editando
            ? "Salvando alterações..."
            : "Cadastrando...";

        try {
            const formData = new FormData(form);

            const resposta = await fetch("../backend/api_usuario.php", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                alert(dados.erro || "Não foi possível salvar o usuário.");
                return;
            }

           alert(editando
    ? "Usuário atualizado com sucesso!"
    : "Usuário cadastrado com sucesso!");

window.location.reload();
return;

        } catch (erro) {
            console.error("Erro ao salvar usuário:", erro);
            alert("Erro de conexão com o servidor.");
        } finally {
            btnSalvar.disabled = false;

            if (document.getElementById("idUsuario").value !== "") {
                btnSalvar.value = "Salvar alterações";
            } else {
                btnSalvar.value = textoOriginal === "Salvando alterações..."
                    ? "Cadastrar usuário"
                    : "Cadastrar usuário";
            }
        }
    }

    /* =========================================
       LISTAR USUÁRIOS
       ========================================= */

    async function popularTabelaUsuarios() {
        const tabela = document.querySelector("#listaUsuarios table");
        const mensagemVazia = document.getElementById("mensagemVazia");

        if (!tabela) return;

        // Limpa completamente antes de reconstruir
        tabela.replaceChildren();

        const dados = await carregarListaUsuarios();

        if (!dados.usuarios || dados.usuarios.length === 0) {
            if (mensagemVazia) mensagemVazia.style.display = "block";
            return;
        }

        if (mensagemVazia) mensagemVazia.style.display = "none";

        const thead = document.createElement("thead");
        const trHeader = document.createElement("tr");

        ["Nome", "E-mail", "Tipo", "Permissões", "Ações"].forEach(texto => {
            const th = document.createElement("th");
            th.textContent = texto;
            trHeader.appendChild(th);
        });

        thead.appendChild(trHeader);
        tabela.appendChild(thead);

        const tbody = document.createElement("tbody");

        dados.usuarios.forEach(user => {
            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = user.nome || "-";

            const tdEmail = document.createElement("td");
            tdEmail.textContent = user.email || "-";

            const tdTipo = document.createElement("td");
            tdTipo.textContent = user.tipo_usuario || "-";

            const tdPermissoes = document.createElement("td");
            tdPermissoes.textContent = formatarPermissoes(user.permissoes);

            const tdAcoes = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => editarUsuario(user));

            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.textContent = "Excluir";
            btnExcluir.addEventListener("click", () => excluirUsuario(user.id));

            tdAcoes.append(btnEditar, btnExcluir);
            tr.append(tdNome, tdEmail, tdTipo, tdPermissoes, tdAcoes);
            tbody.appendChild(tr);
        });

        tabela.appendChild(tbody);
    }

    /* =========================================
       BUSCAR USUÁRIOS NA API
       ========================================= */

    async function carregarListaUsuarios() {
        try {
            const resposta = await fetch("../backend/api_usuario.php", {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });

            const dados = await resposta.json();

            if (resposta.ok && dados.sucesso) {
                return dados;
            }

            console.error("Erro na API:", dados.erro);
            return { usuarios: [] };

        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
            return { usuarios: [] };
        }
    }

    /* =========================================
       FORMATAR PERMISSÕES
       ========================================= */

    function formatarPermissoes(permissoes) {
        if (!permissoes) return "-";

        if (Array.isArray(permissoes)) {
            return permissoes.join(", ") || "-";
        }

        if (typeof permissoes === "string") {
            const texto = permissoes.trim();

            if (!texto) return "-";

            try {
                const json = JSON.parse(texto);

                if (Array.isArray(json)) {
                    return json.join(", ") || "-";
                }
            } catch (erro) {
                // Continua tratando como texto normal
            }

            return texto.replace(/[\[\]"']/g, "") || "-";
        }

        return "-";
    }

    /* =========================================
       EDITAR USUÁRIO
       ========================================= */

    function editarUsuario(user) {
    const form = document.getElementById("auth");
    const titulo = document.getElementById("tituloFormulario");
    const descricao = document.getElementById("descricaoFormulario");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnCancelar = document.getElementById("btnCancelar");

    if (!form || !btnSalvar) {
        console.error("Formulário ou botão não encontrado.");
        return;
    }

    // Preenche os dados
    document.getElementById("idUsuario").value = user.id;
    document.getElementById("cadastroNome").value = user.nome || "";
    document.getElementById("cadastroEmail").value = user.email || "";

    // Senha fica vazia ao editar
    document.getElementById("senha").value = "";
    document.getElementById("confirmarSenha").value = "";

    // Seleciona tipo de usuário
    document.querySelectorAll('input[name="tipo_usuario"]').forEach(radio => {
        radio.checked = radio.value === user.tipo_usuario;
    });

    // Trata as permissões
    let permissoes = [];

    if (Array.isArray(user.permissoes)) {
        permissoes = user.permissoes;
    } else if (user.permissoes) {
        try {
            permissoes = JSON.parse(user.permissoes);
            if (!Array.isArray(permissoes)) {
                permissoes = user.permissoes.split(",").map(p => p.trim());
            }
        } catch {
            permissoes = user.permissoes.split(",").map(p => p.trim());
        }
    }

    document.querySelectorAll('input[name="permissoes[]"]').forEach(checkbox => {
        checkbox.checked = permissoes.includes(checkbox.value);
    });

    // ALTERA O CABEÇALHO
    if (titulo) titulo.innerText = "Editar usuário";

    if (descricao) {
        descricao.innerText = "Atualize os dados do usuário selecionado.";
    }

    // ALTERA O BOTÃO SUBMIT
    btnSalvar.value = "Salvar alterações";
    btnSalvar.setAttribute("value", "Salvar alterações");
    btnSalvar.disabled = false;

    // MOSTRA CANCELAR
    if (btnCancelar) {
        btnCancelar.style.display = "block";
    }

    // Vai até o formulário
    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    console.log("Modo edição ativado para:", user.nome);
}

    /* =========================================
       CANCELAR EDIÇÃO / LIMPAR FORMULÁRIO
       ========================================= */

    window.limparFormulario = function () {
        const form = document.getElementById("auth");
        if (!form) return;

        form.reset();

        document.getElementById("idUsuario").value = "";

        document.getElementById("tituloFormulario").innerText = "Novo usuário";

        document.getElementById("descricaoFormulario").innerText =
            "Preencha os dados para registrar um novo usuário no sistema.";

        const btnSalvar = document.getElementById("btnSalvar");
        btnSalvar.value = "Cadastrar usuário";
        btnSalvar.disabled = false;

        const btnCancelar = document.getElementById("btnCancelar");
        if (btnCancelar) btnCancelar.style.display = "none";

        // Desmarca permissões
        document.querySelectorAll('input[name="permissoes[]"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Seleciona Admin por padrão
        const radioAdmin = document.querySelector(
            'input[name="tipo_usuario"][value="admin"]'
        );

        if (radioAdmin) radioAdmin.checked = true;

        document.getElementById("senha").value = "";
        document.getElementById("confirmarSenha").value = "";
    };

    /* =========================================
       EXCLUIR USUÁRIO
       ========================================= */

    async function excluirUsuario(id) {
        if (!confirm("Deseja realmente excluir este usuário?")) return;

        try {
            const resposta = await fetch(
                `../backend/api_usuario.php?id=${encodeURIComponent(id)}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                alert(dados.erro || "Erro ao excluir usuário.");
                return;
            }

            alert("Usuário excluído com sucesso!");
            window.location.reload();
            return;

        } catch (erro) {
            console.error("Erro ao excluir usuário:", erro);
            alert("Erro de conexão ao excluir usuário.");
        }
    }

})();
