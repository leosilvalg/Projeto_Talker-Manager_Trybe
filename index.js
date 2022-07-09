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

const loginValidationMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  const regex = /\S+@\S+\.\S+/;
  const emailVerification = regex.test(email);
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailVerification) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

app.post('/login', loginValidationMiddleware, (_request, response) => {
  const tokenAleatorio = randomUUID().split('-').join('').substring(0, 16);
  const tokenRandom = {
    token: tokenAleatorio,
  };
  response.status(HTTP_OK_STATUS).json(tokenRandom);
});

app.listen(PORT, () => {
  console.log('Online');
});
