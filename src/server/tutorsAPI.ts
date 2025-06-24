import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({path: "../../.env"});

const PORT = process.env.PORT

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("peertutoringdb.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("connected to the database");
});

app.get('/api/bulletin', (req, res) => {
  console.log('GET /api/bulletin endpoint hit');
  const query = 'SELECT * FROM bulletin ORDER BY event_date DESC';
  console.log('Executing query:', query);
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error querying bulletin table:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Found rows:', rows);
    res.json(rows);
  });
});

app.post('/api/schedule', (req, res) => {
  const { title, course, teachers, location, date, time } = req.body;
  const sql = `INSERT INTO schedule (title, course, teachers, location, date, time) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [title, course, teachers, location, date, time], function(err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Schedule entry added',
      id: this.lastID 
    });
  });
});

app.get("/api/tutors/:id", (req, res) => { 
  const id = req.params.id;
  db.all("SELECT * FROM tutors WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/api/tutors", (req, res) => {
  db.all("SELECT * FROM tutors WHERE is_available = 1", [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/api/schedule", (req, res) => {
  db.all("SELECT * FROM schedule", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error retrieving schedule" });
    }
    res.status(200).json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
