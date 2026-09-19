import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./pool.js";
import seedProducts from "../data/products.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

export async function initDb() {
  const statements = schema.split(";").map((s) => s.trim()).filter(Boolean);
  for (const statement of statements) {
    await pool.query(statement);
  }

  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM products");
  if (Number(rows[0].count) > 0) return;

  for (const p of seedProducts) {
    await pool.query(
      `INSERT INTO products (id, name, category, price, stock, image, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.category, p.price, p.stock, p.image, p.description]
    );
  }
  console.log(`Seeded ${seedProducts.length} products`);
}
