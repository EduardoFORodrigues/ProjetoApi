const Professor = require('../models/professor');

exports.createProfessor = async (req, res) => {
  const { nome, especialidade } = req.body;

  try {
    const professor = new Professor({ nome, especialidade });
    await professor.save();
    res.status(201).json(professor);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar o professor' });
  }
};

// Outros métodos CRUD (read, update, delete) seriam implementados aqui
