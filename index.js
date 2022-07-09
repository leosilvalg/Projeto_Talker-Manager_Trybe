const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const data = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (request, response) => {
  const talkerPersons = JSON.parse(fs.readFileSync(data));
  response.status(HTTP_OK_STATUS).send(talkerPersons);
});

app.listen(PORT, () => {
  console.log('Online');
});
