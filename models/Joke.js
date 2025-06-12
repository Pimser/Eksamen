// Eksempel på en Mongoose-modell
const mongoose = require('mongoose');

const JokeSchema = new mongoose.Schema({
  type: { type: String },
  setup: { type: String, required: true },
  punchline: { type: String, required: true },
  externalId: { type: Number }, // id fra API hvis ønskelig
  createdAt: { type: Date, default: Date.now },
  ratingSum: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Joke', JokeSchema);
