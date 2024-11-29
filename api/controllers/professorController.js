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
// Buscar todos os professores
exports.getProfessores = async (req, res) => {
  try {
    const professores = await Professor.find();
    res.status(200).json(professores);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar os professores', error: err.message });
  }
};

// Buscar um professor por ID
exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor) return res.status(404).json({ msg: 'Professor não encontrado' });
    res.status(200).json(professor);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar o professor', error: err.message });
  }
};

// Atualizar um professor
exports.updateProfessor = async (req, res) => {
  const { nome, especialidade } = req.body;

  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      { nome, especialidade },
      { new: true, runValidators: true }
    );
    if (!professor) return res.status(404).json({ msg: 'Professor não encontrado' });
    res.status(200).json(professor);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar o professor', error: err.message });
  }
};

// Deletar um professor
exports.deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    if (!professor) return res.status(404).json({ msg: 'Professor não encontrado' });
    res.status(200).json({ msg: 'Professor deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao deletar o professor', error: err.message });
  }
};
