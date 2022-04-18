let listMsgs = [];
let listParticipantes = [];
let listParticipantesAux = [];
let pessoaSelecionada = "";
let visibilidadeSelecionada = "";
let destinatario;
let tipoMsg;
let nome;

function enviarNome(){
    nome = document.querySelector(".input-entrada").value
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',{name: nome})
    request.then(entrar);
    request.catch(tratarErro);
    buscarParticipantes();
}
function entrar() {
    buscarMensagens();
    const input = document.querySelector(".input-entrada")
    const butao = document.querySelector("button")
    const loading = document.querySelector(".lds-default")
    const text = document.querySelector(".tela-inicial span")
    input.classList.add("escondido");
    butao.classList.add("escondido");
    loading.classList.remove("escondido");
    text.classList.remove("escondido");
    setInterval(mudarTela,3000);
    setInterval(manterConectado,5000);
}
function mudarTela(){
    document.querySelector(".tela-inicial").classList.add("escondido")
    document.querySelector(".geral").classList.remove("escondido")
}
function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status',{name: nome})
}

function tratarErro(erro){
    if(erro.response.status === 400){
        alert("Nome já em uso!!")
    } 
}
function buscarParticipantes(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promise.then(mostrarParticipantes);
    promise.catch(erro => console.log(erro.response.data))
}
function buscarMensagens(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promise.then(mostrarMensagens);
    promise.catch(erro => console.log(erro.response.data))
    const aparecerNaTela = document.querySelector(".aux-scroll")
    aparecerNaTela.scrollIntoView()
}
function mostrarMensagens(resposta){
    listMsgs = resposta.data;
    const chat = document.querySelector(".chat")
    chat.innerHTML = ""
    for(let i = 0; i< listMsgs.length; i++){
        const msg = listMsgs[i]
        if(msg.to === "Todos" || msg.to === nome || msg.from === nome){
            if(msg.type === "status"){
                chat.innerHTML += `
                <div class="mensagem-box ${msg.type}">
                    <span class="horario">(${msg.time})</span>
                    <span class="nome-de-usuario">${msg.from}</span>
                    <span class="mensagem">${msg.text}</span>
                </div>` 
            }else{
                chat.innerHTML += `
            <div class="mensagem-box ${msg.type}">
                <span class="horario">(${msg.time})</span>
                <span class="nome-de-usuario">${msg.from}</span> para <span class="remetente">${msg.to}:</span>
                <span class="mensagem">${msg.text}</span>
            </div>`
            }  
        }
     
    }
}
function mostrarParticipantes(resposta) {
    listParticipantes = resposta.data
    const DivparticipantesAtivos = document.querySelector(".participantes-ativos")
    for(let i = 0; i < listParticipantes.length; i++){
        const participante = listParticipantes[i];
        if(document.getElementById(`${participante.name}`) === null){
            DivparticipantesAtivos.innerHTML += ` 
            <div class="pessoa" name="${participante.name}" id="${participante.name}" onclick="selecionar(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${participante.name}</span>
                <img class="check" src="/projeto5-batePapoUOL/imgs/Vector.png">
            </div>`

        } 
    }
    let participantesAtivos = listParticipantes.map(participante => participante.name)
    let listPessoas = document.querySelectorAll(".pessoa")
    for(let k = 1; k < listPessoas.length; k++){
            
        if(participantesAtivos.indexOf(listPessoas[k].getAttribute("id"))=== -1){
            let elemento = listPessoas[k]
            elemento.parentNode.removeChild(elemento);
        }
            
    }        
} 
function enviarMensagem(){
    verificaTipoMsg();
    const texto = document.querySelector(".input-enviar-msg").value;
    document.querySelector(".input-enviar-msg").value = "";
    let mensagem = 
    {
        from: nome,
        to: destinatario,
        text: texto,
        type: tipoMsg
    }
    
    const request = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages`,mensagem);
    request.then(buscarMensagens);
    request.catch(erro => window.location.reload());

}
function abrirMenuLateral(){
    const telaParticipantes = document.querySelector(".tela-participantes");
    telaParticipantes.classList.toggle("escondido");
    verificaTipoMsg();
}
function selecionar(elemento) {
    elemento.classList.toggle("selecionado");
    if(elemento.classList.contains("pessoa") === true){
        let listPessoasSelecionados = document.querySelectorAll(".pessoa.selecionado")
        for(let i=0; i < listPessoasSelecionados.length; i++){
            const selecionado = listPessoasSelecionados[i];
            if(selecionado !== elemento){
                selecionado.classList.remove("selecionado");
            }
            
        }
        if(listPessoasSelecionados.length != 0){
            pessoaSelecionada = document.querySelector(".pessoa.selecionado span").innerHTML
        }else {
            pessoaSelecionada = "";
        }
    }
    else{
        let listOpcoesSelecionados = document.querySelectorAll(".opcao.selecionado")
        for(let i=0; i < listOpcoesSelecionados.length; i++){
            const selecionado = listOpcoesSelecionados[i];
            if(selecionado !== elemento){
                selecionado.classList.remove("selecionado");
            }
        }
        if(listOpcoesSelecionados.length != 0){
            visibilidadeSelecionada = document.querySelector(".opcao.selecionado span").innerHTML
        }else{
            visibilidadeSelecionada = "";
        } 
    }
    verificaTipoMsg();
}
function verificaTipoMsg(){
    const frase = document.querySelector(".input-msg span")
    if(pessoaSelecionada != "" && visibilidadeSelecionada != ""){
        frase.innerHTML = `Enviando para ${pessoaSelecionada} (${visibilidadeSelecionada})`
        destinatario = pessoaSelecionada
        if(visibilidadeSelecionada === "Reservadamente"){
            tipoMsg = "private_message"
        }else{
            tipoMsg = "message"
        }
    }else{
        destinatario = "Todos"
        tipoMsg = "message"
        frase.innerHTML="";
    }
}
setInterval(buscarMensagens,3000);
setInterval(buscarParticipantes,10000);
