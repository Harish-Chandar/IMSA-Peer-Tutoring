import sqlite3 from "sqlite3";
import { tutors, populateTutors } from "./populate-tutors";
import { classCategories, populateClasses } from "./populate-classes";
import { sampleData, populateBulletin, ensureBulletinImageColumn } from "./populate-bulletin";
import { sampleResources, sampleLinks, populateResources } from "./populate-resource";
import { sampleAdmins, populateAdmins } from "./populate-admin";

type SQLiteError = Error | null;

const db = new sqlite3.Database(
    "./peertutoringdb.sqlite",
    (err: Error | null) => {
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

populateAdmins(db, () => {
    populateClasses(db, classCategories, () => {
        populateTutors(db, tutors, () => {
            ensureBulletinImageColumn(db, () => {
                populateBulletin(db, () => {
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
            });
        });
    });
});
