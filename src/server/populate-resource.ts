import sqlite3 from "sqlite3";

export const sampleResources = [
    {
        teacher: "Mr. Pranav Gadde",
        email: "pgadde@imsa.edu",
        course: "Object Oriented Programming",
        department: "Computer Science",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Atharv Kanchi",
        email: "akanchi2@imsa.edu",
        course: "Advanced Programming",
        department: "Computer Science",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Krithik",
        email: "ksenthilkumar@imsa.edu",
        course: "SI Physics",
        department: "Science",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Ian Wang",
        email: "iwang@imsa.edu",
        course: "BC 1",
        department: "Math",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Harish Chandar",
        email: "hchandar@imsa.edu",
        course: "Foundations of Healthy Living",
        department: "Wellness",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Vishnu Vijay",
        email: "vvijay@imsa.edu",
        course: "Creative Writing",
        department: "English",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Aarav Shah",
        email: "ashah@imsa.edu",
        course: "BC 2",
        department: "Math",
        url: "https://khanacademy.org/"
    },
    {
        teacher: "Ms. Zuidema",
        email: "mzuidema@imsa.edu",
        course: "Spanish IV",
        department: "World Languages",
        url: "https://conjuguemos.com/"
    },
];

export const sampleLinks = [
    { resource_id: 1, label: "Integration Techniques", url: "https://khanacademy.org/integration" },
    { resource_id: 2, label: "Differential Equations", url: "https://khanacademy.org/diffeq" },
    { resource_id: 2, label: "Periodic Table", url: "https://chemguide.co.uk/periodictable" },
    { resource_id: 3, label: "Reaction Mechanisms", url: "https://chemguide.co.uk/mechanisms" }
];

export function populateResources(db: any, sampleResources: any[], sampleLinks: any[], callback: () => void) {
    db.run("DELETE FROM resource_links", (err: Error | null) => {
        if (err) {
            console.error("Error clearing resource_links table:", err.message);
            callback();
            return;
        }
        db.run("DELETE FROM resources", (err: Error | null) => {
            if (err) {
                console.error("Error clearing resources table:", err.message);
                callback();
                return;
            }
            const insertResource = `INSERT INTO resources (teacher, email, course, department, url, search_field) VALUES (?, ?, ?, ?, ?, ?)`;
            let completed = 0;
            if (sampleResources.length === 0) {
                callback();
                return;
            }
            sampleResources.forEach((resource, index) => {
                const searchField = `${resource.teacher.toLowerCase()} ${resource.course.toLowerCase()}`;
                db.run(
                    insertResource,
                    [
                        resource.teacher,
                        resource.email,
                        resource.course,
                        resource.department,
                        resource.url,
                        searchField,
                    ],
                    function (err: Error | null) {
                        if (err) {
                            console.error(
                                `Error inserting resource ${index + 1}:`,
                                err?.message
                            );
                        } else {
                            console.log(
                                `Successfully inserted resource: ${resource.teacher}`
                            );
                            const resourceId = this.lastID;
                            const insertLink = `INSERT INTO resource_links (resource_id, label, url) VALUES (?, ?, ?)`;
                            const linksForThisResource = sampleLinks.filter(
                                (link) => link.resource_id === index + 1
                            );
                            linksForThisResource.forEach((link) => {
                                db.run(
                                    insertLink,
                                    [resourceId, link.label, link.url],
                                    (err: Error | null) => {
                                        if (err) {
                                            console.error(
                                                `Error inserting link for resource ${resourceId}:`,
                                                err.message
                                            );
                                        } else {
                                            console.log(`Successfully inserted link: ${link.label}`);
                                        }
                                    }
                                );
                            });
                        }
                        completed++;
                        if (completed === sampleResources.length) {
                            db.all("SELECT * FROM resources", [], (err: Error | null, rows: any[]) => {
                                if (err) {
                                    console.error("Error verifying resources data:", err.message);
                                } else {
                                    console.log("Inserted resources:");
                                    console.table(rows);
                                }
                                db.all("SELECT * FROM resource_links", [], (err: Error | null, rows: any[]) => {
                                    if (err) {
                                        console.error(
                                            "Error verifying resource_links data:",
                                            err.message
                                        );
                                    } else {
                                        console.log("Inserted resource links:");
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
    });
}

// execution block for running this file independently
const isMainModule = process.argv[1] && process.argv[1].endsWith('populate-resource.ts');
if (isMainModule) {
    const db = new sqlite3.Database(
        "./peertutoringdb.sqlite",
        (err: Error | null) => {
            if (err) {
                console.error("Error opening database:", err.message);
                process.exit(1);
            } else {
                console.log("Connected to SQLite database.");
                
                // Create resource_links table if it doesn't exist
                const createResourceLinksTable = `
                    CREATE TABLE IF NOT EXISTS resource_links (
                        link_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        resource_id INTEGER NOT NULL,
                        label TEXT NOT NULL,
                        url TEXT NOT NULL,
                        FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
                    );
                `;
                
                db.run(createResourceLinksTable, (err) => {
                    if (err) {
                        console.error('Error creating "resource_links" table:', err.message);
                    } else {
                        console.log('Successfully created "resource_links" table.');
                    }
                    
                    populateResources(db, sampleResources, sampleLinks, () => {
                        db.close((err: Error | null) => {
                            if (err) {
                                console.error("Error closing database:", err.message);
                            } else {
                                console.log("Database population complete and connection closed.");
                            }
                        });
                    });
                });
            }
        }
    );
}