import { db } from './src/database/Data.js';

async function test() {
  try {
    const [rows] = await db.query("SELECT 1+1 AS resultado");
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}

test();
