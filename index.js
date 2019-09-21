const express = require("express");
const path = require("path");
const { Pool } = require("pg");

// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée PostgreSQL
const pool = new Pool({
  user: "mystere",
  host: "xxxxx.elephantsql.com",
  database: "mystere",
  password: "untrucsecretquinarienafaireici",
  port: 5432
});
console.log("Connexion réussie à la base de données");

// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS Livres (
  Livre_ID SERIAL PRIMARY KEY,
  Titre VARCHAR(100) NOT NULL,
  Auteur VARCHAR(100) NOT NULL,
  Commentaires TEXT
);`;
pool.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
  // Alimentation de la table
  const sql_insert = `INSERT INTO Livres (Livre_ID, Titre, Auteur, Commentaires) VALUES
    (1, 'Mrs. Bridge', 'Evan S. Connell', 'Premier de la série'),
    (2, 'Mr. Bridge', 'Evan S. Connell', 'Second de la série'),
    (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne')
  ON CONFLICT DO NOTHING;`;
  pool.query(sql_insert, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    const sql_sequence = "SELECT SETVAL('Livres_Livre_ID_Seq', MAX(Livre_ID)) FROM Livres;";
    pool.query(sql_sequence, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Alimentation réussie de la table 'Livres'");
    });
  });
});

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

// GET /livres
app.get("/livres", (req, res) => {
  const sql = "SELECT * FROM Livres ORDER BY Titre";
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("livres", { model: result.rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES ($1, $2, $3)";
  const book = [req.body.titre, req.body.auteur, req.body.commentaires];
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: result.rows[0] });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.titre, req.body.auteur, req.body.commentaires, id];
  const sql = "UPDATE Livres SET Titre = $1, Auteur = $2, Commentaires = $3 WHERE (Livre_ID = $4)";
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: result.rows[0] });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Livres WHERE Livre_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});
