class Header extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        
        var raiz = "/";
        if (window.location.href.includes("localhost")) {
            raiz = "/projetodanca";
        }      
        
        const template = document.createElement('template');
        template.innerHTML = `
            <header>
             <div class="container-header">
                  <a href="${raiz}/?pagina=agenda">Agenda</a>
                  <a href="${raiz}/?pagina=contato">Contato</a>
                  <a href="${raiz}/?pagina=portfolio">Portfolio</a>
                  <a href="${raiz}/?pagina=sobre">Sobre</a>
                  <a href="${raiz}/?pagina=grupo">Grupo</a>                   
                </div>
            </header>
        `;
        shadow.appendChild(template.content.cloneNode(true));

    }
}

customElements.define('main-header', Header)