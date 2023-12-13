const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movies');
const urlRegex = require('../utils/constants');

router.get('/', getUserMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = router;
