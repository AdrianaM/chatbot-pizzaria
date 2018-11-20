const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1');
require('dotenv').config();

const chatbot = new watson({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    version: process.env.VERSION
});

const workspace_id = process.env.WORKSPACE_ID;

// Comecando a conversacao com uma mensagem vazia
chatbot.message({ workspace_id }, trataResposta);

let fimDeConversa = false;

function trataResposta(err, resposta) {
    if(err) {
        console.log(err);
        return;
    }

    // Detecta a intencao
    if(resposta.intents.length > 0) {
        console.log('Detectada a intencao: ' + resposta.intents[0].intent);
        if(resposta.intents[0].intent == 'despedida') {
            fimDeConversa = true;
        }
    }

    // Mostra a resposta do dialogo
    if(resposta.output.text.length > 0) {
        console.log(resposta.output.text);
    }

    console.log(resposta.context);

    if(!fimDeConversa) {
        const mensagemUsuario = prompt('>> ');
        chatbot.message({
            workspace_id,
            input: {text: mensagemUsuario},
            context: resposta.context      
        }, trataResposta);
    }
}