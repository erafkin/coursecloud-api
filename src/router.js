import { Router } from 'express';
import * as NLP from './controllers/nlp-controller';
import * as Chatbot from './controllers/chatbot-controller';

const router = Router();

require('dotenv').config(); // load environment variables
var bodyParser = require('body-parser')


router.route('/').get((req, res) => {
  res.send('Welcome to the CourseCloud API');
});

router.route('/nlp').post((req, res) => {
  NLP.analyzeCourses(req.body.targets, req.body.subject, req.body.course).then((resp) => {res.send({ status: 200, error: null, resp })}).catch((err) =>{
    console.log(err);
    res.status(err.code.status).send({
      status: err.code.status,
      error: err.error,
      response: err.code.message,
    });
  })
});

router.route('/chatbot/session').get((req, res) => {
  Chatbot.createSession().then((response)=> {res.send({ status: 200, error: null, response })}).catch((err) =>{
    console.log(err);
    res.status(err.code.status).send({
      status: err.code.status,
      error: err.error,
      response: err.code.message,
    });
  })
});

router.route('/chatbot/message').post((req, res) => {
  Chatbot.message(req.body.message, req.body.sessionId).then((response)=> {res.send({ status: 200, error: null, response })}).catch((err) =>{
    console.log(err);
    res.status(err.code.status).send({
      status: err.code.status,
      error: err.error,
      response: err.code.message,
    });
  })
});

export default router;