// Use dynamic import for sqlite3 for ES module compatibility
(async () => {
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default.verbose();

    const db = new sqlite3.Database('../peertutoringdb.sqlite', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to SQLite database.');
        }
    });

    // Helper function to print rows from a table
    function printRows(tableName: string, rows: any[]) {
        console.log(`\n${tableName} Records:`);
        console.log('----------------');
        if (rows.length === 0) {
            console.log('No records found.');
        } else {
            rows.forEach((row) => {
                Object.entries(row).forEach(([key, value]) => {
                    console.log(`${key}: ${value}`);
                });
                console.log('----------------');
            });
        }
        console.log(`Total records: ${rows.length}`);
    }

    // Query and print schedule table
    const scheduleQuery = `SELECT * FROM schedule`;
    db.all(scheduleQuery, [], (err: Error | null, rows: any[]) => {
        if (err) {
            console.error('Error querying schedule table:', err.message);
        } else {
            printRows('Schedule', rows);
        }

        // Query and print resources table
        const resourcesQuery = `SELECT * FROM resources`;
        db.all(resourcesQuery, [], (err: Error | null, rows: any[]) => {
            if (err) {
                console.error('Error querying resources table:', err.message);
            } else {
                printRows('Resources', rows);
            }

            // Query and print resource_links table
            const linksQuery = `SELECT * FROM resource_links`;
            db.all(linksQuery, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    console.error('Error querying resource_links table:', err.message);
                } else {
                    printRows('Resource Links', rows);
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
        });
    });
})(); 