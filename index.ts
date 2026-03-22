import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import { z } from "zod";
const PORT = 3000;

dotenv.config();
const app = express();
const { Pool } = pg;

const envSchema = z.object({
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_PASSWORD: z.string(),
});

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error(
    "Environment variable validation failed:",
    z.treeifyError(validatedEnv.error),
  );
  process.exit(1);
}

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD } = validatedEnv.data;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
});

// const gameStudioSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: "Your name needs to include at least 2 characters" })
//     .max(50, { message: "Your name needs to include at most 50 characters" }),
//   title: z.string().min(1).max(100),
//   score: z.number().min(0).max(1000000),
// });

app.use(express.json());

app.get("/players-scores", async (req, res) => {
  try {
    const result =
      await pool.query(`SELECT players.name, games.title, scores.score, scores.date_played
      FROM scores
      JOIN players ON players.id = scores.player_id
      JOIN games   ON games.id   = scores.game_id`);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.get("/top-players", async (req, res) => {
  try {
    const result = await pool.query(`SELECT players.name, scores.score      
    FROM scores
    JOIN players ON players.id = scores.player_id
    GROUP BY players.name, scores.score
    ORDER BY  scores.score DESC
    LIMIT 3;`);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.get("/inactive-players", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
    players.name 
    FROM players
    LEFT JOIN scores ON players.id = scores.player_id
    WHERE scores.id IS NULL;`);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.get("/popular-genres", async (req, res) => {
  try {
    const result = await pool.query(`SELECT genre, COUNT(*) as game_count
    from games
    GROUP BY genre;`);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.get("/recent-players", async (req, res) => {
  try {
    const result =
      await pool.query(`SELECT players.name AS player_name, players.join_date
    FROM players
    WHERE players.join_date >= CURRENT_DATE - INTERVAL '30 days'
    ORDER BY players.join_date DESC;`);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.listen(3000, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
