const express = require('express');
const { createPost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Cria um novo post
 *     description: Cria um novo post com título, autor e descrição.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: title
 *         in: body
 *         description: O título do post.
 *         required: true
 *         type: string
 *       - name: autor
 *         in: body
 *         description: O nome do autor.
 *         required: true
 *         type: string
 *       - name: descricao
 *         in: body
 *         description: A descrição do post.
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token JWT inválido ou ausente.
 */
router.post('/', authMiddleware, createPost);

// Outras rotas para posts (get, update, delete) seriam adicionadas aqui

module.exports = router;
