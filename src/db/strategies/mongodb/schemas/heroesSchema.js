const Mongoose = require('mongoose');

const HeroesSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  poder: {
    type: String,
    required: true
  },
  insertedAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = Mongoose.model('heroes', HeroesSchema);