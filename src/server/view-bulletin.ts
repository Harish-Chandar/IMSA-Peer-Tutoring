import pkg from 'sqlite3';
const { Database, verbose } = pkg;

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Query all bulletin entries
const query = 'SELECT * FROM bulletin ORDER BY creation_date DESC';

db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
        console.error('Error querying bulletin table:', err.message);
    } else {
        console.log('\nBulletin Board Entries:');
        console.log('----------------------');
        
        rows.forEach((row) => {
            console.log(`\nID: ${row.id}`);
            console.log(`Title: ${row.title}`);
            console.log(`Content: ${row.content}`);
            console.log(`Creation Date: ${row.creation_date}`);
            console.log(`Event Date: ${row.event_date || 'N/A'}`);
            console.log(`Expiration Date: ${row.expiration_date || 'N/A'}`);
            console.log(`Author: ${row.author}`);
            console.log(`Contact Info: ${row.contact_info || 'N/A'}`);
            console.log(`High Priority: ${row.highpriority ? 'Yes' : 'No'}`);
            console.log('----------------------');
        });
    }
    
    // Close the database connection
    db.close((err: Error | null) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
    });
}); 