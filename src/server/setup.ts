import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Usage: tsx setup.ts path/to/tutors.csv

function detectDelimiter(headerLine: string): "," | "\t" {
	return headerLine.includes("\t") ? "\t" : ",";
}

function normalizeHeader(h: string): string {
	return h
		.replace(/^\uFEFF/, "")
		.toLowerCase()
		.replace(/\([^)]*\)/g, "")
		.replace(/[:]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function splitLine(line: string, delim: string): string[] {
	const out: string[] = [];
	let cur = "";
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				cur += '"';
				i++; // skip escaped quote
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === delim && !inQuotes) {
			out.push(cur);
			cur = "";
		} else {
			cur += ch;
		}
	}
	out.push(cur);
	return out.map((v) => v.trim());
}

function parseDelimited(content: string): {
	headers: string[];
	rows: string[][];
} {
	const lines = content
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n")
		.split("\n")
		.filter((l) => l.length > 0);
	if (lines.length === 0) throw new Error("Empty file");
	const delim = detectDelimiter(lines[0]);
	const headers = splitLine(lines[0], delim).map(normalizeHeader);
	const rows = lines.slice(1).map((line) => splitLine(line, delim));
	return { headers, rows };
}

// Map normalized header tokens to DB field names
function mapHeaderToField(header: string): string | null {
	if (header.includes("first name")) return "fname";
	if (header.includes("last name")) return "lname";
	if (header.includes("facebook name")) return "fbname";
	if (header.includes("imsa id")) return "imsaid";
	if (
		header.includes("imsa email") ||
		(header.includes("email") && !header.includes("teacher"))
	)
		return "email";
	if (header.includes("short blurb") || header === "blurb") return "blurb";
	if (header === "hall" || header.includes("hall")) return "hall";
	if (header === "wing" || header.includes("wing")) return "wing";
	if (
		header.includes("upload an image") ||
		header === "image" ||
		header.includes("image")
	)
		return "image";
	if (header.includes("physics")) return "physics";
	if (header.includes("chemistry")) return "chem";
	if (header.includes("biology")) return "biology";
	if (header.includes("other science")) return "sciother";
	if (header.includes("core math")) return "mathcore";
	if (header.includes("non-core math") || header.includes("non core math"))
		return "mathother";
	if (header.includes("computer science")) return "cs";
	if (header.includes("world language") || header === "language")
		return "language";
	// ignored: availability/courses if not present
	return null;
}

function toIntOrNull(val: string): number | null {
	const n = parseInt(val, 10);
	return Number.isFinite(n) ? n : null;
}

function truncateBlurb(b: string): string {
	const max = 400;
	if (!b) return "";
	if (b.length <= max) return b;
	return b.slice(0, max);
}

// Upload image URL to Cloudinary and return the new URL
async function uploadImageToCloudinary(
	imageUrl: string,
	tutorName: string
): Promise<string> {
	if (!imageUrl || imageUrl.trim() === "") {
		return "";
	}

	try {
		// Check if it's already a Cloudinary URL
		if (imageUrl.includes("res.cloudinary.com")) {
			console.log(`Image already on Cloudinary: ${imageUrl}`);
			return imageUrl;
		}

		console.log(`Uploading image for ${tutorName}: ${imageUrl}`);

		const result = await cloudinary.uploader.upload(imageUrl, {
			folder: "peer-tutoring",
			resource_type: "image",
			public_id: `tutor_${tutorName
				.toLowerCase()
				.replace(/\s+/g, "_")}_${Date.now()}`,
		});

		console.log(
			`Successfully uploaded to Cloudinary: ${result.secure_url}`
		);
		return result.secure_url;
	} catch (error) {
		console.error(`Failed to upload image for ${tutorName}:`, error);
		// Return original URL as fallback
		return imageUrl;
	}
}

export interface CsvTutorRow {
	fname?: string;
	lname?: string;
	fbname?: string;
	imsaid?: number | null;
	email?: string;
	blurb?: string;
	hall?: number | null;
	wing?: number | null;
	image?: string;
	physics?: string;
	chem?: string;
	biology?: string;
	sciother?: string;
	mathcore?: string;
	mathother?: string;
	cs?: string;
	language?: string;
}

