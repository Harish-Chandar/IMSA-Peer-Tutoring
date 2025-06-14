import { Database, verbose } from 'sqlite3';

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Query to select all records from schedule table
const query = `SELECT * FROM schedule`;

db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
        console.error('Error querying database:', err.message);
    } else {
        console.log('Schedule Records:');
        console.log('----------------');
        rows.forEach((row) => {
            console.log(`ID: ${row.id}`);
            console.log(`Title: ${row.title}`);
            console.log(`Course: ${row.course}`);
            console.log(`Teachers: ${row.teachers}`);
            console.log(`Location: ${row.location}`);
            console.log(`Date: ${row.date}`);
            console.log(`Time: ${row.time}`);
            console.log('----------------');
        });
        console.log(`Total records: ${rows.length}`);
    }
    
    // Close the database connection
    db.close((err: Error | null) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}); 