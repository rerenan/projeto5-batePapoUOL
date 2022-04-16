let listMsgs = [];
let nome = prompt("Qual é o seu nome?");
function enviarNome(){
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',{name: nome})
    request.then(buscarMensagens);
    request.catch(tratarErro);
}
enviarNome();


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
    chat.innerHTML = " "
    for(let i = 0; i< listMsgs.length; i++){
        const msg = listMsgs[i]
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


function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status',{name: nome})
}
function tratarErro(erro){
    console.log(erro.response);
    if(erro.response.status === 400){
        nome = prompt("Esse nome já está em uso, por favor digite outro.");
        enviarNome();  
    }  
}
function enviarMensagem(){
    const texto = document.querySelector("input").value
    document.querySelector("input").value = ""
    const mensagem = 
    {
        from: nome,
        to: "Todos",
        text: texto,
        type: "message"
    }
    const request = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages`,mensagem);
    request.then(buscarMensagens)
    request.catch(erro => window.location.reload());

}
setInterval(buscarMensagens,3000);
setInterval(manterConectado,5000);
