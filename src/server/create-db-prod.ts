import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { populateAdmins } from "./populate-admin";

// Import the main function from setup.ts
import("./setup").then(async (setupModule) => {
	console.log("Starting production database setup...\n");

	const dbPath = path.resolve("./peertutoringdb.sqlite");
	const csvPath = process.argv[2];

	// Check if CSV file path is provided
	if (!csvPath) {
		console.error("Error: Please provide the path to the tutors CSV file");
		console.error("Usage: tsx create-db-prod.ts <path-to-tutors.csv>");
		process.exit(1);
	}

	// Check if CSV file exists
	const resolvedCsvPath = path.resolve(csvPath);
	if (!fs.existsSync(resolvedCsvPath)) {
		console.error(`Error: CSV file not found: ${resolvedCsvPath}`);
		process.exit(1);
	}

	try {
		// Step 1: Check if database exists, create if not
		console.log("Step 1: Checking database...");
		if (!fs.existsSync(dbPath)) {
			console.log("Database not found. Creating new database...");
			await runCreateDb();
		} else {
			console.log("Database already exists, skipping creation.");
		}

		// Step 2: Populate admin accounts
		console.log("\nStep 2: Setting up admin accounts...");
		await runPopulateAdmins();

		// Step 3: Import tutor data
		console.log("\nStep 3: Importing tutor data...");
		await runSetup(resolvedCsvPath);

		console.log("\nProduction database setup completed successfully!");
	} catch (error) {
		console.error("Production setup failed:", error);
		process.exit(1);
	}
});

// Function to run create-db.ts logic
function runCreateDb(): Promise<void> {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./peertutoringdb.sqlite", (err) => {
			if (err) {
				console.error("Error creating database:", err.message);
				reject(err);
				return;
			}
			console.log("Connected to SQLite database.");
		});

		const tables = [
			{
				name: "tutors",
				sql: `
				CREATE TABLE IF NOT EXISTS tutors (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					fname TEXT NOT NULL,
					lname TEXT NOT NULL,
					fbname TEXT,
					imsaid INTEGER,
					email TEXT UNIQUE NOT NULL,
					blurb TEXT,
					hall INTEGER,
					wing INTEGER,
					image TEXT,
					totaltime INTEGER DEFAULT 0,
					approvedtime INTEGER DEFAULT 0,
					starttime INTEGER,
					is_available BOOLEAN DEFAULT 0,
					availability TEXT,
					courses TEXT,
					physics TEXT,
					chem TEXT,
					biology TEXT,
					sciother TEXT,
					mathother TEXT,
					mathcore TEXT,
					cs TEXT,
					language TEXT
				);`,
			},
			{
				name: "bulletin",
				sql: `
				CREATE TABLE IF NOT EXISTS bulletin (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					title TEXT NOT NULL,
					content TEXT NOT NULL,
					creation_date TEXT NOT NULL,
					event_date TEXT,
					expiration_date TEXT,
					author TEXT NOT NULL,
					contact_info TEXT,
					highpriority BOOLEAN DEFAULT 0,
					image TEXT
				);`,
			},
			{
				name: "resources",
				sql: `
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
				);`,
			},
			{
				name: "admins",
				sql: `
				CREATE TABLE IF NOT EXISTS admins (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					email TEXT NOT NULL,
					pwd TEXT NOT NULL,
					access INTEGER NOT NULL
				);`,
			},
			{
				name: "schedule",
				sql: `
				CREATE TABLE IF NOT EXISTS schedule (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					title TEXT NOT NULL,
					course TEXT NOT NULL,
					teachers TEXT NOT NULL,
					location TEXT NOT NULL,
					date TEXT NOT NULL,
					time TEXT NOT NULL
				);`,
			},
			{
				name: "classes",
				sql: `
				CREATE TABLE IF NOT EXISTS classes (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					class_name TEXT NOT NULL,
					department TEXT NOT NULL
				);`,
			},
			{
				name: "resource_links",
				sql: `
				CREATE TABLE IF NOT EXISTS resource_links (
					link_id INTEGER PRIMARY KEY AUTOINCREMENT,
					resource_id INTEGER NOT NULL,
					label TEXT NOT NULL,
					url TEXT NOT NULL,
					FOREIGN KEY (resource_id) REFERENCES resources (resource_id) ON DELETE CASCADE
				);`,
			},
		];

		let completed = 0;
		let hasError = false;

		tables.forEach((table) => {
			db.run(table.sql, (err) => {
				if (err && !hasError) {
					console.error(
						`Error creating "${table.name}" table:`,
						err.message
					);
					hasError = true;
					reject(err);
					return;
				} else if (!hasError) {
					console.log(`Successfully created "${table.name}" table.`);
				}

				completed++;
				if (completed === tables.length && !hasError) {
					db.close((closeErr) => {
						if (closeErr) {
							console.error(
								"Error closing database:",
								closeErr.message
							);
							reject(closeErr);
						} else {
							console.log(
								"Database tables created successfully."
							);
							resolve();
						}
					});
				}
			});
		});
	});
}

// Function to run populate-admin.ts logic
function runPopulateAdmins(): Promise<void> {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./peertutoringdb.sqlite", (err) => {
			if (err) {
				console.error("Error opening database:", err.message);
				reject(err);
				return;
			}
			console.log("Connected to database for admin setup.");
		});

		populateAdmins(db, () => {
			db.close((closeErr) => {
				if (closeErr) {
					console.error("Error closing database:", closeErr.message);
					reject(closeErr);
				} else {
					console.log("Admin accounts populated successfully.");
					resolve();
				}
			});
		});
	});
}

// Function to run setup.ts logic
function runSetup(csvPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		// Temporarily override process.argv to pass the CSV path to setup.ts
		const originalArgv = process.argv;
		process.argv = [process.argv[0], "setup.ts", csvPath];

		// Import and run the setup module
		import("./setup")
			.then(async (setupModule) => {
				try {
					// The setup module will run automatically when imported since it has the execution block
					// We need to wait for it to complete
					setTimeout(() => {
						// Restore original argv
						process.argv = originalArgv;
						console.log("Tutor data imported successfully.");
						resolve();
					}, 1000); // Give it time to complete
				} catch (error) {
					process.argv = originalArgv;
					reject(error);
				}
			})
			.catch((error) => {
				process.argv = originalArgv;
				reject(error);
			});
	});
}
