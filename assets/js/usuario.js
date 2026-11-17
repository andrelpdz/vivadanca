document.addEventListener("DOMContentLoaded", () => {
    popularTabelaUsuarios();

    const form = document.getElementById("auth");
    if(form){
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const resposta = await fetch("../backend/api_usuario.php", {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });
                const dados = await resposta.json();
                if(resposta.ok && dados.sucesso){
                    location.reload();
                } else {
                    alert(dados.erro || "Erro ao salvar usuário.");
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
});

async function popularTabelaUsuarios() {
    const tbody = document.getElementById("listaUsuarios");
    const mensagemVazia = document.getElementById("mensagemVazia");
    if (!tbody) return;

    const dados = await carregarListaUsuarios();
    
    if (dados.usuarios && dados.usuarios.length > 0) {
        if(mensagemVazia) mensagemVazia.style.display = "none";
        tbody.innerHTML = "";
        
        dados.usuarios.forEach((user) => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.tipo_usuario}</td>
                    <td>${user.permissoes || '-'}</td>
                    <td>
                        <button type="button" onclick="editarUsuario('${user.id}', '${user.nome}', '${user.email}', '${user.tipo_usuario}', '${user.permissoes || ''}')">Editar</button>
                        <button type="button" onclick="excluirUsuario(${user.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } else {
        if(mensagemVazia) mensagemVazia.style.display = "block";
    }
}

async function carregarListaUsuarios() {
    try {
        const resposta = await fetch("../backend/api_usuario.php", { headers: { "Accept": "application/json" } });
        const dados = await resposta.json();
        return (resposta.ok && dados.sucesso) ? dados : { "usuarios": [] };
    } catch (error) {
        console.log(error);
        return { "usuarios": [] };
    }
}

function editarUsuario(id, nome, email, tipo_usuario, permissoes) {
    document.getElementById("idUsuario").value = id;
    document.getElementById("cadastroNome").value = nome;
    document.getElementById("cadastroEmail").value = email;
    
    // Seleciona o rádio do tipo de usuário correto
    const radiosTipo = document.querySelectorAll("input[name='tipo_usuario']");
    radiosTipo.forEach(radio => {
        radio.checked = (radio.value === tipo_usuario);
    });

    // Marca as permissões correspondentes separadas por vírgula
    const checkboxesPerm = document.querySelectorAll("input[name='permissoes']");
    const listaPermissoes = permissoes.split(", ").map(p => p.trim());
    checkboxesPerm.forEach(checkbox => {
        checkbox.checked = listaPermissoes.includes(checkbox.value);
    });

    document.getElementById("tituloFormulario").innerText = "Editar usuário";
    document.getElementById("descricaoFormulario").innerText = "Atualizar dados do usuário";
    document.getElementById("btnSalvar").innerText = "Salvar alterações";
}

async function excluirUsuario(id) {
    if(!confirm("Deseja realmente excluir este usuário?")) return;
    
    try {
        const resposta = await fetch(`../backend/api_usuario.php?id=${id}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" },
        });
        const dados = await resposta.json();
        if (resposta.ok && dados.sucesso) {
            location.reload();
        } else {
            alert(dados.erro || "Erro ao excluir.");
        }
    } catch (error) {
        console.log(error);
    }
}