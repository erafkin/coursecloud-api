const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();
const fs = require('fs')


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
    });
};

const readFileAndCall = (promises, subj, course, targets) => {
    const path = `../../${subj}/${course}`
    try {
        if (fs.existsSync(path)) {
            //file exists
            fs.readFile(path, 'utf8', function(err, file){ 
                if (err) console.log(err);
                else {
                    promises.push(new Promise((res, rej) => {
                        naturalLanguageUnderstanding.analyze(analyzeParams(file, targets))
                        .then(analysisResults => {
                            console.log(JSON.stringify(analysisResults.result, null, 2));
                            res(analysisResults.result);
                        })
                        .catch(e => {
                            console.log('error:', e);
                            //if one fails I think it should keep going ? we can change this though
                            res(e)
                        });
                    })); 
                }
            });   
        }
    } catch(err) {
        console.error('file does not exist')
    }
}

export const analyzeCourses = (targets, subject, course) => {
    var promises = [];
    const subjects = ['PSYCH', 'ENGS', 'COSC', 'ECON', 'GOV'];
    return new Promise((resolve,reject) => {
        if(subject === null) {
            if(course === null) {
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
            if(course === null) {
                for(let i = 1; i < 25; i++) {
                    readFileAndCall(promises, subject, i, targets);
                }
            } else {
                readFileAndCall(promises, subject, course, targets); 
            }
        }
        Promise.all(promises).then((result)=>{
            //todo: this is where we should structure the results...whatever that would look like
            resolve(result)
        }).catch((error) => {
            //if the big promise fails then they should all fail
            console.log(error);
            reject(error)
        });
    });

     
}
