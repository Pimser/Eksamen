const axios = require('axios');
const Joke = require('../models/Joke');

exports.home = (req, res) => {
  res.render('index', { title: 'Velkommen' });
};

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
    res.render('vitsView', { joke });
  } catch (error) {
    res.render('vitsView', { joke: { setup: 'Kunne ikke hente vits.', punchline: '' } });
  }
};

exports.rateJoke = async (req, res) => {
  const { jokeId, rating } = req.body;
  if (!jokeId || !rating) return res.redirect('/vits');
  const joke = await Joke.findById(jokeId);
  if (joke) {
    joke.ratingSum += parseInt(rating);
    joke.ratingCount += 1;
    await joke.save();
  }
  res.redirect('/top');
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

// Håndterer alle andre ruter (404)
exports.notFound = (req, res) => {
  res.status(404).render('index', { title: 'Ikke funnet' });
};


