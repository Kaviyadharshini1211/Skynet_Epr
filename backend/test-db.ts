import { Client } from "pg"
import dotenv from "dotenv"

dotenv.config()

async function testConnection() {

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  try {

    console.log("Connecting with config:")
    console.log({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    await client.connect()

    console.log("✅ Database connected successfully")

    const res = await client.query("SELECT NOW()")

    console.log("Server time:", res.rows[0])

    await client.end()

  } catch (err) {

    console.error("❌ Connection failed")
    console.error(err)

  }

}

testConnection()