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

// Buscar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar os posts', error: err.message });
  }
};

// Buscar um post por ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar o post', error: err.message });
  }
};

// Atualizar um post
exports.updatePost = async (req, res) => {
  const { titulo, autor, descricao } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { titulo, autor, descricao },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar o post', error: err.message });
  }
};

// Deletar um post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    res.status(200).json({ msg: 'Post deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao deletar o post', error: err.message });
  }
};


// Outros métodos CRUD (read, update, delete) seriam implementados aqui
