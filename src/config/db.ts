import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Traffic_Law_Chatbox_DB",
  port: parseInt(process.env.DB_PORT || "5432"),
});

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Successfully connected to the database");
    done();
  }
});
