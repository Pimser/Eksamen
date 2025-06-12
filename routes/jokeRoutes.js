const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');


//GET
router.get('/', jokeController.home);
router.get('/vits', jokeController.getJoke);
router.get('/faq', jokeController.faq);
router.get('/top', jokeController.topJokes);
router.get('/joke/:id', jokeController.getJokeById);

//POST
router.post('/vits/rate', jokeController.rateJoke);

// Håndterer alle andre ruter
router.use((req, res) => {
  jokeController.notFound(req, res);
});

module.exports = router;
