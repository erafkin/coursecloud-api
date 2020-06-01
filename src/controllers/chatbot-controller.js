const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.chatapikey,
  }),
  url: process.env.chaturl,
});

export const createSession = () => {
    return new Promise((resolve, reject) => {
        assistant.createSession({
            assistantId: process.env.chatid
        })
        .then(res => {
            console.log(JSON.stringify(res.result, null, 2));
            resolve(res.result);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    })  
}

export const message = (text, sessionId, ) => {
    return(
        new Promise((resolve, reject) => {
            assistant.message({
                assistantId: process.env.chatid,
                sessionId: sessionId,
                input: {
                  'message_type': 'text',
                  'text': text
                  }
                })
                .then(res => {
                  console.log(JSON.stringify(res.result, null, 2));
                  resolve(res.result)
                })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
        })
    )
}