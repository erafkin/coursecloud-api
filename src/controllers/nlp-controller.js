const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.apikey,
  }),
  url: process.env.url,
});

const analyzeParams=(text, targets) => {
    return(
        {
        'text': text,
        'features': {
            'sentiment': {
            'targets' : targets
            }
        }
    }
);
};

export const test = (text, targets) => {
    console.log("in test");
    return new Promise((resolve, reject) => {
        console.log(text);
        console.log(targets);
        naturalLanguageUnderstanding.analyze(analyzeParams(text, targets))
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults.result, null, 2));
            resolve(analysisResults.result);
        })
        .catch(err => {
          console.log('error:', err);
          reject(err)
        });
    });   
}
