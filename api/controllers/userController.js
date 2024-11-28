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
