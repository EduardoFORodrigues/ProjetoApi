const User = require("../models/user");

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
  const { nome, email, senha, type } = req.body;
  try {
    // Validação para aceitar apenas aluno ou professor como tipo
    if (!["aluno", "professor"].includes(type)) {
      return res
        .status(400)
        .json({ msg: "O tipo deve ser 'aluno' ou 'professor'" });
    }

    const user = new User({ nome, email, senha, type });
    console.log(user);
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso", user });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro ao criar o usuário", error: err.message });
  }
};

// Buscar todos os usuários por tipo
exports.getUsersByType = async (req, res) => {
  const { type } = req.params;

  try {
    // Verifica se o tipo é válido
    if (!["aluno", "professor"].includes(type)) {
      return res
        .status(400)
        .json({ msg: "Tipo inválido, use 'aluno' ou 'professor'" });
    }

    const users = await User.find({ type });
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar usuários", error: err.message });
  }
};

// Buscar um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar o usuário", error: err.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  const { nome, email } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

    if (nome) user.nome = nome;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ msg: "Usuário atualizado com sucesso", user });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro ao atualizar o usuário", error: err.message });
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Erro ao deletar o usuário", error: err.message });
  }
};
