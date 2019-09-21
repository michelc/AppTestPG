const express = require("express");
const path = require("path");
const { Pool } = require("pg");

// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Connexion à la base de donnée PostgreSQL
const pool = new Pool({
  user: "mystere",
  host: "xxxxx.elephantsql.com",
  database: "mystere",
  password: "untrucsecretquinarienafaireici",
  port: 5432
});
console.log("Connexion réussie à la base de données");

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["un", "deux", "trois"]
  };
  res.render("data", { model: test });
});
