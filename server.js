import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import fsSync from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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

// rotas de usuário (registro/login) - estava faltando montar esse router
// user routes mounted under /api/users
import userRoutes from './src/routes/userRoutes.js';
app.use('/api/users', userRoutes);

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

    // Ensure the 'fkUsuario' we use exists — avoid foreign-key failures if default user id doesn't exist.
    // determine a valid fkUsuario to use. Try, in order:
    // 1) userId supplied in body (if exists)
    // 2) DEFAULT_USER_ID env if configured and exists
    // 3) any existing user in the DB (pick first)
    // 4) create a fallback "Sistema" user and use it (only if DB has no users)
    let fkUsuario = null;
    const fileUrl = `/uploads/${req.file.filename}`;

    const conn = await pool.getConnection();
    try {
        console.log('/api/upload -> recebendo upload:', { title: title, userId: userId });
        // check provided userId first
      if (userId) {
        try {
          const [urows] = await conn.execute('SELECT id FROM usuario WHERE id = ?', [Number(userId)]);
          console.log('/api/upload -> userId lookup result count =', Array.isArray(urows) ? urows.length : 0);
          if (Array.isArray(urows) && urows.length > 0) fkUsuario = Number(userId);
        } catch (ux) {
          console.warn('Erro ao validar userId informado:', ux.message || ux);
        }
      }

      // if still no user, try DEFAULT_USER_ID env var
      if (!fkUsuario && process.env.DEFAULT_USER_ID) {
        try {
          const candidate = Number(process.env.DEFAULT_USER_ID);
          const [drows] = await conn.execute('SELECT id FROM usuario WHERE id = ?', [candidate]);
          console.log('/api/upload -> DEFAULT_USER_ID lookup result count =', Array.isArray(drows) ? drows.length : 0);
          if (Array.isArray(drows) && drows.length > 0) fkUsuario = candidate;
        } catch (dx) {
          console.warn('Erro ao validar DEFAULT_USER_ID:', dx.message || dx);
        }
      }

      // as a last fallback, try to find any existing user in the DB
      if (!fkUsuario) {
        try {
          const [anyUser] = await conn.execute('SELECT id FROM usuario ORDER BY id ASC LIMIT 1');
          console.log('/api/upload -> anyUser fallback lookup count =', Array.isArray(anyUser) ? anyUser.length : 0);
          if (Array.isArray(anyUser) && anyUser.length > 0) fkUsuario = anyUser[0].id;
        } catch (ax) {
          console.warn('Erro ao buscar usuário fallback:', ax.message || ax);
        }
      }

      // if still not found, create a fallback user so INSERT won't violate NOT NULL FK constraint
      if (!fkUsuario) {
        try {
          const defaultPassHash = await bcrypt.hash('change_me', 10);
          const [rUser] = await conn.execute(
            'INSERT INTO usuario (nome, email, senha, data_criacao, foto, fk_Tipo_id) VALUES (?, ?, ?, CURDATE(), ?, ?)',
            ['Sistema', 'system@localhost', defaultPassHash, 'avatar.jpg', 2]
          );
          fkUsuario = rUser.insertId;
          console.log('/api/upload -> criado usuário fallback id=' + fkUsuario + ' (insert result)', rUser);
        } catch (cx) {
          console.error('Erro ao criar usuário fallback:', cx.stack || cx.message || cx);
          // if even creation fails, set fkUsuario to 1 as last resort (may still fail)
          fkUsuario = process.env.DEFAULT_USER_ID ? Number(process.env.DEFAULT_USER_ID) : 1;
        }
      }
      await conn.beginTransaction();

      // ensure fkUsuario is a valid positive integer; try one more time to resolve if needed
      if (!Number.isInteger(fkUsuario) || fkUsuario <= 0) {
        try {
          const [anyUserAgain] = await conn.execute('SELECT id FROM usuario ORDER BY id ASC LIMIT 1');
          if (Array.isArray(anyUserAgain) && anyUserAgain.length > 0) fkUsuario = anyUserAgain[0].id;
        } catch (rx) {
          console.warn('Falha ao buscar usuário fallback extra:', rx.message || rx);
        }
      }

      if (!Number.isInteger(fkUsuario) || fkUsuario <= 0) {
        // If we still don't have a valid user id, try DEFAULT_USER_ID or 1
        fkUsuario = process.env.DEFAULT_USER_ID ? Number(process.env.DEFAULT_USER_ID) : 1;
      }

      console.log('/api/upload -> usando fkUsuario =', fkUsuario);

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
      // return the uploaded image data — use the request 'description' value as 'descricao' in the response
      return res.json({ success: true, image: { id: imagemId, titulo: title.trim(), descricao: description, url: fileUrl, licenca_id: licencaId } });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Erro em /api/upload ->', err && (err.stack || err.message || err));
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

// se uma rota /api/* não for encontrada — devolve JSON 404 (evita que /api requests retornem HTML)
app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'API endpoint not found' });
});

// inicializa servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
