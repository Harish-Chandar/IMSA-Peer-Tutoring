// const express =  require("express"); // need express for form data
// const sqlite3 = require("sqlite3").verbose();
// const cors = require("cors"); // cross origin resource sharing

// const app = express();
// const db = new sqlite3.Database("../peertutoringdb.sqlite");

// app.use(express.json()); //this parses JSON data
// app.use(cors({
//     origin: "http://localhost:3000"
// })); // this allows frontend access by accessing different ports (backend 5000, frontend 3000)

// // handle form data, insert into database
// app.post("/add-resource", (req, res) => {
//     const { name, email, classes, url } = req.body; // this extracts form data from request body
//     const query = 'INSERT INTO resources (name, email, classes, url) VALUES (?, ?, ?, ?)';

//     // execute 
//     db.run(query, [name, email, classes, url], function(err) {
//         if (err) {
//             return res.status(500).json({error : err.message});

//         } 
//         res.json({
//             id: this.lastID, message: "Resource was added to the database."
//         });

//     });

// });

// app.listen(5000, () => console.log("Server running on port 5000"));
