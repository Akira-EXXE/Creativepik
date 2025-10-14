// src/controllers/userController.js
import { db } from "../database/Data.js";
import bcrypt from "bcryptjs";
import multer from "multer";

// -------------------- Cadastro --------------------
export async function register(req, res) {
  console.log("---- Novo cadastro ----");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { nome, email, senha } = req.body;
    const foto = req.file ? req.file.filename : "avatar.jpg"; // imagem padrão
    console.log("Foto que será salva:", foto);

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Verifica se o email já existe
    const [existing] = await db.query("SELECT id FROM Usuario WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    // Cria hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // Insere no banco
    const [result] = await db.query(
      `INSERT INTO Usuario (nome, email, senha, foto, data_criacao, fk_Tipo_id)
       VALUES (?, ?, ?, ?, NOW(), 2)`,
      [nome, email, hash, foto]
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: { id: result.insertId, nome, email, foto }
    });
  } catch (err) {
    console.error("Erro no registro:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Erro no upload da foto." });
    }

    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
}

// -------------------- Login --------------------
export async function login(req, res) {
  console.log("---- Login ----");
  console.log("req.body:", req.body);

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Busca o usuário pelo email
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const user = rows[0];

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Retorna os dados do usuário (sem a senha)
    res.json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        foto: user.foto
      }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao efetuar login." });
  }
}
