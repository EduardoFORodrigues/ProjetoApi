const jwt = require("jwt-simple");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(400).json({ msg: "Usuário não encontrado" });
  }

  const isMatch = await user.comparePassword(senha);
  if (!isMatch) {
    return res.status(400).json({ msg: "Senha inválida" });
  }

  const payload = { userId: user._id };
  const token = jwt.encode(payload, process.env.JWT_SECRET);

  res.json({ token });
};