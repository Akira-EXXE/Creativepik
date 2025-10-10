import { db } from "../database/Data.js";
import bcrypt from "bcryptjs";

/**
 * Cadastra um novo usuário
 */
export async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    console.log("Dados recebidos para registro:", { nome, email, senha, telefone });

    // Verifica se já existe usuário com o mesmo email
    const [existingUsers] = await db.query(
      "SELECT id FROM Usuario WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    // Criptografa a senha
    const hash = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco
    const insertQuery = `
      INSERT INTO Usuario (nome, email, senha, telefone, data_criacao, fk_Tipo_id)
      VALUES (?, ?, ?, NOW(), 2)
    `;

    const [result] = await db.query(insertQuery, [nome, email, hash]);

    console.log("Usuário inserido com sucesso, ID:", result.insertId);

    res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: result.insertId });
  } catch (err) {
    console.error("Erro no registro:", err);

    // Caso seja erro de foreign key ou coluna inexistente, retorne mensagem clara
    if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ error: "Erro no banco de dados: tabela ou chave estrangeira inválida." });
    }

    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
}

/**
 * Realiza login do usuário
 */
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Validação de campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    console.log("Tentativa de login:", { email });

    // Busca usuário pelo email
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    // Verifica senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Remove a senha antes de retornar
    const { senha: _, ...usuarioSemSenha } = usuario;

    console.log("Login bem-sucedido para ID:", usuario.id);

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: usuarioSemSenha
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
}
