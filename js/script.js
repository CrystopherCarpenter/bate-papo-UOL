
let intervalStatus;
let intervalMessages;
let msgRef;
let nome;                    //Mensagem de referência para a impressão das mensagens na tela

enterClick(`inserir-nome`, `buttonEntrar`)

enterClick(`mensagem`, `enviar`)

function enterClick(input, funcao) {
    const inputNome = document.querySelector(`.${input}`);
    inputNome.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector(`.${funcao}`).click();
        }
    });
}

function acessar() {

    nome = { name: `${document.querySelector(`.inserir-nome`).value}` };

    const promiseNome = axios.post(`https://mock-api.driven.com.br/api/v4/uol/participants`, nome);

    document.querySelector(`.entrar`).classList.add(`esconder`);
    document.querySelector(`.entrando`).classList.remove(`esconder`);

    setTimeout(promiseNome.then(Acesso), 5000);
    promiseNome.catch(erroAcesso);
}

function Acesso(resposta) {

    document.querySelector(`.tela-acesso`).classList.add(`esconder`);

    getMsgRef();

    messages();

    participantes();

    intervals();
}

function erroAcesso(resposta) {
    document.querySelector(`.entrando`).classList.add(`esconder`);
    document.querySelector(`.entrar`).classList.remove(`esconder`);

    alert(`O nome já está em uso, por favor escolha outro`);
}

function intervals() {

    intervalStatus = setInterval(stats, 5000);

    intervalMessages = setInterval(messages, 3000);

    intervalParticipantes = setInterval(participantes, 10000);

}

function stats() {
    const promise = axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, nome);

    promise.catch(retornoErroReload);
}

function participantes() {
    const promisePartic = axios.get(`https://mock-api.driven.com.br/api/v4/uol/participants`);

    promisePartic.then(listaContatos);
    promisePartic.catch(participantes);

}

function listaContatos(resposta) {

    const selecionado = document.querySelector(`.lista-contatos .contato-escolhido p`);

    const listaNomes = document.querySelectorAll(`.lista-contatos div p`);

    let contatos = document.querySelector(`.lista-contatos`);

    let teste = true;

    contatos.innerHTML = ``;

    if (selecionado.innerHTML !== `Todos`) {
        const visibilidade = document.querySelector(`.visibilidade-escolhida p`)
        if (visibilidade.innerHTML === `Público`) {
            document.querySelector(`footer div p`).innerHTML = `Enviando para ${selecionado.innerHTML}`
        } else {
            document.querySelector(`footer div p`).innerHTML = `Enviando para ${selecionado.innerHTML} (reservadamente)`
        }
    }

    for (let i = 0; i < listaNomes.length; i++) {

        if (listaNomes[i].innerHTML === `Todos`) {
            if (selecionado.innerHTML === `Todos`) {
                contatos.innerHTML = `
                    <div class="contato-escolhido" onclick="contatoEscolhido(this)">
                        <ion-icon class="icon-todos" name="people-sharp"></ion-icon>
                        <p>Todos</p>
                        <ion-icon name="checkmark-outline" class="check"></ion-icon>
                    </div>`
            } else {
                contatos.innerHTML = `
                    <div onclick="contatoEscolhido(this)">
                        <ion-icon class="icon-todos" name="people-sharp"></ion-icon>
                        <p>Todos</p>
                        <ion-icon name="checkmark-outline" class="check"></ion-icon>
                    </div>`
            }

        } else if (listaNomes[i].innerHTML === selecionado.innerHTML) {
            contatos.innerHTML += `
                <div class="contato-escolhido" onclick="contatoEscolhido(this)" data-identifier="participant">
                    <ion-icon class="icon-contatos" name="person-circle"></ion-icon>
                    <p>${selecionado.innerHTML}</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </div>`
        } else {
            for (let j = 0; j < resposta.data.length; j++) {
                if (listaNomes[i].innerHTML === resposta.data[j].name) {
                    contatos.innerHTML += `
                <div onclick="contatoEscolhido(this)" data-identifier="participant">
                    <ion-icon class="icon-contatos" name="person-circle"></ion-icon>
                    <p>${resposta.data[j].name}</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </div>`
                }
            }

        }
    }

    for (let i = 0; i < resposta.data.length; i++) {
        for (let j = 0; j < listaNomes.length; j++) {
            if (resposta.data[i].name === listaNomes[j].innerHTML) {
                teste = false;
                j = listaNomes.length
            }
        }
        if (teste && resposta.data[i].name !== nome.name) {
            contatos.innerHTML += `
                    <div onclick="contatoEscolhido(this)" data-identifier="participant">
                        <ion-icon class="icon-contatos" name="person-circle"></ion-icon>
                        <p>${resposta.data[i].name}</p>
                        <ion-icon name="checkmark-outline" class="check"></ion-icon>
                    </div>`

        }
    }
}

function aparecer() {
    document.querySelector(".fundo").classList.toggle("aparecer-fundo");
    document.querySelector(".menu-lateral").classList.toggle("aparecer-menu");

}

function contatoEscolhido(contato) {

    const selec = document.querySelector(".contato-escolhido");

    if (selec !== null) {
        selec.classList.remove("contato-escolhido");
    }

    contato.classList.add("contato-escolhido");
}

function visibilidadeEscolhida(visibilidade) {

    const selec = document.querySelector(".visibilidade-escolhida");

    if (selec !== null) {
        selec.classList.remove("visibilidade-escolhida");
    }

    visibilidade.classList.add("visibilidade-escolhida");
}

function getMsgRef() {
    const promiseMessages = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);

    promiseMessages.then(msg);
    promiseMessages.catch(erroMsg);

}

function erroMsg() {
    msgRef = resposta.data[0];
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
    promiseMessages.catch(messages);

}

function printMessages(resposta) {

    for (let i = 0; i < resposta.data.length; i++) {

        if (msgRef.from === resposta.data[i].from && msgRef.to === resposta.data[i].to && msgRef.text === resposta.data[i].text && msgRef.type === resposta.data[i].type && msgRef.time === resposta.data[i].time) {

            for (let j = (i + 1); j < resposta.data.length; j++) {

                if ((resposta.data[j].type) !== `private_message`) {

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
                            <span class="nome"> ${resposta.data[j].to}:</span>
                            <span class="texto"> ${resposta.data[j].text}</span></div> `;

                        document.querySelector(`.mensagens`).scrollIntoView(false)

                    }

                } else if (resposta.data[j].to === nome.name || (resposta.data[j].from === nome.name && resposta.data[j].to !== `Todos`)) {

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
    const msg = document.querySelector(`.mensagem`)
    const para = document.querySelector(`.contato-escolhido p`).innerHTML
    const visib = document.querySelector(`.visibilidade-escolhida p`).innerHTML

    const message = {
        from: nome.name,
        to: `${para}`,
        text: msg.value,
        type: ``
    }

    if (visib === `Público`) {
        message.type = `message`;
    } else {
        message.type = `private_message`;
    }

    console.log(message);



    msg.value = "";

    const promiseMensagem = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, message);


    promiseMensagem.then(retornoMensagem);
    promiseMensagem.catch(retornoErroReload);

}

function retornoMensagem(resposta) {
    messages();
}

function retornoErroReload(resposta) {
    window.location.reload()
}

