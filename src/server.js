import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

import router from './router';

require('dotenv').config(); // load environment variables

// initialize
// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);
// default index route
app.get('/', (req, res) => {
    res.send('👋');
  });
// START THE SERVER
// =============================================================================
const port = process.env.PORT || 3030;

app.listen(port);

console.log(`listening on: ${port}`);