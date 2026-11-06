<<<<<<< HEAD
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
=======
//Javascript
/*
fetch("json.php")
    .then(function(resposta){
        return resposta.json();
    })
    .then(function(dados){
        console.log(dados);
    })
    .catch(function(erro){
        console.log("Erro:"+erro);
<<<<<<< HEAD
    });
*/
=======
    });*/
>>>>>>> 93c45b8d81aabea42d9674f27fd9d538a4188470

async function dados(){
    try{
        const resposta = await fetch("json.php");
        const dados = await resposta.json();
        console.log(dados);
        document.querySelector("body").innerHTML = dados.msg;
    }catch(erro){
        console.log(erro);
<<<<<<< HEAD
    }
=======
    }   
>>>>>>> 93c45b8d81aabea42d9674f27fd9d538a4188470
>>>>>>> abb79ca95115fca35edaca231544d79002dd24f3
}