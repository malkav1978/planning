import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL n'est pas défini. Copiez .env.example vers .env et renseignez-le.")
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db = drizzle(pool)

  console.log("Application des migrations...")
  await migrate(db, { migrationsFolder: "./drizzle" })
  console.log("Migrations appliquées avec succès.")

  await pool.end()
}

main().catch((err) => {
  console.error("Échec de la migration :", err)
  process.exit(1)
})
