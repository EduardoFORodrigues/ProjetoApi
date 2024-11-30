const express = require('express');
const { createUsuario } = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();



router.post('/', authMiddleware, createProfessor);

// Outras rotas para professores (get, update, delete) seriam adicionadas aqui
router.post('/',usuarioController.createUsuario);
router.get('/',usuarioController.getUsuario);
router.get('/:id',usuarioController.getUsuarioById);
router.put('/:id',usuarioController.updateUsuario);
router.delete('/:id',usuarioController.deleteUsuario);

module.exports = router;
