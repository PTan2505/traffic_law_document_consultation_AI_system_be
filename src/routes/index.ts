import { Router } from "express";
import { pool } from "../config/db";

const router = Router();

router.get("/", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ time: result.rows[0] });
});

export default router;
