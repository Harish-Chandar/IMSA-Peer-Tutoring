import pkg from 'sqlite3';
const { Database, verbose } = pkg;

const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

export const sampleData = [
    {
        title: "Study Session #1",
        content: "MI III",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-25 18:00",
        expiration_date: "2025-04-30",
        author: "Dr. Trimm",
        contact_info: "trimm@imsa.edu",
        highpriority: 1
    },
    {
        title: "Study Session #2",
        content: "BC 1/2",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-26 19:00",
        expiration_date: "2025-04-30",
        author: "Dr. Krouse",
        contact_info: "krouse@imsa.edu",
        highpriority: 2
    },
    {
        title: "Study Session #3",
        content: "MI IV",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-27 17:00",
        expiration_date: "2025-04-30",
        author: "Dr. Fogel",
        contact_info: "fogel@imsa.edu",
        highpriority: 3
    }
];