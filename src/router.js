import { Router } from 'express';
const router = Router();

require('dotenv').config(); // load environment variables
var bodyParser = require('body-parser')


router.route('/').get((req, res) => {
  res.send('Welcome to the CourseCloud API');
});


export default router;