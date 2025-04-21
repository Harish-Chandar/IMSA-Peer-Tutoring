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

// i think this allows the routes to use json but i'm not sure
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
    query += " AND (LOWER(fname) = LOWER(?) OR LOWER(lname) = LOWER(?))";
    params.push(name, name);
  }
  if (hall) {
    // the frontend sends back a comma list for multiple halls, so handle that
    if (hall.includes(",")) {
      // i didn't know how to do this part so warning this is gpted
      const hallList = hall
        .split(",")
        .map((h) => parseInt(h.trim()))
        .filter((h) => !isNaN(h));
      if (hallList.length === 0) {
        return res.status(400).json({ error: "Invalid hall parameter" });
      }
      query += " AND hall IN (" + hallList.map(() => "?").join(",") + ")";
      params.push(...hallList);

      // ok this is my code again this is for when there is only 1 hall, just parse int
    } else {
      const hallInt = parseInt(hall);
      if (isNaN(hallInt)) {
        return res.status(400).json({ error: "Invalid hall parameter" });
      }
      query += " AND hall = ?";
      params.push(hallInt);
    }
  }

  console.log("Executing Query:", query, "Params:", params);

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
  if (isNaN(tutorId) || tutorId <= 0) {
    return res.status(400).json({ error: "Invalid tutor ID" });
  }
  db.all(
    "SELECT fname, lname FROM tutors WHERE id = ?",
    [tutorId],
    (err: Error | null, rows: any[]) => {
      if (err) {
        console.error(err); // Log error for debugging purposes
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
      res.json(rows);
    }
  );
});

app.get("/api/test", (req: Request, res: Response) => {
  db.all("SELECT * FROM tutors", (err: Error | null, rows: any[]) => {
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

// api route for inserting new data into the resources table
app.post("/api/resources", (req: Request, res: Response) => {
  console.log("Request body:", req.body);

  // Extract the data from the request body:
  const { teacher, email, course, department, url, type } = req.body;
  // Validate the data:
  if (!teacher || !email || !department || !course || !url) {
    return res.status(400).json({
      error: "Teacher, email, department, course, and url are required fields.",
    });
  }
  // concatenate teacher and course for search_field --> for search bar functionality, it will search through search_field in each resource so that we can search by teacher + by course name
  const search_field = `${teacher.toLowerCase()} ${course.toLowerCase()}`;
  console.log("Constructed search_field:", search_field); // Debugging

  // Insert the data into the database:
  const query = `
    INSERT INTO resources (teacher, email, course, department, url, type, search_field)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("Executing Query:", query);
  console.log("Query Parameters:", [teacher, email, course, department, url, type || "", search_field]);
  db.run(
    query,
    [teacher, email, course, department, url, type || "", search_field], // Include search_field here
    function (err: Error | null) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to add resource" });
      }

      // Send a success response:
      res.status(201).json({
        resource_id: this.lastID,
        message: "Resource added successfully",
      });
    }
  );
});

// api route for retrieving all resources
app.get("/api/resources", (req: Request, res: Response) => {
  db.all("SELECT * FROM resources", (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error retrieving resources" });
    }
    res.json(rows);
  });
});

// api route for retrieving resources by department
app.get("/api/resources/search", (req: Request, res: Response) => {
  const { searchQuery, department } = req.query as { searchQuery?: string; department?: string };
  let query = "SELECT * FROM resources WHERE 1=1"; // 1=1 lets you append more conditions easily with AND operator.
  const params: (string | number)[] = [];

  if (searchQuery) { // search for searchQuery in search_field column 
    //trim so there is no whitespace
    const trimmedCourse = searchQuery.trim();
    query += " AND LOWER(search_field) LIKE LOWER(?)";
    params.push(`%${trimmedCourse}%`);

  }
  if (department) {
    // the frontend sends back a comma list for multiple departments, so handle that
    if (department.includes(",")) {
      const departmentList = department.split(",").map((d) => d.trim());

      if (departmentList.length === 0) {
        return res.status(400).json({ error: "Invalid department parameter" });
      }

      //appends to query and params for multiple departments
      query += " AND LOWER(department) IN (" + departmentList.map(() => "?").join(",") + ")";
      params.push(...departmentList.map((d) => d.toLowerCase()));

      // for when there is only 1 dept
    } else {
      query += " AND LOWER(department) = LOWER(?)";
      params.push(department.trim().toLowerCase());
    }
  }
  
  // debug log statement of query
  console.log("Executing Query:", query, "Params:", params);

  // execute the query
  db.all(query, params, (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Error retrieving resources" });
      return;
    }

    console.log("Query Results:", rows); // Log the query results

    if (rows.length === 0) {
      return res.status(404).json({ error: "No resources found" });
    }
    res.json(rows || []); // Always return an array
  });
});