fetch('header.html')
    .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar o menu');
        return response.text();
    })
    .then(html => {
        document.querySelector('header').innerHTML = html;
    })
    .catch(error => console.error(error));

fetch('../backend/valida_login.php')
    .then(response => {
            if (!response.ok) throw new Error('Erro ao validar login');
            return response.text();
        })
        .then(html => {
            console.log(html);
            if(html != "logado"){
                location.href="/vivadanca/admin.php"
            }
        })
        .catch(error => console.error(error));