import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

// import bulletinrouter from './bulletinapi.js';

const app = express();
const PORT = 5000; // USE DOTENV

app.use(cors());

// set up server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

// allows routes to parse json
app.use(express.json());

// initialize database
const db = new sqlite3.Database(
  "peertutoringdb.sqlite",
  (err: Error | null) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("connected to the database");
  }
);

// api route for filtering through tutors by either name or hall
app.get("/api/tutors/search", (req: Request, res: Response) => {
  const { name, hall } = req.query as { name?: string; hall?: string };
  let query = "SELECT * FROM tutors WHERE 1=1";
  const params: (string | number)[] = [];

  if (name) {
    // trim so no whitespace
    const trimmedName = name.trim();

    // use full name (first + last) for matching
    query += " AND LOWER(fname || ' ' || lname) LIKE LOWER(?)";
    params.push(`%${trimmedName}%`);
  }
  if (hall) {
    // the frontend sends back a comma list for multiple halls, so handle that
    if (hall.includes(",")) {
      const hallList = hall
        .split(",")
        // maps everything to an int and filters out any NaN values
        .map((h) => parseInt(h.trim()))
        .filter((h) => !isNaN(h));
      if (hallList.length === 0) {
        return res.status(400).json({ error: "Invalid hall parameter" });
      }

      // appends to query and params for multiple halls
      query += " AND hall IN (" + hallList.map(() => "?").join(",") + ")";
      params.push(...hallList);

      // for when there is only 1 hall, just parse int
    } else {
      const hallInt = parseInt(hall);
      if (isNaN(hallInt)) {
        return res.status(400).json({ error: "Invalid hall parameter" });
      }
      query += " AND hall = ?";
      params.push(hallInt);
    }
  }

  // debug log statement of query
  console.log("Executing Query:", query, "Params:", params);

  // execute the query
  db.all(query, params, (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Error retrieving tutors" });
      return;
    }
app.use(express.json());



const db = new sqlite3.Database("peertutoringdb.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("connected to the database");
});

// app.use('/api', bulletinrouter); 

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

// api route for retrieving a whole lot about a tutor based on ID
app.get("/api/tutors/:id", (req: Request, res: Response) => {
  const tutorId = parseInt(req.params.id);

  // validate tutorId
  if (isNaN(tutorId) || tutorId <= 0) {
    return res.status(400).json({ error: "Invalid tutor ID" });
  }

  db.all(
    "SELECT * FROM tutors WHERE id = ?",
    [tutorId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error retrieving tutor data" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      res.status(200).json(rows[0]);
    }
  );
});

// api route for retrieving parseable string of classes for a given tutor based on ID
app.get("/api/tutors/:id/classes", (req: Request, res: Response) => {
  const tutorId = req.params.id;
  db.all(
    "SELECT physics,chem,biology,sciother,mathother,mathcore,cs,language FROM tutors WHERE id=?",
    [tutorId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        return res.send("Error retrieving classes");
      }
      res.status(200).json(rows);
    }
  );
});

// api route for retrieving schedule string for a tutor
app.get("/api/tutors/:id/schedule", (req: Request, res: Response) => {
  const tutorId = req.params.id;

  db.get(
    "SELECT availability FROM tutors WHERE id = ?",
    [tutorId],
    (err: Error | null, row: any) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error retrieving schedule" });
      }

      if (!row) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      // Return the raw schedule string
      res.status(200).json({ availability: row.availability || "" });
    }
  );
});

// test api route for fun
app.get("/api/test", (req: Request, res: Response) => {
  db.all("SELECT * FROM tutors", (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("Database Error:", err);
      res.status(500).send("Database error occurred");
      return;
    }
    console.log("Fetched tutors:", rows); // ensure this is visible
    res.status(200).json(rows);
  });
  console.log("Test route hit!");
app.get("/api/schedule", (req, res) => {
  db.all("SELECT * FROM schedule", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error retrieving schedule" });
    }
    res.status(200).json(rows);
  });
});
