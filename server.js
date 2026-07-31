import express from "express";
import dotenv from "dotenv";
import db from './db/db.js';
import userRoutes from './routes/user.route.js';
import recetteRoutes from './routes/recette.route.js';
import noteRoutes from './routes/note.route.js';
import ingredientRoutes from './routes/ingredient.route.js';
import categorieRoutes from './routes/categorie.route.js';
import moderationRoutes from './routes/moderation.route.js';
import cors from "cors"
import path from "node:path";
import { fileURLToPath } from "node:url";
dotenv.config();
// Correction pour __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://bravocuistot-goli.fr",
  "https://www.bravocuistot-goli.fr",
];

app.use(
  cors({
    origin(origin, callback) {
      // Autorise Insomnia/Postman et les origines déclarées
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origine CORS refusée : ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
db();

 
const port = process.env.PORT;
app.listen(port, () => {
console.log(`Le serveur écoute sur le port ${port}`)
});

// routes----------

app.use('/categorie', categorieRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/note', noteRoutes);
app.use('/recette', recetteRoutes);
app.use('/user', userRoutes);
app.use("/moderation", moderationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));