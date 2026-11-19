document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("collection-grid");

    function corrigirFotos() {
        if (!grid) return;

        const imagens = grid.querySelectorAll("img");

        imagens.forEach(img => {
            const caminhoAtual = img.getAttribute("src") || "";

            const nomeFoto = caminhoAtual.split("/").pop();

            if (nomeFoto && nomeFoto.startsWith("conquista_")) {
                const caminhoCorreto = `/vivadanca/assets/img/conquistas/${nomeFoto}`;

                if (img.getAttribute("src") !== caminhoCorreto) {
                    img.setAttribute("src", caminhoCorreto);
                }
            }
        });
    }

    if (grid) {
        const observador = new MutationObserver(() => {
            corrigirFotos();
        });

        observador.observe(grid, {
            childList: true,
            subtree: true
        });
    }

    window.iniciarColecaoPublica({
        kind: 'achievements',
        endpoint: 'api_conquista.php',
        key: 'conquistas',
        label: 'conquistas',
        empty: 'Ainda não há conquistas cadastradas no acervo.'
    });

    corrigirFotos();

});