function parseCsvToTutors(csvPath: string): CsvTutorRow[] {
	const content = fs.readFileSync(csvPath, "utf8");
	const { headers, rows } = parseDelimited(content);
	const fieldIndices: { [key: string]: number } = {};
	headers.forEach((h, idx) => {
		const field = mapHeaderToField(h);
		if (field) fieldIndices[field] = idx;
	});

	const tutors: CsvTutorRow[] = rows.map((cols, rowIdx) => {
		const get = (field: string): string => {
			const idx = fieldIndices[field];
			return idx === undefined ? "" : (cols[idx] ?? "").trim();
		};

		const tutor: CsvTutorRow = {
			fname: get("fname"),
			lname: get("lname"),
			fbname: get("fbname"),
			imsaid: toIntOrNull(get("imsaid")),
			email: get("email"),
			blurb: truncateBlurb(get("blurb")),
			hall: toIntOrNull(get("hall")),
			wing: toIntOrNull(get("wing")),
			image: get("image"),
			physics: get("physics"),
			chem: get("chem"),
			biology: get("biology"),
			sciother: get("sciother"),
			mathcore: get("mathcore"),
			mathother: get("mathother"),
			cs: get("cs"),
			language: get("language"),
		};

		// basic validation
		if (!tutor.fname || !tutor.lname || !tutor.email) {
			console.warn(
				`Row ${
					rowIdx + 2
				}: Missing required fields (fname/lname/email). This row will still attempt insert and may fail.`
			);
		}
		return tutor;
	});

	return tutors;
}

// Process tutors and upload images to Cloudinary
async function processTutorsWithImages(
	tutors: CsvTutorRow[]
): Promise<CsvTutorRow[]> {
	const processedTutors: CsvTutorRow[] = [];

	for (let i = 0; i < tutors.length; i++) {
		const tutor = tutors[i];
		const tutorName = `${tutor.fname || "unknown"}_${
			tutor.lname || "unknown"
		}`;

		console.log(`Processing tutor ${i + 1}/${tutors.length}: ${tutorName}`);

		let cloudinaryUrl = "";
		if (tutor.image) {
			cloudinaryUrl = await uploadImageToCloudinary(
				tutor.image,
				tutorName
			);
		}

		processedTutors.push({
			...tutor,
			image: cloudinaryUrl,
		});
	}

	return processedTutors;
}

function insertTutors(
	dbPath: string,
	tutors: CsvTutorRow[]
): Promise<{ ok: number; failed: number }> {
	return new Promise((resolve) => {
		const db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				console.error("Error opening database:", err.message);
			} else {
				console.log("Connected to SQLite database.");
			}
		});

		const sql = `
      INSERT INTO tutors (
        fname, lname, fbname, imsaid, email, blurb, hall, wing, image,
        totaltime, approvedtime, starttime, is_available, availability, courses,
        physics, chem, biology, sciother, mathother, mathcore, cs, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

		let ok = 0,
			failed = 0;

		db.serialize(() => {
			const stmt = db.prepare(sql);
			tutors.forEach((t, i) => {
				stmt.run(
					t.fname ?? "",
					t.lname ?? "",
					t.fbname ?? "",
					t.imsaid ?? null,
					t.email ?? "",
					t.blurb ?? "",
					t.hall ?? null,
					t.wing ?? null,
					t.image ?? "",
					0, // totaltime
					0, // approvedtime
					null, // starttime
					0, // is_available
					"", // availability
					"", // courses
					t.physics ?? "",
					t.chem ?? "",
					t.biology ?? "",
					t.sciother ?? "",
					t.mathother ?? "",
					t.mathcore ?? "",
					t.cs ?? "",
					t.language ?? "",
					(err: Error | null) => {
						if (err) {
							failed++;
							console.error(
								`Row ${i + 2} insert error:`,
								(err as any).message
							);
						} else {
							ok++;
						}
					}
				);
			});
			stmt.finalize((err) => {
				if (err) console.error("Finalize error:", err.message);
				db.close((cerr) => {
					if (cerr) {
						console.error("Error closing database:", cerr.message);
					} else {
						console.log("Database connection closed.");
					}
					console.log(`Insert summary: ok=${ok}, failed=${failed}`);
					resolve({ ok, failed });
				});
			});
		});
	});
}

async function main() {
	const csvArg = process.argv[2];
	if (!csvArg) {
		console.error("Usage: tsx setup.ts <path-to-tutors.csv>");
		process.exit(1);
	}
	const csvPath = path.resolve(csvArg);
	if (!fs.existsSync(csvPath)) {
		console.error("CSV file not found:", csvPath);
		process.exit(1);
	}

	console.log("=== IMSA Peer Tutoring Setup ===");
	console.log("Parsing CSV and uploading images to Cloudinary...");

	const tutors = parseCsvToTutors(csvPath);
	console.log(`Parsed ${tutors.length} tutors from`, csvPath);

	// Process images and upload to Cloudinary
	const processedTutors = await processTutorsWithImages(tutors);
	console.log("Image processing complete.");

	const dbPath = path.resolve("./peertutoringdb.sqlite");
	await insertTutors(dbPath, processedTutors);
}

// Only run if executed directly
if (process.argv[1] && process.argv[1].endsWith("setup.ts")) {
	main().catch((e) => {
		console.error(e);
		process.exit(1);
	});
}
