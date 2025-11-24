import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./peertutoringdb.sqlite", (err) => {
	if (err) {
		console.error("Error opening database:", err.message);
	} else {
		console.log("Connected to SQLite database.");
	}
});

const dropResourceLinksTable = `DROP TABLE IF EXISTS resource_links;`;

db.run(dropResourceLinksTable, (err) => {
	if (err) {
		console.error('Error dropping resource_links table:', err.message);
	} else {
		console.log('Successfully dropped resource_links table.');
	}
});

const dropResourcesTable = `DROP TABLE IF EXISTS resources;`;

db.run(dropResourcesTable, (err) => {
	if (err) {
		console.error('Error dropping resources table:', err.message);
	} else {
		console.log('Successfully dropped resources table.');
	}
});

const createResourcesTable = `
CREATE TABLE IF NOT EXISTS resources (
	resource_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	teacher TEXT NOT NULL,
	email TEXT NOT NULL,
	course TEXT NOT NULL,
	department TEXT NOT NULL,
	url TEXT,
	type TEXT,
	time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	search_field TEXT
);
`;

db.run(createResourcesTable, (err) => {
	if (err) {
		console.error('Error creating resources table:', err.message);
	} else {
		console.log('Successfully created resources table.');
	}
});

const createResourceLinksTable = `
CREATE TABLE IF NOT EXISTS resource_links (
	link_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	resource_id INTEGER NOT NULL,
	label TEXT NOT NULL,
	url TEXT NOT NULL,
	FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE
);
`;

db.run(createResourceLinksTable, (err) => {
	if (err) {
		console.error('Error creating resource_links table:', err.message);
	} else {
		console.log('Successfully created resource_links table.');
	}
});

db.close((err) => {
	if (err) {
		console.error("Error closing database:", err.message);
	}
});
