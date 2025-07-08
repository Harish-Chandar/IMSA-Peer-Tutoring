import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./peertutoringdb.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

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
        image TEXT,
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

db.run(createTutorsTable, (err) => {
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

db.run(createBulletinTable, (err) => {
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

const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    pwd TEXT NOT NULL,
    access INTEGER NOT NULL
    );
`;

db.run(createAdminTable, (err) => {
  if (err) {
    console.error('Error creating "admins" table:', err.message);
  } else {
    console.log('Successfully created "admins" table.');
  }
});

const createScheduleTable = `
    CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        course TEXT NOT NULL,
        teachers TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL
    );
`;

db.run(createScheduleTable, (err) => {
  if (err) {
    console.error('Error creating "schedule" table:', err.message);
  } else {
    console.log('Successfully created "schedule" table.');
  }
});

const createClassesTable = `
    CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_name TEXT NOT NULL,
        department TEXT NOT NULL
    );
`;

db.run(createClassesTable, (err) => {
  if (err) {
    console.error('Error creating "classes" table:', err.message);
  } else {
    console.log('Successfully created "classes" table.');
  }
});

db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database setup complete.");
  }
});
