class Footer extends HTMLElement{
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
        styleLink.setAttribute('href', raiz+'/assets/css/components/footer.css');
        shadow.appendChild(styleLink);

        const template = document.createElement('template');
        template.innerHTML = `
            <footer>
                <div class="container-footer">
                    <div class="logo-footer">
                    imagem
                    </div>

                    <div class="card">
                        <div class="cards">
                            <a href="${raiz}/index.html">Home</a>
                            <div class="text-cards">
                                <p>Home</p>
                                <p>Apresentação</p>
                                <p>Agenda</p>
                            </div>
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/agenda.html">Agenda</a>
                            <div class="text-cards">
                                <p>Home</p>
                                <p>Apresentação</p>
                                <p>Agenda</p>
                            </div>
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/contato.html">Contato</a>
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/grupo.html">Grupo</a> 
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/portfolio.html">Portfolio</a>
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/sobre.html">Sobre</a>
                        </div>
                        <div class="cards">    
                            <a href="${raiz}/pages/grupo.html">Grupo</a>
                        </div>
                        <div class="cards">
                            <a href="${raiz}/pages/grupo.html">Grupo</a>                    
                        </div>
                    </div>
                </div>
            </footer>
        `;
        shadow.appendChild(template.content.cloneNode(true));

    }
}

customElements.define('main-footer', Footer);