//Adiconar  conteudo do usercontrole

const User = require("../models/professor");

exports.createUser = async (req, res) => {
  const { nome, especialidade } = req.body;

  try {
    const user = new User({ nome, especialidade });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar o Usuáio" });
  }
};
// Buscar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar os usuários', error: err.message });
  }
};

// Buscar um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar o usuário', error: err.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  const { titulo, autor, descricao } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { titulo, autor, descricao },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar o usuário', error: err.message });
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.status(200).json({ msg: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao deletar o usuário', error: err.message });
  }
};
