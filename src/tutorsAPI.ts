import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 5000;

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
    res.json(rows);
  });
});

// api route for retrieving name given an id
app.get("/api/tutors/:id", (req: Request, res: Response) => {
  const tutorId = parseInt(req.params.id);

  // validate tutorId
  if (isNaN(tutorId) || tutorId <= 0) {
    return res.status(400).json({ error: "Invalid tutor ID" });
  }

  db.all(
    "SELECT fname, lname FROM tutors WHERE id = ?",
    [tutorId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error retrieving tutor name" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      res.status(200).json({
        // 200 status means "ok", 404 is your typical "page not found" and "500" means there's some problem with the db
        id: tutorId,
        fname: rows[0].fname,
        lname: rows[0].lname,
      });
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
});
