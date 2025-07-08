import pkg from 'sqlite3';
const { Database, verbose } = pkg;

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

const sampleData = [
    {
        title: "Study Session #1",
        course: "MI III",
        event_date: "2025-04-25",
        time: "6:00 PM",
        expiration_date: "2025-04-30",
        teachers: "Dr. Trimm",
        highpriority: 1
    },
    {
        title: "Study Session #2",
        course: "BC 1/2",
        event_date: "2025-04-26",
        time: "7:00 PM",
        expiration_date: "2025-04-30",
        teachers: "Dr. Krouse",
        highpriority: 2
    },
    {
        title: "Study Session #3",
        course: "MI IV",
        event_date: "2025-04-27",
        time: "5:00 PM",
        expiration_date: "2025-04-30",
        teachers: "Dr. Fogel",
        highpriority: 3
    }
];

db.run('DELETE FROM bulletin', (err) => {
    if (err) {
        console.error('Error clearing table:', err.message);
        db.close();
        return;
    }

    const stmt = db.prepare(`
        INSERT INTO bulletin (
            title, course, event_date, time,
            expiration_date, teachers, highpriority
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let completed = 0;
    sampleData.forEach(data => {
        stmt.run(
            data.title,
            data.course,
            data.event_date,
            data.time,
            data.expiration_date,
            data.teachers,
            data.highpriority,
            (err: Error | null) => {
                if (err) {
                    console.error('Error inserting data:', err.message);
                }
                completed++;
                if (completed === sampleData.length) {
                    stmt.finalize(() => {
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err.message);
                            }
                            console.log('Sample data inserted successfully!');
                        });
                    });
                }
            }
        );
    });
}); 