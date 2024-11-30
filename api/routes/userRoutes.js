const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rotas para criação de usuários
router.post("/", userController.createUser);

// Rotas para obter usuários por tipo (aluno/professor)
router.get("/:type", userController.getUsersByType);

// Rotas específicas por ID
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
