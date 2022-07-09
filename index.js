const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { randomUUID } = require('crypto');

const data = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_request, response) => {
  const talkerPersons = JSON.parse(fs.readFileSync(data));
  response.status(HTTP_OK_STATUS).send(talkerPersons);
});

app.get('/talker/:id', async (request, response) => {
  const talkerPersons = JSON.parse(fs.readFileSync(data));
  const { id } = request.params;
  const userId = talkerPersons.find((e) => e.id === Number(id));
  if (!userId) {
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } return response.status(HTTP_OK_STATUS).send(userId);
});

app.post('/login', (_request, response) => {
  const tokenAleatorio = randomUUID().split('-').join('').substring(0, 16);
  const tokenRandom = {
    token: tokenAleatorio,
  };
  response.status(HTTP_OK_STATUS).json(tokenRandom);
});

app.listen(PORT, () => {
  console.log('Online');
});
