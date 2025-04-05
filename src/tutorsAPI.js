const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// set up server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

// i think this allows the routes to use json but i'm not sure
app.use(express.json());

// initialize database
const db = new sqlite3.Database("peertutoringdb.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("connected to the database");
});

// api route for filtering through tutors by either name or hall
app.get("/api/tutors/search", (req, res) => {
  console.log("Search hit!");
  const { name, hall } = req.query;
  let query = "SELECT * FROM tutors WHERE 1=1";
  let params = [];

  if (name) {
    query += " AND (LOWER(fname) = LOWER(?) OR LOWER(lname) = LOWER(?))";
    params.push(name, name);
  }
  if (hall) {
    const hallInt = parseInt(hall);
    if (!isNaN(hallInt)) {
      query += " AND hall = ?";
      params.push(hallInt);
    } else {
      return res.status(400).json({ error: "Invalid hall parameter" }); 
    }
  }

  console.log("Executing Query:", query, "Params:", params);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Error retrieving tutors" });
      return;
    }
    console.log("Query Result:", rows);
    res.json(rows);
  });
});

// api route for retrieving name given an id
app.get("/api/tutors/:id", (req, res) => {
  	const tutorId = req.params.id;
	if (isNaN(tutorId) || tutorId <= 0) {
    	return res.status(400).json({ error: "Invalid tutor ID" });
  	}
  db.all(
    "SELECT fname, lname FROM tutors WHERE id = ?",
    [parseInt(tutorId)],
	(err, rows) => {
      if (err) {
        console.error(err);  // Log error for debugging purposes
        return res.status(500).json({ error: "Error retrieving tutor name" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      res.status(200).json({ // 200 status means "ok", 404 is your typical "page not found" and "500" means there's some problem with the db
        id: tutorId,
        fname: rows[0].fname,
        lname: rows[0].lname,
      });
      res.json(rows);
    }
  );
});

// api route for retrieving parseable string of classes for a given tutor based on ID
app.get("/api/tutors/:id/classes", (req, res) => {
  const tutorId = req.params.id;
  db.all(
    "SELECT physics,chem,biology,sciother,mathother,mathcore,cs,language FROM tutors WHERE id=?",
    [tutorId],
    (err, rows) => {
      if (err) {
        return res.send("Error retrieving classes");
      }
      res.json(rows);
    }
  );
});


app.get("/api/test", (req, res) => {
  db.all("SELECT * FROM tutors", (err, rows) => {
    if (err) {
      console.error("Database Error:", err);
      res.status(500).send("Database error occurred");
      return;
    }
    console.log("Fetched tutors:", rows); // Ensure this is visible
    res.json(rows);
  });
  console.log("Test route hit!");
});
