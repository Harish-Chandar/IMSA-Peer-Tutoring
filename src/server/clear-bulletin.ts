import pkg from 'sqlite3';
const { Database, verbose } = pkg;

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Clear the bulletin table
db.run('DELETE FROM bulletin', (err) => {
    if (err) {
        console.error('Error clearing bulletin table:', err.message);
    } else {
        console.log('Bulletin table cleared successfully!');
    }
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
    });
}); 