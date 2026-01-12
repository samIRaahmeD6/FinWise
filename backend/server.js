import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import db from "./database/db.js";

dotenv.config();
const app = express();

// ---- CORRECT CORS CONFIG ----
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(express.json());

// ---- MySQL Connection Test ----
db.getConnection((err, conn) => {
  if (err) console.error("MySQL connection error", err);
  else {
    console.log("Connected to MySQL");
    conn.release();
  }
});

app.use("/api", authRoutes);

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
