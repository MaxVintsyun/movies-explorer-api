const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

function throwMovieError(err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return new BadRequestError('Переданы некорректные данные');
  }
  return err;
}

module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError('Не найдены фильмы пользователя'))
    .then((movies) => res.send(movies))
    .catch((err) => (next(throwMovieError(err))));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => next(throwMovieError(err)));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы не являетесь владельцем фильма');
      }
      return Movie.deleteOne(movie);
    })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(throwMovieError(err)));
};
