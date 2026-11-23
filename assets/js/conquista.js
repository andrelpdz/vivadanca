function criarCard(item){
    const caminhoFoto = `../assets/conquistas/${(item.foto || "").replace(/^\/+/, "")}`;
    console.log(caminhoFoto);

    return `
    <div style="padding: 20px; border: 1px solid #e1e5ec; border-radius: 12px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <img 
            src="${caminhoFoto}" 
            alt="${item.nome}" 
            style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;"
            onerror="this.style.display='none';"
        >

        <h3 style="font-size: 18px; margin-bottom: 5px; color: var(--azul);">
            ${item.nome}
        </h3>

        <p style="font-size: 13px; color: var(--cinza); margin-bottom: 4px;">
            <strong>Evento:</strong> ${item.evento_nome || 'N/A'}
        </p>

        <p style="font-size: 13px; color: var(--cinza); margin-bottom: 12px;">
            <strong>Coreografia:</strong> ${item.coreografia_titulo || 'N/A'}
        </p>

        <span style="display: flex; gap: 8px;">
            <button 
                type="button" 
                onclick='editarFormulario(${JSON.stringify(item)})' 
                style="flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: var(--dourado); color: white;">
                Editar
            </button>

            <button 
                type="button" 
                onclick="excluirConquista(${item.id})" 
                style="flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: #fff1f1; color: var(--vinho);">
                Excluir
            </button>
        </span>
    </div>
    `;
}

async function inicializarPagina() {
    await carregarOpcoesSelects();
    await popularCards();
}

async function carregarOpcoesSelects() {
    try {
        const resposta = await fetch("../backend/api_conquista.php", {
            headers: {"Accept": "application/json"}
        });

        const dados = await resposta.json();

        if (resposta.ok && dados.sucesso) {
            const selectEvento = document.getElementById("evento_id");
            const selectCoreografia = document.getElementById("coreografia_id");

            // Preencher Eventos
            if (dados.eventos && selectEvento) {
                dados.eventos.forEach(ev => {
                    const opt = document.createElement("option");
                    opt.value = ev.id;
                    opt.textContent = ev.nome;
                    selectEvento.appendChild(opt);
                });
            }

            // Preencher Coreografias
            if (dados.coreografias && selectCoreografia) {
                dados.coreografias.forEach(cor => {
                    const opt = document.createElement("option");
                    opt.value = cor.id;
                    opt.textContent = cor.titulo;
                    selectCoreografia.appendChild(opt);
                });
            }
        }
    } catch (error) {
        console.log("Erro ao carregar opções dos selects:", error);
    }
}

function editarFormulario(item){
    document.getElementById("id").value = item.id;
    document.getElementById("evento_id").value = item.evento_id;
    document.getElementById("coreografia_id").value = item.coreografia_id || "";
    document.getElementById("nome").value = item.nome;
    document.getElementById("descricao").value = item.descricao || "";

    document.getElementById("btnEnviar").value = "Atualizar";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function popularCards(){
    const container = document.getElementById("conquistas");
    if (!container) return;

    const dados = await carregarLista();
    container.innerHTML = "";

    if (dados.conquistas && dados.conquistas.length > 0) {
        dados.conquistas.forEach((item) => {
            container.innerHTML += criarCard(item);
        });
    } else {
        container.innerHTML = `
            <p style="color: var(--cinza); grid-column: 1 / -1; text-align: center;">
                Nenhuma conquista cadastrada.
            </p>
        `;
    }
}

async function carregarLista(){
    try {
        const resposta = await fetch("../backend/api_conquista.php", {
            headers: {"Accept": "application/json"}
        });

        const dados = await resposta.json();

        return (resposta.ok && dados.sucesso)
            ? dados
            : { conquistas: [] };

    } catch(error) {
        console.log("Erro ao carregar conquistas:", error);
        return { conquistas: [] };
    }
}

async function excluirConquista(id){
    if(!confirm("Deseja realmente excluir esta conquista?")) return;

    try {
        const resposta = await fetch(`../backend/api_conquista.php?id=${id}`, {
            method: "DELETE",
            headers: {"Accept": "application/json"},
        });

        const dados = await resposta.json();

        if (resposta.ok && dados.sucesso) {
            location.reload();
        }

    } catch(error) {
        console.log("Erro ao excluir conquista:", error);
    }
}