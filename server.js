const express = require('express');
const logger = require('morgan');
const path = require('path');

const apiRouter = require('./routes/api');
const dbRouter = require('./routes/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/api', apiRouter);
app.use('/db', dbRouter);

app.listen(port, console.log("Server listening on ", port));
