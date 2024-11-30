const express = require("express");
const cors = require("cors"); // Import cors

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API de Post, Usuário e Professor",
      description:
        "Documentação da API para gerenciamento de posts, usuários e professores.",
      version: "1.0.0",
      contact: {
        name: "Seu Nome",
        email: "seuemail@dominio.com",
      },
    },
    host: "localhost:5000",
    basePath: "/",
  },
  apis: ["./routes/*.js"], // O caminho para os arquivos de rota que contêm a documentação Swagger
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Rota para acessar a documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
