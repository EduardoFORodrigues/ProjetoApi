const Post = require('../models/post');

exports.createPost = async (req, res) => {
  const { titulo, autor, descricao } = req.body;

  try {
    const post = new Post({ titulo, autor, descricao });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar o post' });
  }
};

// Outros métodos CRUD (read, update, delete) seriam implementados aqui
