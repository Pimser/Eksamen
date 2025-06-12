const axios = require('axios');
const Joke = require('../models/Joke');

exports.home = (req, res) => {
  res.render('index', { title: 'Velkommen', page: 'index' });
};

// Viser vits og håndterer stjernerating
exports.getJoke = async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    let joke = await Joke.findOne({ externalId: response.data.id });
    if (!joke) {
      joke = await Joke.create({
        type: response.data.type,
        setup: response.data.setup,
        punchline: response.data.punchline,
        externalId: response.data.id
      });
    }
    // Sender kun joke til viewet, ikke ratingScript
    res.render('vitsView', { joke });
  } catch (error) {
    res.render('vitsView', { joke: { setup: 'Kunne ikke hente vits.', punchline: '' } });
  }
};

exports.rateJoke = async (req, res) => {
  const { jokeId, rating } = req.body;
  if (!jokeId || !rating) return res.redirect('/vits');
  const joke = await Joke.findById(jokeId);
  let avgRating = null;
  if (joke) {
    joke.ratingSum += parseInt(rating);
    joke.ratingCount += 1;
    await joke.save();
    avgRating = joke.ratingSum / joke.ratingCount;
  }
  // Sender med vitsen og avgRating til viewet, og flagg for at det er etter rating
  res.render('vitsView', { joke, avgRating, justRated: true });
};

exports.topJokes = async (req, res) => {
  const jokes = await Joke.aggregate([
    { $addFields: { avgRating: { $cond: [ { $eq: ["$ratingCount", 0] }, 0, { $divide: ["$ratingSum", "$ratingCount"] } ] } } },
    { $sort: { avgRating: -1, ratingCount: -1, createdAt: 1 } }
  ]);
  res.render('topJokes', { jokes });
};

exports.faq = (req, res) => {
  res.render('faq', { title: 'FAQ' });
};

// Hent en spesifikk vits for vurdering
exports.getJokeById = async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (!joke) {
      return res.status(404).render('vitsView', { joke: { setup: 'Fant ikke vitsen.', punchline: '' } });
    }
    let avgRating = null;
    if (joke.ratingCount > 0) {
      avgRating = joke.ratingSum / joke.ratingCount;
    }
    res.render('vitsView', { joke, avgRating });
  } catch (error) {
    res.status(500).render('vitsView', { joke: { setup: 'Noe gikk galt.', punchline: '' } });
  }
};

// Håndterer alle andre ruter (404)
exports.notFound = (req, res) => {
  res.status(404).render('index', { title: 'Ikke funnet' });
};


