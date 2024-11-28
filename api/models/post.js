const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  descricao: { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);
