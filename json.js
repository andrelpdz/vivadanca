//JAVASCRIPT

// fetch("json.php")
//     .then(function(resposta){
//         return resposta.json();
//     })
//     .then(function(dados){
//         console.log(dados);
//     })
//     .catch(function(erro){
//         console.log("Erro:"+erro);
//     });


async function dados(){
try{
    const resposta = await fetch("json.php");
    const dados = await resposta.json();
    console.log(dados);
    document.querySelector("body").innerHTML = dados.msg;
} catch(erro){
    console.log(erro);
}
}