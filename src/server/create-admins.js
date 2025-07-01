import bcrypt from 'bcrypt';
import sqlite3 from "sqlite3"; 


const db = new sqlite3.Database('./peertutoringdb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

const saltRounds = 10;

const email = "admin2@imsa.edu";
const plainPassword = "testpass2"// example

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) return console.error(err);
  const query = `INSERT INTO admins (email, pwd, access) VALUES (?, ?, ?)`;
  db.run(query, [email, hash, 1], function (err) {
    if (err) return console.error(err);
    console.log("Admin created with ID", this.lastID);
  });
});

