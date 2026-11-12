fetch('header.html')
    .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar o menu');
        return response.text();
    })
    .then(html => {
        document.querySelector('header').innerHTML = html;
    })
    .catch(error => console.error(error));