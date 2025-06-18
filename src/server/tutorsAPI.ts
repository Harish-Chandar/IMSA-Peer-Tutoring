import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.DBHOST || 5000;

// import bulletinrouter from './bulletinapi.js';

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

// create tutor endpoint
app.post("/api/tutors", (req: Request, res: Response) => {
  const {
    fname,
    lname,
    fbname,
    imsaid,
    email,
    blurb,
    hall,
    wing,
    image,
    availability,
    physics,
    chem,
    biology,
    sciother,
    mathother,
    mathcore,
    cs,
    language
  } = req.body;

  const sql = `INSERT INTO tutors 
    (fname, lname, fbname, imsaid, email, blurb, hall, wing, image, availability, 
     physics, chem, biology, sciother, mathother, mathcore, cs, language) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    fname || '',
    lname || '',
    fbname || '',
    imsaid || null,
    email || '',
    blurb || '',
    hall || null,
    wing || null,
    image || '',
    availability || '',
    physics || '',
    chem || '',
    biology || '',
    sciother || '',
    mathother || '',
    mathcore || '',
    cs || '',
    language || ''
  ], function(err) {
    if (err) {
      console.error("tutor insert error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'tutor created successfully' });
  });
});

// delete tutor endpoint
app.delete("/api/tutors/:id", (req: Request, res: Response) => {
  const tutorId = parseInt(req.params.id);

  // validate tutorId
  if (isNaN(tutorId) || tutorId <= 0) {
    return res.status(400).json({ error: "invalid tutor id" });
  }

  const sql = "DELETE FROM tutors WHERE id = ?";

  db.run(sql, tutorId, function (err) {
    if (err) {
      console.error("tutor delete error:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    // check if any rows were actually deleted
    if (this.changes === 0) {
      return res.status(404).json({ error: "tutor not found" });
    }

    res.json({ message: "tutor deleted successfully" });
  });
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

type Admin = {
  id: number;
  email: string;
  pwd: string;
  access: number;
};

app.post("/api/login", (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const query = `SELECT * FROM admins WHERE email = ?`;
  db.get<Admin>(query, [email], (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!row)
      return res.status(401).json({ error: "Invalid email or password" });

    bcrypt.compare(password, row.pwd, (err, result: Boolean) => {
      if (err) return res.status(500).json({ error: "Hash comparison error" });
      if (!result)
        return res.status(401).json({ error: "Invalid email or password" });

      res.json({ success: true, access: row.access, email: row.email });
    });
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
});

// bulletin board api routes
app.post("/api/bulletin", (req: Request, res: Response) => {
  const { title, content, event_date, author, contact_info, highpriority } =
    req.body;
  const creation_date = new Date().toISOString();

  const sql = `INSERT INTO bulletin (title, content, creation_date, event_date, author, contact_info, highpriority) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      title || "",
      content || "",
      creation_date,
      event_date || null,
      author || "Admin",
      contact_info || "",
      highpriority || 0,
    ],
    function (err) {
      if (err) {
        console.error("bulletin insert error:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "post created successfully" });
    }
  );
});

app.get("/api/bulletin", (req: Request, res: Response) => {
  const sql = "SELECT * FROM bulletin ORDER BY creation_date DESC";

  db.all(sql, [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("bulletin fetch error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.delete("/api/bulletin/:id", (req: Request, res: Response) => {
  const sql = "DELETE FROM bulletin WHERE id = ?";

  db.run(sql, req.params.id, function (err) {
    if (err) {
      console.error("bulletin delete error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "post deleted successfully" });
  });
});

// resources routes
app.post("/api/resources", (req: Request, res: Response) => {
  const { name, email, classes, url, type } = req.body;
  const time_created = new Date().toISOString();

  const sql = `INSERT INTO resources (name, email, classes, url, type, time_created) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      name || "",
      email || "",
      classes || "",
      url || "",
      type || "",
      time_created,
    ],
    function (err) {
      if (err) {
        console.error("resource insert error:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "resource created successfully" });
    }
  );
});

app.get("/api/resources", (req: Request, res: Response) => {
  const sql = "SELECT * FROM resources ORDER BY time_created DESC";

  db.all(sql, [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("resource fetch error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.delete("/api/resources/:id", (req: Request, res: Response) => {
  const sql = "DELETE FROM resources WHERE resource_id = ?";

  db.run(sql, req.params.id, function (err) {
    if (err) {
      console.error("resource delete error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "resource deleted successfully" });
  });
});
