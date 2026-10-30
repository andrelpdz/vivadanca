class Header extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        
        var raiz = "/";
        if (window.location.href.includes("localhost")) {
            raiz = "/projetodanca";
        }      
        
        //link externo para o css
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', raiz+'/assets/components/header.css');
        shadow.appendChild(styleLink);

        const template = document.createElement('template');
        template.innerHTML = `
            <header>
             <div class="container-header">
                    header
                  <a href="${raiz}/pages/agenda.html">Agenda</a>
                  <a href="${raiz}/pages/contato.html">Contato</a>
                  <a href="${raiz}/pages/grupo.html">Grupo</a> 
                  <a href="${raiz}/pages/portfolio.html">Portfolio</a>
                  <a href="${raiz}/pages/sobre.html">Sobre</a>
                  <a href="${raiz}/pages/grupo.html">Grupo</a>
                  <a href="${raiz}/pages/grupo.html">Grupo</a>                    
                </div>
                <div class="login">
                    <a href="${raiz}/login.html">Login</a>
                </div>
            </header>
        `;
        shadow.appendChild(template.content.cloneNode(true));

    }
}

customElements.define('main-header', Header)