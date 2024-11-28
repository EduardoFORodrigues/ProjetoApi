const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Recebe as credenciais (email e senha) e retorna um token JWT.
 *     parameters:
 *       - name: email
 *         in: body
 *         description: O email do usuário.
 *         required: true
 *         type: string
 *       - name: senha
 *         in: body
 *         description: A senha do usuário.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token JWT.
 *       400:
 *         description: Dados inválidos ou usuário não encontrado.
 */

router.post('/login', login);

module.exports = router;
