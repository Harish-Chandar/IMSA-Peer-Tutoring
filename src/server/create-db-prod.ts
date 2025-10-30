import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { populateAdmins } from "./populate-admin";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function main() {
	console.log("PRODUCTION DATABASE SETUP");

	const dbPath = path.resolve("./peertutoringdb.sqlite");
	const csvPath = process.argv[2];

	if (!csvPath) {
		console.error("Error: Please provide the path to the tutors CSV file");
		console.error("Usage: tsx create-db-prod.ts <path-to-tutors.csv>");
		process.exit(1);
	}

	const resolvedCsvPath = path.resolve(csvPath);
	if (!fs.existsSync(resolvedCsvPath)) {
		console.error(`Error: CSV file not found: ${resolvedCsvPath}`);
		process.exit(1);
	}

	try {
		console.log("Checking database...");
		if (!fs.existsSync(dbPath)) {
			console.log("Database not found. Creating new database...");
			await runCreateDb();
		} else {
			console.log("Database already exists, skipping creation.");
		}

		console.log("Setting up admin accounts...");
		await runPopulateAdmins();
		console.log("Admin accounts setup complete.");

		console.log("Importing tutor data from CSV...");
		console.log(`CSV file: ${resolvedCsvPath}`);
		await runSetup(resolvedCsvPath);

		console.log("PRODUCTION DATABASE SETUP COMPLETE!");
	} catch (error) {
		console.error("Production setup failed:", error);
		process.exit(1);
	}
}

// Run the main function
main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
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

// Function to run setup.ts logic - properly execute setup.ts as a subprocess
async function runSetup(csvPath: string): Promise<void> {
	return new Promise(async (resolve, reject) => {
		try {
			const { spawn } = await import("child_process");

			console.log("Spawning setup.ts process...");

			const isWindows = process.platform === "win32";
			const command = isWindows ? "npx.cmd" : "npx";

			const setupProcess = spawn(command, ["tsx", "setup.ts", csvPath], {
				cwd: __dirname,
				stdio: "inherit",
				shell: true,
			});

			setupProcess.on("close", (code) => {
				if (code === 0) {
					console.log("Tutor data import completed successfully.");
					resolve();
				} else {
					reject(new Error(`Setup process exited with code ${code}`));
				}
			});

			setupProcess.on("error", (error) => {
				console.error("Error spawning setup process:", error);
				reject(error);
			});
		} catch (error) {
			console.error("Error in runSetup:", error);
			reject(error);
		}
	});
}
