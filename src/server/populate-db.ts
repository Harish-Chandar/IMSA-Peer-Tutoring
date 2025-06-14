import pkg from 'sqlite3';
const { Database, verbose } = pkg;

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

const createScheduleTable = `
    CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        course TEXT,
        teachers TEXT,
        location TEXT,
        date TEXT,
        time TEXT
    );
`; 

db.run(createScheduleTable, (err: Error | null) => {
    if (err) {
        console.error('Error creating schedule table:', err.message);
    } else {
        console.log('Successfully created schedule table.');
    }
    db.close((err: Error | null) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
//cursor.executemany("INSERT INTO schedule (title, course, teachers, location, date, time) VALUES (`df`, `mi`, `d`, `d`, 1, 2)", data)