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
  const { teacher, email, course, department, url, type, links } = req.body;

  console.log("Request body:", req.body); // Log the entire request body
  console.log("Links received:", links); // Log just the links

  // Create search field for easier searching
  const search_field = `${teacher.toLowerCase()} ${course.toLowerCase()}`;

  // First insert the main resource
  db.run(
    "INSERT INTO resources (teacher, email, course, department, url, type, search_field) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [teacher, email, course, department, url, type, search_field],
    function (this: any, err: Error | null) {
      if (err) {
        console.error("Error inserting resource:", err);
        return res.status(500).json({ error: "Error adding resource" });
      }

      // Get the ID of the newly inserted resource
      const resourceId = this.lastID;
      console.log(`Created resource with ID: ${resourceId}`);

      // Now handle the links array if it exists
      if (links && Array.isArray(links) && links.length > 0) {
        console.log(
          `Processing ${links.length} links for resource ${resourceId}`
        );

        // Use direct inserts instead of prepared statements
        let insertedLinks = 0;
        let errorCount = 0;

        links.forEach((link: { label: string; url: string }, index: number) => {
          console.log(`Inserting link ${index + 1}:`, link);

          db.run(
            "INSERT INTO resource_links (resource_id, label, url) VALUES (?, ?, ?)",
            [resourceId, link.label, link.url],
            function (err: Error | null) {
              if (err) {
                console.error(`Error inserting link ${index + 1}:`, err);
                errorCount++;
              } else {
                console.log(
                  `Link ${index + 1} inserted with ID: ${this.lastID}`
                );
                insertedLinks++;
              }

              // If this is the last link (whether success or error), send the response
              if (insertedLinks + errorCount === links.length) {
                res.status(201).json({
                  id: resourceId,
                  message: `Resource created successfully. ${insertedLinks} links inserted. ${errorCount} links failed.`,
                });
              }
            }
          );
        });
      } else {
        // No links to insert, send response immediately
        res.status(201).json({
          id: resourceId,
          message: "Resource created successfully with no links.",
        });
      }
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
  const { searchQuery, department } = req.query as {
    searchQuery?: string;
    department?: string;
  };
  let query = "SELECT * FROM resources WHERE 1=1"; // 1=1 lets you append more conditions easily with AND operator.
  const params: (string | number)[] = [];

  if (searchQuery) {
    // search for searchQuery in search_field column
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
      query +=
        " AND LOWER(department) IN (" +
        departmentList.map(() => "?").join(",") +
        ")";
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

// route to get details of a resource by ID
app.get("/api/resources/:id", (req: Request, res: Response) => {
  const resourceId = parseInt(req.params.id);

  // First, get the resource
  db.get(
    "SELECT * FROM resources WHERE resource_id = ?",
    [resourceId],
    (err, resource) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Then, get all links for this resource
      db.all(
        "SELECT link_id, label, url FROM resource_links WHERE resource_id = ?",
        [resourceId],
        (err, links) => {
          if (err) {
            // Even if there's an error getting links, return the resource
            return res.json({
              ...resource,
              links: [],
            });
          }

          // Return the resource with links
          return res.json({
            ...resource,
            links: links || [],
          });
        }
      );
    }
  );
});
