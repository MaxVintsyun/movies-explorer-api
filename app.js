const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
