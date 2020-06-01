const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();
const fs = require('fs');
const path = require("path");


const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.nlpapikey,
  }),
  url: process.env.nlpurl,
});

const analyzeParams=(text, targets) => {
    return(
        {
            'text': text,
            'features': {
                'sentiment': {
                'targets' : targets,
                'document': true
                },
                'keywords': {
                    'sentiment': true,
                    'emotion': true,
                    'limit': 5
                },
                'emotion': {
                    'document': true,
                    'targets': targets
                }
            }
    });
};

const readFileAndCall = (promises, subject, course, targets) => {
    const p = path.resolve(__dirname,`../../data/${subject}/${subject}${course}.txt`);
    promises.push(new Promise((res, rej) => {
        fs.readFile(p, 'utf8', function(err, file){ 
            if (err) {
                console.log(err);
                res(`no course ${subject}${course}`);
            } else {
                console.log('read file');
                naturalLanguageUnderstanding.analyze(analyzeParams(file, targets))
                .then(analysisResults => {
                    console.log(JSON.stringify(analysisResults.result, null, 2));
                    analysisResults.result["course"] =`${subject}${course}`
                    res(analysisResults.result);
                })
                .catch(e => {
                    console.log('error:', e);
                    //if one fails I think it should keep going ? we can change this though
                    res(e)
                });
            }
        });
    })); 
}

export const analyzeCourses = (targets, subject, course) => {
    var promises = [];
    const subjects = ['PSYC', 'ENGS', 'COSC', 'ECON', 'GOV'];
    return new Promise((resolve,reject) => {
        if(subject === undefined) {
            if(course === undefined) {
                subjects.forEach((subj) => {
                    for(let i = 1; i < 25; i++) {
                        readFileAndCall(promises, subj, i, targets);
                    }
                });
            } else {
                subjects.forEach((subj) => {
                    readFileAndCall(promises, subj, course, targets);
                });
            }
        } else {
            if(course === undefined) {
                for(let i = 1; i < 25; i++) {
                    readFileAndCall(promises, subject, i, targets);
                }
            } else {
                readFileAndCall(promises, subject, course, targets); 
            }
        }
        console.log(promises);
        Promise.all(promises).then((result)=>{
            //todo: this is where we should structure the results...whatever that would look like
            console.log("DONE");
            resolve(result)
        }).catch((error) => {
            //if the big promise fails then they should all fail
            console.log(error);
            resolve(error)
        });
    });

     
}
