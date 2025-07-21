import sqlite3 from "sqlite3";
import { tutors } from "./populate-tutors";
import { classCategories } from "./populate-classes";
import { sampleData } from "./populate-bulletin";
import { sampleResources, sampleLinks } from "./populate-resource";

type SQLiteError = Error | null;

function populateTutorsAndClasses(db: sqlite3.Database, callback: () => void) {
    function insertClasses(cb: () => void) {
        console.log("Starting insertion of class data...");
        db.run("DELETE FROM classes", [], (err: SQLiteError) => {
            if (err) {
                console.error("Error deleting existing classes:", err?.message);
                cb();
                return;
            }
            console.log("Cleared existing class data.");
            const insertClassStmt = db.prepare(
                "INSERT INTO classes (class_name, department) VALUES (?, ?)"
            );
            let insertedCount = 0;
            let totalClasses = 0;
            for (const classes of Object.values(classCategories)) {
                totalClasses += classes.length;
            }
            if (totalClasses === 0) {
                insertClassStmt.finalize();
                cb();
                return;
            }
            for (const [department, classes] of Object.entries(classCategories)) {
                for (const className of classes) {
                    insertClassStmt.run(
                        className,
                        department,
                        function (err: SQLiteError) {
                            if (err) {
                                console.error(
                                    `Error inserting class "${className}":`,
                                    err?.message
                                );
                            } else {
                                insertedCount++;
                                console.log(
                                    `Successfully inserted class: ${className} (Department: ${department})`
                                );
                            }
                            if (insertedCount === totalClasses) {
                                insertClassStmt.finalize();
                                console.log(`Total of ${insertedCount} classes inserted.`);
                                cb();
                            }
                        }
                    );
                }
            }
        });
    }

    function insertTutors(cb: () => void) {
        console.log("Starting insertion of tutor data...");
        db.run("DELETE FROM tutors", [], (err: SQLiteError) => {
            if (err) {
                console.error("Error deleting existing tutors:", err?.message);
                cb();
                return;
            }
            console.log("Cleared existing tutor data.");
            const insertStmt = db.prepare(`
        INSERT INTO tutors (
            id, fname, lname, fbname, imsaid, email, blurb, hall, wing, image, 
            totaltime, approvedtime, starttime, is_available, availability, courses,
            physics, chem, biology, sciother, mathother, mathcore, cs, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);
            tutors.forEach((tutor) => {
                insertStmt.run(
                    tutor.id,
                    tutor.fname,
                    tutor.lname,
                    tutor.fbname,
                    tutor.imsaid,
                    tutor.email,
                    tutor.blurb,
                    tutor.hall,
                    tutor.wing,
                    tutor.image,
                    tutor.totaltime,
                    tutor.approvedtime,
                    tutor.starttime,
                    tutor.is_available,
                    tutor.availability,
                    tutor.courses,
                    tutor.physics,
                    tutor.chem,
                    tutor.biology,
                    tutor.sciother,
                    tutor.mathother,
                    tutor.mathcore,
                    tutor.cs,
                    tutor.language,
                    function (err: SQLiteError) {
                        if (err) {
                            console.error(`Error inserting tutor ${tutor.id}:`, err?.message);
                        } else {
                            console.log(
                                `Successfully inserted tutor: ${tutor.fname} ${tutor.lname} (ID: ${tutor.id})`
                            );
                        }
                    }
                );
            });
            insertStmt.finalize();
            db.all(
                "SELECT id, fname, lname, hall, wing, image, availability FROM tutors",
                [],
                (err: SQLiteError, rows: any[]) => {
                    if (err) {
                        console.error("Error verifying inserted data:", err?.message);
                    } else {
                        console.log("Inserted tutors:");
                        console.table(rows);
                        console.log(`Total of ${rows.length} tutors inserted.`);
                    }
                    cb();
                }
            );
        });
    }

    insertClasses(() => insertTutors(callback));
}

function populateBulletin(db: sqlite3.Database, callback: () => void) {
    db.run("DELETE FROM bulletin", (err) => {
        if (err) {
            console.error("Error clearing table:", err.message);
            callback();
            return;
        }
        const stmt = db.prepare(`
      INSERT INTO bulletin (
        title, content, creation_date, event_date, expiration_date, author, contact_info, highpriority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
                (err: Error | null) => {
                    if (err) {
                        console.error("Error inserting data:", err.message);
                    }
                    completed++;
                    if (completed === sampleData.length) {
                        stmt.finalize(() => {
                            db.all("SELECT * FROM bulletin", [], (err, rows) => {
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

function populateResources(db: sqlite3.Database, callback: () => void) {
    db.run("DELETE FROM resource_links", (err) => {
        if (err) {
            console.error("Error clearing resource_links table:", err.message);
            callback();
            return;
        }
        db.run("DELETE FROM resources", (err) => {
            if (err) {
                console.error("Error clearing resources table:", err.message);
                callback();
                return;
            }
            const insertResource = `INSERT INTO resources (teacher, email, course, department, url, type, search_field) VALUES (?, ?, ?, ?, ?, ?, ?)`;
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
                        resource.type,
                        searchField,
                    ],
                    function (err) {
                        if (err) {
                            console.error(
                                `Error inserting resource ${index + 1}:`,
                                err?.message
                            );
                        } else {
                            console.log(
                                `Successfully inserted resource: ${resource.teacher} - ${resource.type}`
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
                                    (err) => {
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
                            db.all("SELECT * FROM resources", [], (err, rows) => {
                                if (err) {
                                    console.error("Error verifying resources data:", err.message);
                                } else {
                                    console.log("Inserted resources:");
                                    console.table(rows);
                                }
                                db.all("SELECT * FROM resource_links", [], (err, rows) => {
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

const db = new sqlite3.Database(
    "./peertutoringdb.sqlite",
    (err: SQLiteError) => {
        if (err) {
            console.error("Error opening database:", err.message);
            process.exit(1);
        } else {
            console.log("Connected to SQLite database.");
        }
    }
);

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
});

populateTutorsAndClasses(db, () => {
    populateBulletin(db, () => {
        populateResources(db, () => {
            db.close((err: SQLiteError) => {
                if (err) {
                    console.error("Error closing database:", err.message);
                } else {
                    console.log("Database population complete and connection closed.");
                }
            });
        });
    });
});
