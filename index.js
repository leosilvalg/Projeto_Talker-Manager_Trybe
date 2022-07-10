const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { randomBytes } = require('crypto');
const loginValidationMiddleware = require('./middlewares/loginValidate.js');
const { tokenValidation,
nameValidation,
ageValidation,
talkValidation,
watchValidate,
rateValidate } = require('./middlewares/talkerValidate');

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
  if (!talkerPersons) return response.status(200).json([]);
  response.status(HTTP_OK_STATUS).send(talkerPersons);
});

app.get('/talker/:id', async (request, response) => {
  const talkerPersons = await JSON.parse(fs.readFileSync(data));
  const { id } = request.params;
  const userId = talkerPersons.find((e) => e.id === Number(id));
  if (!userId) {
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } return response.status(HTTP_OK_STATUS).send(userId);
});

app.post('/login', loginValidationMiddleware, async (_request, response) => {
  try {
    const tokenAleatorio = randomBytes(8).toString('hex');
    const tokenRandom = {
      token: tokenAleatorio,
    };
    response.status(HTTP_OK_STATUS).json(tokenRandom);
  } catch (err) {
    return response.status(500).end();
  }
});

app.post('/talker', 
tokenValidation, 
nameValidation, 
ageValidation, 
talkValidation, 
watchValidate, 
rateValidate, async (request, response) => {
  const { name, age, talk } = request.body;
  const { watchedAt, rate } = talk;
  const dataPath = fs.readFileSync(data, 'utf8');
  const parsed = JSON.parse(dataPath);
  const id = parsed.length + 1;
  const newPerson = { id, name, age, talk: { watchedAt, rate } };
  parsed.push(newPerson);
  fs.writeFileSync(data, JSON.stringify(parsed));
  return response.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log('Online');
});
