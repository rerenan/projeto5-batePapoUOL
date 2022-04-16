const nome = prompt("Qual é o seu nome?")
let listMsgs = [];
const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',{name: nome})
request.then(resposta => console.log(resposta.data))
request.catch(erro => console.log(erro.response.data))

setInterval(manterConectado,5000);

function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status',{name: nome})
}
let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
promise.then(carregarMensagens);
promise.catch(erro => console.log(erro.response.data))

function carregarMensagens(resposta) {
    listMsgs = resposta.data;
    console.log(listMsgs);
    mostrarMensagens(listMsgs);
}

function mostrarMensagens(mensagens){
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