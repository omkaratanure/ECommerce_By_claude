import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db/pool.js";
import { initDb } from "./db/init.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function mapOrder(row) {
  return {
    id: row.id,
    items: row.items,
    total: Number(row.total),
    shipping: row.shipping,
    placedAt: row.placed_at,
  };
}

function mapProduct(row) {
  return { ...row, price: Number(row.price) };
}

const app = express();

// Must be mounted before express.json() -- Better Auth needs the raw request stream.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

async function requireSession(req, res, next) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "Authentication required" });
  req.session = session;
  next();
}

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(rows.map(mapProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM products ORDER BY category");
    res.json(rows.map((r) => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(mapProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

app.get("/api/orders/mine", requireSession, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY placed_at DESC",
      [req.session.user.id]
    );
    res.json(rows.map(mapOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

app.get("/api/orders/:id", requireSession, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (rows.length === 0 || rows[0].user_id !== req.session.user.id) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(mapOrder(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load order" });
  }
});

app.post("/api/orders", requireSession, async (req, res) => {
  const { items, total, shipping } = req.body;
  if (!Array.isArray(items) || items.length === 0 || typeof total !== "number" || !shipping) {
    return res.status(400).json({ error: "items, total, and shipping are required" });
  }

  try {
    const id = `ORD-${Date.now()}`;
    await pool.query(
      `INSERT INTO orders (id, user_id, items, total, shipping) VALUES (?, ?, ?, ?, ?)`,
      [id, req.session.user.id, JSON.stringify(items), total, JSON.stringify(shipping)]
    );
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    res.status(201).json(mapOrder(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.use(express.static(distDir));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
