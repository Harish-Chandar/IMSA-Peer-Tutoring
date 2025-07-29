import pkg from 'sqlite3';
const { Database, verbose } = pkg;

export function ensureBulletinImageColumn(db: any, callback: () => void) {
    db.all("PRAGMA table_info(bulletin)", [], (err: Error | null, columns: any[]) => {
        if (err) {
            console.error("Error checking bulletin table columns:", err.message);
            callback();
            return;
        }
        const hasImage = columns.some(col => col.name === 'image');
        if (hasImage) {
            callback();
        } else {
            db.run("ALTER TABLE bulletin ADD COLUMN image TEXT", (err: Error | null) => {
                if (err) {
                    console.error("Error adding image column to bulletin table:", err.message);
                } else {
                    console.log("Added 'image' column to bulletin table.");
                }
                callback();
            });
        }
    });
}

export const sampleData = [
    {
        title: "Study Session #1",
        content: "MI III",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-25",
        expiration_date: "2025-04-30",
        author: "Dr. Trimm",
        contact_info: "trimm@imsa.edu",
        highpriority: 1,
        image: "/Bulletin Images/imsa.jpg"
    },
    {
        title: "Study Session #2",
        content: "BC 1/2",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-26 19:00",
        expiration_date: "2025-04-30",
        author: "Dr. Krouse",
        contact_info: "krouse@imsa.edu",
        highpriority: 0,
        image: "/Bulletin Images/blackboard.jpg"
    },
    {
        title: "Study Session #3",
        content: "MI IV",
        creation_date: new Date().toISOString(),
        event_date: "2025-04-27",
        expiration_date: "2025-04-30",
        author: "Dr. Fogel",
        contact_info: "fogel@imsa.edu",
        highpriority: 1,
        image: "/Bulletin Images/in2.jpg"
    }
];

export function populateBulletin(db: any, callback: () => void) {
    db.run("DELETE FROM bulletin", (err: Error | null) => {
        if (err) {
            console.error("Error clearing table:", err.message);
            callback();
            return;
        }
        const stmt = db.prepare(`
      INSERT INTO bulletin (
        title, content, creation_date, event_date, expiration_date, author, contact_info, highpriority, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        let completed = 0;
        sampleData.forEach((data) => {
            stmt.run(
                data.title,
                data.content,
                data.creation_date,
                data.event_date,
                data.expiration_date,
                data.author,
                data.contact_info,
                data.highpriority,
                data.image,
                (err: Error | null) => {
                    if (err) {
                        console.error("Error inserting data:", err.message);
                    }
                    completed++;
                    if (completed === sampleData.length) {
                        stmt.finalize(() => {
                            db.all("SELECT * FROM bulletin", [], (err: Error | null, rows: any[]) => {
                                if (err) {
                                    console.error("Error verifying bulletin data:", err.message);
                                } else {
                                    console.log("Inserted bulletin posts:");
                                    console.table(rows);
                                }
                                callback();
                            });
                        });
                    }
                }
            );
        });
    });
}