
let intervalStatus;
let intervalMessages;
let msgRef;
let nome;                    //Mensagem de referência para a impressão das mensagens na tela

function acessar() {

    nome = { name: `${document.querySelector(`.inserir-nome`).value}` };

    const promiseNome = axios.post(`https://mock-api.driven.com.br/api/v4/uol/participants`, nome);

    document.querySelector(`.entrar`).classList.add(`esconder`);
    document.querySelector(`.entrando`).classList.remove(`esconder`);


    setTimeout(promiseNome.then(Acesso), 5000);
    promiseNome.catch(erroAcesso);
}

const inputNome = document.querySelector(".inserir-nome");
inputNome.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".buttonEntrar").click();
    }
});

function Acesso(resposta) {

    document.querySelector(`.tela-acesso`).classList.add(`esconder`);

    getMsgRef();

    messages();

    setTimeout(intervals, 250);
}

function erroAcesso(resposta) {
    document.querySelector(`.entrando`).classList.add(`esconder`);
    document.querySelector(`.entrar`).classList.remove(`esconder`);

    alert(`O nome já está em uso, por favor escolha outro`);

}

function intervals() {

    intervalStatus = setInterval(stats, 5000);

    intervalMessages = setInterval(messages, 3000);

}

function stats() {
    axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, nome);
}

function getMsgRef() {
    const promiseMessages = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);

    promiseMessages.then(msg);

}


function msg(resposta) {                                                                                //Função que busca a mensagem de referência para a impressão das mensagens na tela

    for (let i = (resposta.data.length - 1); i >= 0; i--) {
        if ((resposta.data[i].from) === nome.name && (resposta.data[i].text) === `entra na sala...`) {

            msgRef = resposta.data[i - 1];

            i = -1;
        } else if (i === 0) {
            msgRef = resposta.data[i];
        }
    }
}

function messages() {
    const promiseMessages = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);


    promiseMessages.then(printMessages);

}

function printMessages(resposta) {

    console.log(resposta.data)

    for (let i = 0; i < resposta.data.length; i++) {

        if (msgRef.from === resposta.data[i].from && msgRef.to === resposta.data[i].to && msgRef.text === resposta.data[i].text && msgRef.type === resposta.data[i].type && msgRef.time === resposta.data[i].time) {

            for (let j = (i + 1); j < resposta.data.length; j++) {

                if ((resposta.data[j].to) === `Todos`) {

                    if (resposta.data[j].type === 'status') {

                        document.querySelector(`.mensagens`).innerHTML += `
        
                            <div class="status" data-identifier="message"><div><span class="time">(${resposta.data[j].time})</span>
                            <span class="nome"> ${resposta.data[j].from}</span></div>
                            <span class="texto"> ${resposta.data[j].text}</span></div>`;

                        document.querySelector(`.mensagens`).scrollIntoView(false)

                    } else if (resposta.data[j].type === 'message') {

                        document.querySelector(`.mensagens`).innerHTML += `

                            <div class="todos" data-identifier="message"><div><span class="time">(${resposta.data[j].time})</span>
                            <span class="nome"> ${resposta.data[j].from}</span></div>
                            <span class="para"> para</span>
                            <span class="nome"> Todos:</span>
                            <span class="texto"> ${resposta.data[j].text}</span></div> `;

                        document.querySelector(`.mensagens`).scrollIntoView(false)

                    }

                } else if (resposta.data[j].to === nome.name || resposta.data[j].from === nome.name) {

                    document.querySelector(`.mensagens`).innerHTML += `
        
                        <div class="privado" data-identifier="message"><div><span class="time">(${resposta.data[j].time})</span>
                        <span class="nome"> ${resposta.data[j].from}</span></div>
                        <span class="para"> reservadamente para</span>
                        <span class="nome"> ${resposta.data[j].to}:</span>
                        <span class="texto"> ${resposta.data[j].text}</span></div> `;

                    document.querySelector(`.mensagens`).scrollIntoView(false)
                }

            }
            msgRef = resposta.data[resposta.data.length - 1];
            i = resposta.data.length;
        }
    }



}

function enviarMensagem() {
    let msg = document.querySelector(`.mensagem`)

    const message = {
        from: nome.name,
        to: `Todos`,
        text: msg.value,
        type: `message`
    }

    msg.value = "";

    const promiseMensagem = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, message);


    promiseMensagem.then(retornoMensagem);
    promiseMensagem.catch(retornoErroMensagem);

}

function retornoMensagem(resposta) {
    messages();
}
function retornoErroMensagem(resposta) {
    window.location.reload()
}

const inputMensagem = document.querySelector(".mensagem");
inputMensagem.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".enviar").click();
    }
});
