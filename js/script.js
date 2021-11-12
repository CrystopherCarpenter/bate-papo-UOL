
let intervalStatus;
let intervalMessages;
let msgRef;                     //Mensagem de referência para a impressão das mensagens na tela

//function acessar() {
const nome = { name: `Alrimar` };
//var nome = { name: `${document.querySelector(`.inserir-nome`).value}` };

const promiseNome = axios.post(`https://mock-api.driven.com.br/api/v4/uol/participants`, nome);

promiseNome.then(Acesso);
promiseNome.catch(erroAcesso);
//}

function Acesso(resposta) {
    getMsgRef();

    setTimeout(intervals, 250);
}

function erroAcesso(resposta) {
    console.log(resposta.response.status);

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
        
                            <div class="status"><span class="time">(${resposta.data[j].time})</span>
                            <span class="nome"> ${resposta.data[j].from}</span>
                            <span class="texto"> ${resposta.data[j].text}</span></div>`;

                        document.querySelector(`.mensagens`).scrollIntoView(false)

                    } else if (resposta.data[j].type === 'message') {

                        document.querySelector(`.mensagens`).innerHTML += `

                            <div class="todos"><span class="time">(${resposta.data[j].time})</span>
                            <span class="nome"> ${resposta.data[j].from}</span>
                            <span class="para"> para</span>
                            <span class="nome"> Todos:</span>
                            <span class="texto"> ${resposta.data[j].text}</span></div> `;

                        document.querySelector(`.mensagens`).scrollIntoView(false)

                    }

                } else if (resposta.data[j].to === nome.name || resposta.data[j].from === nome.name) {

                    document.querySelector(`.mensagens`).innerHTML += `
        
                        <div class="privado"><span class="time">(${resposta.data[j].time})</span>
                        <span class="nome"> ${resposta.data[j].from}</span>
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

    const promisePost3 = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, message);


    promisePost3.then(retornoPost3);
    promisePost3.catch(retornoErro3);

}

function retornoPost3(resposta) {
}
function retornoErro3(resposta) {
}

var input = document.querySelector(".mensagem");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".enviar").click();
    }
});
