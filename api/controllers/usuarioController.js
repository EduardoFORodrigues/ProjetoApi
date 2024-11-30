const Usuario = require("../models/usuario");

// CREATE - Criar um novo usuário
exports.createUsuario = async (req, res) => {
  const { nome, especialidade } = req.body;

  try {
    const usuario = new Usuario({ nome, especialidade });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar o Usuário" });
  }
};

// READ - Obter todos os usuários
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar os Usuários" });
  }
};

// READ - Obter um único usuário pelo ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar o Usuário" });
  }
};

// UPDATE - Atualizar um usuário
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, especialidade } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { nome, especialidade },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar o Usuário" });
  }
};

// DELETE - Remover um usuário
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json({ msg: "Usuário removido com sucesso" });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao remover o Usuário" });
  }
};
