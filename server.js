import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import fsSync from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');

if (!fsSync.existsSync(UPLOAD_DIR)) fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

// MySQL pool - configure via .env
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'creativepik',
  waitForConnections: true,
  connectionLimit: 10
});

// testa conexão ao iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('MySQL conectado com sucesso (pool ok).');
  } catch (err) {
    console.error('Falha ao conectar no MySQL — verifique .env e DB:', err.message || err);
  }
})();

// Multer config (necessário antes de usar upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${ts}-${safe}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => (file.mimetype && file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Apenas imagens são permitidas'))),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// rota de diagnóstico
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// GET /api/licenses - retorna licenças do banco (apenas banco)
app.get('/api/licenses', async (req, res) => {
  console.log('recebida requisição GET /api/licenses');
  try {
    const [rows] = await pool.query('SELECT id, nome, descricao, logo FROM licenca ORDER BY id ASC');
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn('/api/licenses -> nenhuma licença encontrada no banco');
      return res.status(204).json([]); // sem conteúdo
    }
    console.log(`/api/licenses -> ${rows.length} licenças carregadas do banco`);
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar licenças no banco:', err.message || err);
    return res.status(500).json({ error: 'Erro ao buscar licenças no banco' });
  }
});

// endpoint de upload: título obrigatório, license (pode ser id ou nome)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const { title, description = '', license = '', userId } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ error: 'Título é obrigatório' });

    const fkUsuario = userId ? Number(userId) : Number(process.env.DEFAULT_USER_ID || 1);
    const fileUrl = `/uploads/${req.file.filename}`;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rImg] = await conn.execute(
        'INSERT INTO imagem (data_criacao, titulo, descricao, url, fk_Usuario_id) VALUES (CURDATE(), ?, ?, ?, ?)',
        [title.trim(), description, fileUrl, fkUsuario]
      );
      const imagemId = rImg.insertId;

      let licencaId = null;
      if (license && String(license).trim() !== '') {
        const licRaw = String(license).trim();
        if (/^\d+$/.test(licRaw)) {
          const [rows] = await conn.execute('SELECT id FROM licenca WHERE id = ?', [Number(licRaw)]);
          if (rows.length > 0) licencaId = rows[0].id;
        } else {
          const [rows] = await conn.execute('SELECT id FROM licenca WHERE nome = ?', [licRaw]);
          if (rows.length > 0) licencaId = rows[0].id;
          else {
            const [rLic] = await conn.execute('INSERT INTO licenca (nome, descricao) VALUES (?, ?)', [licRaw, '']);
            licencaId = rLic.insertId;
          }
        }
        if (licencaId) {
          await conn.execute('INSERT INTO licenca_imagem (fk_Licenca_id, fk_Imagem_id) VALUES (?, ?)', [licencaId, imagemId]);
        }
      }

      await conn.commit();
      return res.json({ success: true, image: { id: imagemId, titulo: title.trim(), descricao, url: fileUrl, licenca_id: licencaId } });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Erro no servidor' });
  }
});

// lista imagens - mais recentes primeiro
app.get('/api/images', async (req, res) => {
  try {
    const sql = `
      SELECT i.id, i.titulo, i.descricao, i.url, i.data_criacao,
             u.nome AS autor,
             l.id AS licenca_id, l.nome AS licenca_nome, l.descricao AS licenca_descricao
      FROM imagem i
      LEFT JOIN usuario u ON i.fk_Usuario_id = u.id
      LEFT JOIN licenca_imagem li ON li.fk_Imagem_id = i.id
      LEFT JOIN licenca l ON li.fk_Licenca_id = l.id
      ORDER BY i.id DESC
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao ler imagens' });
  }
});

// inicializa servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
