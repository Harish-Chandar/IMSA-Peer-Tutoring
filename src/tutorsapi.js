"use strict";
exports.__esModule = true;
var express_1 = require("express");
var sqlite3_1 = require("sqlite3");
var cors_1 = require("cors");
var app = (0, express_1["default"])();
var PORT = 5000;
app.use((0, cors_1["default"])());
// set up server
app.listen(PORT, function () {
    console.log("server listening on port ".concat(PORT));
});
// i think this allows the routes to use json but i'm not sure
app.use(express_1["default"].json());
// initialize database
var db = new sqlite3_1["default"].Database("peertutoringdb.sqlite", function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log("connected to the database");
});
// api route for filtering through tutors by either name or hall
app.get("/api/tutors/search", function (req, res) {
    var _a = req.query, name = _a.name, hall = _a.hall;
    var query = "SELECT * FROM tutors WHERE 1=1";
    var params = [];
    if (name) {
        query += " AND (LOWER(fname) = LOWER(?) OR LOWER(lname) = LOWER(?))";
        params.push(name, name);
    }
    if (hall) {
        // the frontend sends back a comma list for multiple halls, so handle that
        if (hall.includes(",")) {
            // i didn't know how to do this part so warning this is gpted
            var hallList = hall
                .split(",")
                .map(function (h) { return parseInt(h.trim()); })
                .filter(function (h) { return !isNaN(h); });
            if (hallList.length === 0) {
                return res.status(400).json({ error: "Invalid hall parameter" });
            }
            query += " AND hall IN (" + hallList.map(function () { return "?"; }).join(",") + ")";
            params.push.apply(params, hallList);
            // ok this is my code again this is for when there is only 1 hall, just parse int
        }
        else {
            var hallInt = parseInt(hall);
            if (isNaN(hallInt)) {
                return res.status(400).json({ error: "Invalid hall parameter" });
            }
            query += " AND hall = ?";
            params.push(hallInt);
        }
    }
    console.log("Executing Query:", query, "Params:", params);
    db.all(query, params, function (err, rows) {
        if (err) {
            console.error("Database error:", err);
            res.status(500).json({ error: "Error retrieving tutors" });
            return;
        }
        res.json(rows);
    });
});
// api route for retrieving name given an id
app.get("/api/tutors/:id", function (req, res) {
    var tutorId = parseInt(req.params.id);
    if (isNaN(tutorId) || tutorId <= 0) {
        return res.status(400).json({ error: "Invalid tutor ID" });
    }
    db.all("SELECT fname, lname FROM tutors WHERE id = ?", [tutorId], function (err, rows) {
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
            lname: rows[0].lname
        });
    });
});
// api route for retrieving parseable string of classes for a given tutor based on ID
app.get("/api/tutors/:id/classes", function (req, res) {
    var tutorId = req.params.id;
    db.all("SELECT physics,chem,biology,sciother,mathother,mathcore,cs,language FROM tutors WHERE id=?", [tutorId], function (err, rows) {
        if (err) {
            return res.send("Error retrieving classes");
        }
        res.json(rows);
    });
});
app.get("/api/test", function (req, res) {
    db.all("SELECT * FROM tutors", function (err, rows) {
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
// api route for inserting new data into the database
app.post("/api/resources", function (req, res) {
    // Extract the data from the request body:
    var _a = req.body, teacher = _a.teacher, email = _a.email, classes = _a.classes, url = _a.url, type = _a.type;
    // Validate the data:
    if (!teacher || !email || !classes || !url) {
        return res.status(400).json({
            error: "Teacher. email, classes, and url are required fields."
        });
    }
    // Insert the data into the database:
    var query = "INSERT INTO resources (teacher, email, classes, url, type) VALUES (?, ?, ?, ?, ?)";
    db.run(query, [teacher, email, classes, url, type || ""], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to add resource" });
        }
        // Send a success response:
        res.status(201).json({
            resource_id: this.lastID,
            message: "Resource added successfully"
        });
    });
});