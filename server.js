import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes/userRoutes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middleware --------------------

// Pasta pública (CSS, JS, imagens, uploads)
app.use(express.static(path.join(__dirname, "public")));

// Para receber JSON e dados URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Rotas --------------------

// Teste do servidor
app.get("/teste", (req, res) => res.send("Servidor funcionando!"));

// Rotas da API de usuários
app.use("/api/users", routes);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// -------------------- Inicia o servidor --------------------
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
