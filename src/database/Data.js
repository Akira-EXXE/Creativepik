import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "creativepik",
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conexão com o banco realizada com sucesso!");
    connection.release(); 
  } catch (err) {
    console.error("Erro ao conectar no banco de dados:", err.message);
  }
})();
