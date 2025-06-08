import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

app.use(express.json());
app.use(express.static('./'));

const db = new sqlite3.Database("peertutoringdb.sqlite", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("connected to the database.");
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.get('/', (req, res) => {
    res.sendFile('./schedule-form.html');
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
            message: 'Schedule entry added successfully',
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

