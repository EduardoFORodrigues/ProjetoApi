const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  especialidade: { type: String, required: true },
});

module.exports = mongoose.model('Professor', professorSchema);
