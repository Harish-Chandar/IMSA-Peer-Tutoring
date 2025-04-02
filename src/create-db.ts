const sqlite3 = require('sqlite3').verbose();

export const db = new sqlite3.Database('./peertutoringdb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
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
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        classes TEXT NOT NULL,
        url TEXT,
        type TEXT,
        time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`;

db.run(createResourcesTable, (err) => {
    if (err) {
        console.error('Error creating "resources" table:', err.message);
    } else {
        console.log('Successfully created "resources" table.');
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database setup complete.');
    }
});

