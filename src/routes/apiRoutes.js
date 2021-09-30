const express = require('express');
const router = express.Router();
const genresController = require('../controllers/apis/apiGenreController')
const actorsController = require('../controllers/apis/apiActorsController')
const moviesController = require('../controllers/apis/apiMoviesController')


// GENRES
router.get('/genres', genresController.getAllGenres)
router.get('/genres/:id', genresController.getOneGenre)

//ACTORS
router.get('/actors', actorsController.getAllActors)
router.get('/actors/:id', actorsController.getOneActor)
router.post('/actors/create', actorsController.create)
router.put('/actors/update/:id', actorsController.update)
router.delete('/actors/delete/:id', actorsController.delete)

//MOVIES
router.get('/movies', moviesController.getAllMovies);
router.get('/movies/:id', moviesController.getOneMovie);
router.post('/movies/create', moviesController.create);
router.put('/movies/update/:id', moviesController.update);
router.delete('/movies/delete/:id', moviesController.delete);

module.exports = router