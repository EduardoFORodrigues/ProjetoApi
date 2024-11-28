const express = require('express');
const { createProfessor } = require('../controllers/professorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/professores:
 *   post:
 *     summary: Cria um novo professor
 *     description: Cria um novo professor com nome e especialidade.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: nome
 *         in: body
 *         description: O nome do professor.
 *         required: true
 *         type: string
 *       - name: especialidade
 *         in: body
 *         description: A especialidade do professor.
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Professor criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token JWT inválido ou ausente.
 */

router.post('/', authMiddleware, createProfessor);

// Outras rotas para professores (get, update, delete) seriam adicionadas aqui

module.exports = router;
