import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and add your PlanetScale connection string.");
}

const pool = mysql.createPool(process.env.DATABASE_URL);

export default pool;
