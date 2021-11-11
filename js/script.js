
let intervalStatus;
let intervalMessages;
let msgRef;                     //Mensagem de referência para a impressão das mensagens na tela

//function acessar() {
const nome = { name: `John Wick` };
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
    console.log(resposta.response);

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


    for (let i = 0; i < resposta.data.length; i++) {
        if (msgRef.from === resposta.data[i].from && msgRef.to === resposta.data[i].to && msgRef.text === resposta.data[i].text && msgRef.type === resposta.data[i].type && msgRef.time === resposta.data[i].time) {
            for (let j = (i + 1); j < resposta.data.length; j++) {
                if ((resposta.data[j].to) === `Todos`) {
                    if (resposta.data[j].type === 'status') {
                        console.log(`estou no if status`)
                        document.querySelector(`.mensagens`).innerHTML += `
                            <div class="status">${resposta.data[j].text}</div>`;
                    } else if (resposta.data[j].type === 'message') {
                        console.log(`estou no if message`)
                        document.querySelector(`.mensagens`).innerHTML += `
                            <div class="todos">${resposta.data[j].text}</div>`;
                    }
                } else if (resposta.data[j].to === nome.name || resposta.data[j].from === nome.name) {
                    document.querySelector(`.mensagens`).innerHTML += `
                <div class="privado">${resposta.data[j].text}</div> `;
                }

            }
            msgRef = resposta.data[resposta.data.length - 1];
            i = resposta.data.length;
        }
    }



}

function enviarMensagem() {
    let msg = document.querySelector(`.mensagem`).value;

    const message = {
        from: nome.name,
        to: `Todos`,
        text: msg,
        type: `message`
    }
    const promisePost3 = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, message);


    promisePost3.then(retornoPost3);
    promisePost3.catch(retornoErro3);

}

function retornoPost3(resposta) {
}
function retornoErro3(resposta) {
}

