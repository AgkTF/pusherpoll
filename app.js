require('dotenv').config()
const express       = require('express');
const path          = require('path');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const pollRoute     = require('./routes/poll');

// DB config
require('./config/db');

const app = express();

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable CORS
app.use(cors());

app.use('/poll', pollRoute);

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log('PusherPoll Server has started...');
});