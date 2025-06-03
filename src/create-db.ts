const sqlite3 = require("sqlite3").verbose();

export const db = new sqlite3.Database(
  "./peertutoringdb.sqlite",
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

const createTutorsTable = `
    CREATE TABLE IF NOT EXISTS tutors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        fbname TEXT,
        imsaid INTEGER,
        email TEXT UNIQUE NOT NULL,
        blurb TEXT,
        hall INTEGER,
        wing INTEGER,
        totaltime INTEGER DEFAULT 0,
        approvedtime INTEGER DEFAULT 0,
        starttime INTEGER,
        is_available BOOLEAN DEFAULT 1,
        availability TEXT,
        courses TEXT,
        physics TEXT,
        chem TEXT,
        biology TEXT,
        sciother TEXT,
        mathother TEXT,
        mathcore TEXT,
        cs TEXT,
        language TEXT
    );
`;

db.run(createTutorsTable, (err: Error | null) => {
  if (err) {
    console.error('Error creating "tutors" table:', err.message);
  } else {
    console.log('Successfully created "tutors" table.');
  }
});

const createBulletinTable = `
    CREATE TABLE IF NOT EXISTS bulletin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        creation_date TEXT NOT NULL,
        event_date TEXT,
        expiration_date TEXT,
        author TEXT NOT NULL,
        contact_info TEXT,
        highpriority BOOLEAN DEFAULT 0
    );
`;

db.run(createBulletinTable, (err: Error | null) => {
  if (err) {
    console.error('Error creating "bulletin" table:', err.message);
  } else {
    console.log('Successfully created "bulletin" table.');
  }
});

const createResourcesTable = `
    CREATE TABLE IF NOT EXISTS resources (
        resource_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        teacher TEXT NOT NULL,
        email TEXT NOT NULL,
        course TEXT NOT NULL,
        department TEXT NOT NULL,
        url TEXT,
        type TEXT,
        time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        search_field TEXT

    );
`;

db.run(createResourcesTable, (err: Error | null) => {
  if (err) {
    console.error('Error creating "resources" table:', err.message);
  } else {
    console.log('Successfully created "resources" table.');
  }
});
// "FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE" -- this line establishes the link between resource_id in the resources table and the resource_id column in the resource_links table. You cannot add an resource with a resource_id that does not exist in resources. ON DELETE CASCADE means that when you delete a resoruce from teh resources table, all associated links with the same resource_id will be deleted as well.
const createResourceLinksTable = `
    CREATE TABLE IF NOT EXISTS resource_links (
        link_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        resource_id INTEGER NOT NULL,
        label VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE
    );
`;

db.run(createResourceLinksTable, (err: Error | null) => {
  if (err) {
    console.error('Error creating "resource_links" table:', err.message);
  } else {
    console.log('Successfully created "resource_links" table.');
  }
});

db.close((err: Error | null) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database setup complete.");
  }
});
