const sqlite3 = require("sqlite3").verbose();

const populateDb = new sqlite3.Database(
  "./peertutoringdb.sqlite",
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

const CRT = `CREATE TABLE IF NOT EXISTS resources (
        resource_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        classes VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        type VARCHAR(255), 
        time_created DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;

populateDb.run(CRT, (err: Error | null) => {
  if (err) {
    console.error("Error creating schedule table:", err.message);
  } else {
    console.log("Successfully created schedule table.");
  }
  // Close the database connection after creating the table
  populateDb.close((err: Error | null) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
//cursor.executemany("INSERT INTO schedule (title, course, teachers, location, date, time) VALUES (`df`, `mi`, `d`, `d`, 1, 2)", data)
