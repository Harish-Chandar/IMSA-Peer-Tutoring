import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.DBHOST || 5000;

// import bulletinrouter from './bulletinapi.js';

app.use(cors());

// set up server
app.listen(PORT, () => {
	console.log(`server listening on port ${PORT}`);
});

// allows routes to parse json
app.use(express.json());

// initialize database
const db = new sqlite3.Database(
	"peertutoringdb.sqlite",
	(err: Error | null) => {
		if (err) {
			return console.error(err.message);
		}
		console.log("connected to the database");
	}
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Multer storage (in-memory so we can send directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// api route for filtering through tutors by either name or hall
app.get("/api/tutors/search", (req: Request, res: Response) => {
	const { name, hall } = req.query as { name?: string; hall?: string };
	let query = "SELECT * FROM tutors WHERE 1=1";
	const params: (string | number)[] = [];

	if (name) {
		// trim so no whitespace
		const trimmedName = name.trim();

		// use full name (first + last) for matching
		query += " AND LOWER(fname || ' ' || lname) LIKE LOWER(?)";
		params.push(`%${trimmedName}%`);
	}
	if (hall) {
		// the frontend sends back a comma list for multiple halls, so handle that
		if (hall.includes(",")) {
			const hallList = hall
				.split(",")
				// maps everything to an int and filters out any NaN values
				.map((h) => parseInt(h.trim()))
				.filter((h) => !isNaN(h));
			if (hallList.length === 0) {
				return res
					.status(400)
					.json({ error: "Invalid hall parameter" });
			}

			// appends to query and params for multiple halls
			query += " AND hall IN (" + hallList.map(() => "?").join(",") + ")";
			params.push(...hallList);

			// for when there is only 1 hall, just parse int
		} else {
			const hallInt = parseInt(hall);
			if (isNaN(hallInt)) {
				return res
					.status(400)
					.json({ error: "Invalid hall parameter" });
			}
			query += " AND hall = ?";
			params.push(hallInt);
		}
	}

	// debug log statement of query
	console.log("Executing Query:", query, "Params:", params);

	// execute the query
	db.all(query, params, (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("Database error:", err);
			res.status(500).json({ error: "Error retrieving tutors" });
			return;
		}

		res.json(rows);
	});
});

// app.post("/api/schedule", (req, res) => {
// 	const { title, course, teachers, location, date, time } = req.body;
//
// 	const sql = `INSERT INTO schedule (title, course, teachers, location, date, time)
// 	VALUES (?, ?, ?, ?, ?, ?)`;
//
// 	db.run(
// 		sql,
// 		[title, course, teachers, location, date, time],
// 		function (err) {
// 			if (err) {
// 				console.error("Error inserting data:", err.message);
// 				res.status(500).json({ error: err.message });
// 				return;
// 			}
// 			res.json({
// 				message: "Schedule entry added",
// 				id: this.lastID,
// 			});
// 		}
// 	);
// });

app.get("/api/tutors/:id", (req, res) => {
	const id = req.params.id;
	db.all("SELECT * FROM tutors WHERE id = ?", [id], (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).send("Internal Server Error");
		} else {
			res.json(rows);
		}
	});
});

app.get("/api/tutors", (req, res) => {
	db.all("SELECT * FROM tutors WHERE is_available = 1", [], (err, rows) => {
		if (err) {
			console.error("Database error:", err.message);
			return res.status(500).json({ error: err.message });
		}

		res.json(rows);
	});
});

// api route for retrieving a whole lot about a tutor based on ID
app.get("/api/tutors/:id", (req: Request, res: Response) => {
	const tutorId = parseInt(req.params.id);

	// validate tutorId
	if (isNaN(tutorId) || tutorId < 0) {
		return res.status(400).json({ error: "Invalid tutor ID" });
	}

	db.all(
		"SELECT * FROM tutors WHERE id = ?",
		[tutorId],
		(err: Error | null, rows: any[]) => {
			if (err) {
				console.error(err);
				return res
					.status(500)
					.json({ error: "Error retrieving tutor data" });
			}

			if (rows.length === 0) {
				return res.status(404).json({ error: "Tutor not found" });
			}

			res.status(200).json(rows[0]);
		}
	);
});

// create tutor endpoint
app.post("/api/tutors", authenticateAdmin, (req: Request, res: Response) => {
	const {
		fname,
		lname,
		fbname,
		imsaid,
		email,
		blurb,
		hall,
		wing,
		image,
		availability,
		physics,
		chem,
		biology,
		sciother,
		mathother,
		mathcore,
		cs,
		language,
	} = req.body;

	// Explicitly set is_available to 0 on creation to avoid inconsistent active state
	const sql = `INSERT INTO tutors 
	(fname, lname, fbname, imsaid, email, blurb, hall, wing, image, availability, 
	 physics, chem, biology, sciother, mathother, mathcore, cs, language, totaltime, starttime, is_available) 
	 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, 0)`;

	db.run(
		sql,
		[
			fname || "",
			lname || "",
			fbname || "",
			imsaid || null,
			email || "",
			blurb || "",
			hall || null,
			wing || null,
			image || "",
			availability || "",
			physics || "",
			chem || "",
			biology || "",
			sciother || "",
			mathother || "",
			mathcore || "",
			cs || "",
			language || "",
		],
		function (err) {
			if (err) {
				console.error("tutor insert error:", err);
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({
				id: this.lastID,
				message: "tutor created successfully",
			});
		}
	);
});

// delete tutor endpoint
app.delete(
	"/api/tutors/:id",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const tutorId = parseInt(req.params.id);

		// validate tutorId
		if (isNaN(tutorId) || tutorId < 0) {
			return res.status(400).json({ error: "invalid tutor id" });
		}
		// Deletes the image from Cloudinary
		db.get(
			"SELECT image FROM tutors WHERE id = ?",
			[tutorId],
			(err, row: any) => {
				if (err) return res.status(500).json({ error: err.message });
				if (!row)
					return res.status(404).json({ error: "Tutor not found" });
				console.log("Deleting image:", row.image);
				const url = row.image;
				const parts = url.split("/");
				const filename =
					parts[parts.length - 2] + "/" + parts[parts.length - 1];
				const publicId = filename.split(".")[0];
				// A long way to get public id from the full URL haha
				console.log("Derived publicId:", publicId);
				cloudinary.uploader.destroy(publicId, (error, result) => {
					if (error) console.error("Error deleting image:", error);
				});
			}
		);

		const sql = "DELETE FROM tutors WHERE id = ?";

		db.run(sql, tutorId, function (err) {
			if (err) {
				console.error("tutor delete error:", err);
				res.status(500).json({ error: err.message });
				return;
			}

			// check if any rows were actually deleted
			if (this.changes === 0) {
				return res.status(404).json({ error: "tutor not found" });
			}

			res.json({ message: "tutor deleted successfully" });
		});
	}
);

// update tutor endpoint
app.put("/api/tutors/:id", authenticateAdmin, (req: Request, res: Response) => {
	const tutorId = parseInt(req.params.id);

	// validate tutorId
	if (isNaN(tutorId) || tutorId < 0) {
		return res.status(400).json({ error: "invalid tutor id" });
	}

	const {
		fname,
		lname,
		fbname,
		imsaid,
		email,
		blurb,
		hall,
		wing,
		image,
		availability,
		physics,
		chem,
		biology,
		sciother,
		mathother,
		mathcore,
		cs,
		language,
	} = req.body;

	db.get(
		"SELECT image FROM tutors WHERE id = ?",
		[tutorId],
		(err, row: any) => {
			if (err) return res.status(500).json({ error: err.message });
			if (!row) return res.status(404).json({ error: "Tutor not found" });

			const oldImage = row.image;
			const sql = `UPDATE tutors SET 
			fname = ?, lname = ?, fbname = ?, imsaid = ?, email = ?, blurb = ?, 
			hall = ?, wing = ?, image = ?, availability = ?, 
			physics = ?, chem = ?, biology = ?, sciother = ?, 
			mathother = ?, mathcore = ?, cs = ?, language = ?
			WHERE id = ?`;

			db.run(
				sql,
				[
					fname || "",
					lname || "",
					fbname || "",
					imsaid || null,
					email || "",
					blurb || "",
					hall || null,
					wing || null,
					image || "",
					availability || "",
					physics || "",
					chem || "",
					biology || "",
					sciother || "",
					mathother || "",
					mathcore || "",
					cs || "",
					language || "",
					tutorId,
				],
				function (err) {
					if (err) {
						console.error("tutor update error:", err);
						res.status(500).json({ error: err.message });
						return;
					}

					if (this.changes === 0) {
						return res
							.status(404)
							.json({ error: "tutor not found" });
					}

					if (image && oldImage && oldImage !== image) {
						const url = oldImage;
						const parts = url.split("/");
						const filename =
							parts[parts.length - 2] +
							"/" +
							parts[parts.length - 1];
						const publicId = filename.split(".")[0];
						console.log("Deleting old Cloudinary image:", publicId);

						cloudinary.uploader.destroy(
							publicId,
							(error, result) => {
								if (error)
									console.error(
										"Error deleting image:",
										error
									);
								else
									console.log(
										"Cloudinary delete result:",
										result
									);
							}
						);
					}

					res.json({ message: "tutor updated successfully" });
				}
			);
		}
	);
});

// api route for retrieving parseable string of classes for a given tutor based on ID
app.get("/api/tutors/:id/classes", (req: Request, res: Response) => {
	const tutorId = req.params.id;
	db.all(
		"SELECT physics,chem,biology,sciother,mathother,mathcore,cs,language FROM tutors WHERE id=?",
		[tutorId],
		(err: Error | null, rows: any[]) => {
			if (err) {
				return res.send("Error retrieving classes");
			}
			res.status(200).json(rows);
		}
	);
});

type Admin = {
	id: number;
	email: string;
	pwd: string;
	access: number;
};

function authenticateAdmin(req: Request, res: Response, next: Function) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Missing token" });
	}

	const token = authHeader.split(" ")[1];
	console.log("Token received:", token);

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			email: string;
			access: number;
		};

		if (decoded.access < 1) {
			return res.status(403).json({ error: "Insufficient privileges" });
		}

		//@ts-ignore
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(403).json({ error: "Invalid or expired token" });
	}
}

app.post("/api/login", (req: Request, res: Response) => {
	const { email, password }: { email: string; password: string } = req.body;

	const query = `SELECT * FROM admins WHERE email = ?`;
	db.get<Admin>(query, [email], (err, row) => {
		if (err) return res.status(500).json({ error: "DB error" });
		if (!row)
			return res.status(401).json({ error: "Invalid email or password" });

		bcrypt.compare(
			password,
			row.pwd,
			(err: Error | undefined, result: boolean) => {
				if (err)
					return res
						.status(500)
						.json({ error: "Hash comparison error" });
				if (!result)
					return res
						.status(401)
						.json({ error: "Invalid email or password" });

				const token = jwt.sign(
					{ email: row.email, access: row.access },
					process.env.JWT_SECRET!,
					{ expiresIn: "1h" }
				);

				res.json({
					success: true,
					token,
					access: row.access,
					email: row.email,
				});
			}
		);
	});
});

app.post(
	"/api/admin/create",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const { email, password, role } = req.body;

		if (!email || !password || !role) {
			return res
				.status(400)
				.json({ error: "Email, password, and role are required" });
		}

		// check if email already exists, return 400 error if it does
		const checkEmailQuery = `SELECT * FROM admins WHERE email = ?`;
		db.get(
			checkEmailQuery,
			[email],
			(err: Error | null, row: Admin | undefined) => {
				if (err) {
					console.error("Database error:", err);
					return res
						.status(500)
						.json({ error: "Error checking email" });
				}
				if (row) {
					return res
						.status(400)
						.json({ error: "Email already exists" });
				}
			}
		);

		// Hash the password
		bcrypt.hash(password, 10, (err: Error | undefined, hash: string) => {
			if (err) {
				console.error("Hashing error:", err);
				return res
					.status(500)
					.json({ error: "Error creating admin account" });
			}

			const sql = `INSERT INTO admins (email, pwd, access) VALUES (?, ?, ?)`;
			db.run(
				sql,
				[email, hash, role],
				function (this: any, err: Error | null) {
					if (err) {
						console.error("Database error:", err);
						return res
							.status(500)
							.json({ error: "Error creating admin account" });
					}
					res.status(201).json({
						id: this.lastID,
						message: "Admin account created successfully",
					});
				}
			);
		});
	}
);

app.get("/api/admins", authenticateAdmin, (req: Request, res: Response) => {
	const sql = "SELECT * FROM admins";

	db.all(sql, [], (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ error: "Error retrieving admin accounts" });
		}
		res.json(rows);
	});
});

app.post(
	"/api/admins/:email/delete",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const adminEmail = req.params.email;

		if (!adminEmail) {
			return res.status(400).json({ error: "Invalid admin email" });
		}

		const sql = "DELETE FROM admins WHERE email = ?";
		db.run(sql, [adminEmail], function (err) {
			if (err) {
				console.error("Database error:", err);
				return res
					.status(500)
					.json({ error: "Error deleting admin account" });
			}
			res.json({ message: "Admin account deleted successfully" });
		});
	}
);

// api route for retrieving schedule string for a tutor
app.get("/api/tutors/:id/schedule", (req: Request, res: Response) => {
	const tutorId = req.params.id;

	db.get(
		"SELECT availability FROM tutors WHERE id = ?",
		[tutorId],
		(err: Error | null, row: any) => {
			if (err) {
				console.error("Database error:", err);
				return res
					.status(500)
					.json({ error: "Error retrieving schedule" });
			}

			if (!row) {
				return res.status(404).json({ error: "Tutor not found" });
			}

			// Return the raw schedule string
			res.status(200).json({ availability: row.availability || "" });
		}
	);
});

// test api route for fun
app.get("/api/test", (req: Request, res: Response) => {
	db.all("SELECT * FROM tutors", (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("Database Error:", err);
			res.status(500).send("Database error occurred");
			return;
		}
		console.log("Fetched tutors:", rows); // ensure this is visible
		res.status(200).json(rows);
	});
	console.log("Test route hit!");
});

// bulletin board api routes
app.post("/api/bulletin", authenticateAdmin, (req: Request, res: Response) => {
	const {
		title,
		content,
		event_date,
		author,
		contact_info,
		highpriority,
		image,
	} = req.body;
	const creation_date = new Date().toISOString();

	const sql = `INSERT INTO bulletin (title, content, creation_date, event_date, author, contact_info, highpriority, image) 
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

	db.run(
		sql,
		[
			title || "",
			content || "",
			creation_date,
			event_date || null,
			author || "Admin",
			contact_info || "",
			highpriority || 0,
			image || "",
		],
		function (err) {
			if (err) {
				console.error("bulletin insert error:", err);
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({ id: this.lastID, message: "post created successfully" });
		}
	);
});

app.get("/api/bulletin", (req: Request, res: Response) => {
	const sql = "SELECT * FROM bulletin ORDER BY creation_date DESC";

	db.all(sql, [], (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("bulletin fetch error:", err);
			res.status(500).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

app.delete(
	"/api/bulletin/:id",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const sql = "DELETE FROM bulletin WHERE id = ?";

		db.run(sql, req.params.id, function (err) {
			if (err) {
				console.error("bulletin delete error:", err);
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({ message: "post deleted successfully" });
		});
	}
);

// resources routes

// api route for inserting new data into the resources table
app.post("/api/resources", authenticateAdmin, (req: Request, res: Response) => {
	const { teacher, email, course, department, url, type, links } = req.body;

	console.log("Request body:", req.body); // Log the entire request body
	console.log("Links received:", links); // Log just the links

	// Create search field for easier searching
	const search_field = `${teacher.toLowerCase()} ${course.toLowerCase()}`;

	// First insert the main resource
	db.run(
		"INSERT INTO resources (teacher, email, course, department, url, type, search_field) VALUES (?, ?, ?, ?, ?, ?, ?)",
		[teacher, email, course, department, url, type, search_field],
		function (this: any, err: Error | null) {
			if (err) {
				console.error("Error inserting resource:", err);
				return res.status(500).json({ error: "Error adding resource" });
			}

			// Get the ID of the newly inserted resource
			const resourceId = this.lastID;
			console.log(`Created resource with ID: ${resourceId}`);

			// Now handle the links array if it exists
			if (links && Array.isArray(links) && links.length > 0) {
				console.log(
					`Processing ${links.length} links for resource ${resourceId}`
				);

				// Use direct inserts instead of prepared statements
				let insertedLinks = 0;
				let errorCount = 0;

				links.forEach(
					(link: { label: string; url: string }, index: number) => {
						console.log(`Inserting link ${index + 1}:`, link);

						db.run(
							"INSERT INTO resource_links (resource_id, label, url) VALUES (?, ?, ?)",
							[resourceId, link.label, link.url],
							function (err: Error | null) {
								if (err) {
									console.error(
										`Error inserting link ${index + 1}:`,
										err
									);
									errorCount++;
								} else {
									console.log(
										`Link ${index + 1} inserted with ID: ${
											this.lastID
										}`
									);
									insertedLinks++;
								}

								// If this is the last link (whether success or error), send the response
								if (
									insertedLinks + errorCount ===
									links.length
								) {
									res.status(201).json({
										id: resourceId,
										message: `Resource created successfully. ${insertedLinks} links inserted. ${errorCount} links failed.`,
									});
								}
							}
						);
					}
				);
			} else {
				// No links to insert, send response immediately
				res.status(201).json({
					id: resourceId,
					message: "Resource created successfully with no links.",
				});
			}
		}
	);
});

// api route for retrieving all resources
app.get("/api/resources", (req: Request, res: Response) => {
	db.all("SELECT * FROM resources", (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ error: "Error retrieving resources" });
		}
		res.json(rows);
	});
});

// api route for retrieving resources by department
app.get("/api/resources/search", (req: Request, res: Response) => {
	const searchQuery = req.query.searchQuery as string; // Make sure you use searchQuery
	const departmentParam = req.query.department as string;

	console.log("API received searchQuery:", searchQuery); // Debug
	console.log("API received department:", departmentParam); // Debug

	let query = "SELECT * FROM resources WHERE 1=1"; // 1=1 lets you append more conditions easily with AND operator.
	const params: (string | number)[] = [];

	if (searchQuery) {
		// Course abbreviation to full name mapping (same as FindTutors)
		const courseMapping: { [key: string]: string } = {
			"MI III":
				"Mathematical Investigations III Mathematical Investigations 3",
			"MI IV":
				"Mathematical Investigations IV Mathematical Investigations 4",
			CSI: "Computer Science Inquiry",
			"SI Physics":
				"Scientific Inquiries Physics Scientific Inquiries: Physics",
			"SI Chemistry":
				"Scientific Inquiries Chemistry Scientific Inquiries: Chemistry",
			MSI: "Methods in Scientific Inquiries Methods of Scientific Inquiries",
			"MI II":
				"Mathematical Investigations II Mathematical Investigations 2",
			"MI I/II":
				"Mathematical Investigations I/II Mathematical Investigations 1/2 Mathematical Investigations 1",
			"BC I": "BC Calculus I BC Calculus 1 BC 1 Calculus Calc",
			"BC II": "BC Calculus II BC Calculus 2 BC 2 Calculus Calc",
			"BC III": "BC Calculus III BC Calculus 3 BC 3 Calculus Calc",
			"BC I/II": "BC Calculus I/II BC Calculus 1/2 Calculus Calc",
			"BC II/III": "BC Calculus II/III BC Calculus 2/3 Calculus Calc",
			"AB I": "AB Calculus I AB Calculus 1 AB 1 Calculus Calc",
			"AB II": "AB Calculus II AB Calculus 2 AB 2 Calculus Calc",
			OOP: "Object Oriented Programming",
			"Multi-Variable Calculus":
				"MVC Multi Variable Calculus Calc 3 Calculus 3 Calc III Calculus III Multivariable calculus",
			"Advanced Programming": "Adpro",
		};

		// Build an array of search terms including original query and expansions
		const searchTerms = [searchQuery.trim()];

		// Check if the search query contains any of our abbreviations and add expansions
		Object.keys(courseMapping).forEach((abbreviation) => {
			if (
				searchQuery.toLowerCase().includes(abbreviation.toLowerCase())
			) {
				// Add the full course name as a separate search term
				searchTerms.push(courseMapping[abbreviation]);
			}
		});

		// Also check if the search query contains words from the full course names
		// and add the corresponding abbreviations
		Object.keys(courseMapping).forEach((abbreviation) => {
			const fullCourseName = courseMapping[abbreviation];
			const searchLower = searchQuery.toLowerCase();
			const courseWords = fullCourseName.toLowerCase().split(" ");

			// Check if any significant words from the search query match course name words
			const searchWords = searchLower
				.split(" ")
				.filter((word) => word.length > 2); // ignore small words
			const hasMatchingWords = searchWords.some((searchWord) =>
				courseWords.some(
					(courseWord) =>
						courseWord.includes(searchWord) ||
						searchWord.includes(courseWord)
				)
			);

			if (hasMatchingWords && !searchTerms.includes(abbreviation)) {
				searchTerms.push(abbreviation);
				searchTerms.push(fullCourseName);
			}
		});

		// Build OR conditions for each search term across multiple fields
		const conditions = [];
		for (let i = 0; i < searchTerms.length; i++) {
			conditions.push(
				"(LOWER(search_field) LIKE LOWER(?) OR LOWER(course) LIKE LOWER(?) OR LOWER(teacher) LIKE LOWER(?))"
			);
			const searchPattern = `%${searchTerms[i]}%`;
			params.push(searchPattern, searchPattern, searchPattern);
		}

		query += ` AND (${conditions.join(" OR ")})`;

		console.log("Original search query:", searchQuery); // Debug
		console.log("Search terms:", searchTerms); // Debug
	}
	if (departmentParam) {
		// the frontend sends back a comma list for multiple departments, so handle that
		if (departmentParam.includes(",")) {
			const departmentList = departmentParam
				.split(",")
				.map((d) => d.trim());

			if (departmentList.length === 0) {
				return res
					.status(400)
					.json({ error: "Invalid department parameter" });
			}

			//appends to query and params for multiple departments
			query +=
				" AND LOWER(department) IN (" +
				departmentList.map(() => "?").join(",") +
				")";
			params.push(...departmentList.map((d) => d.toLowerCase()));

			// for when there is only 1 dept
		} else {
			query += " AND LOWER(department) = LOWER(?)";
			params.push(departmentParam.trim().toLowerCase());
		}
	}

	// debug log statement of query
	console.log("Executing Query:", query, "Params:", params);

	// execute the query
	db.all(query, params, (err: Error | null, rows: any[]) => {
		if (err) {
			console.error("Database error:", err);
			res.status(500).json({ error: "Error retrieving resources" });
			return;
		}

		console.log("Query Results:", rows); // Log the query results

		if (rows.length === 0) {
			return res.status(404).json({ error: "No resources found" });
		}
		res.json(rows || []); // Always return an array
	});
});

app.get("/api/resources/departments", (req: Request, res: Response) => {
	db.all(
		"SELECT DISTINCT department FROM resources ORDER BY department",
		[],
		(err: Error | null, departments: { department: string }[]) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}
			const departmentNames = departments.map((row) => row.department);
			res.json(departmentNames);
		}
	);
});

// route to get details of a resource by ID
app.get("/api/resources/:id", (req: Request, res: Response) => {
	const resourceId = parseInt(req.params.id);

	// First, get the resource
	db.get(
		"SELECT * FROM resources WHERE resource_id = ?",
		[resourceId],
		(err, resource) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (!resource) {
				return res.status(404).json({ error: "Resource not found" });
			}

			// Then, get all links for this resource
			db.all(
				"SELECT link_id, label, url FROM resource_links WHERE resource_id = ?",
				[resourceId],
				(err, links) => {
					if (err) {
						// Even if there's an error getting links, return the resource
						return res.json({
							...resource,
							links: [],
						});
					}

					// Return the resource with links
					return res.json({
						...resource,
						links: links || [],
					});
				}
			);
		}
	);
});

// Add a new link to a resource
app.post(
	"/api/resources/:id/links",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const resourceId = parseInt(req.params.id);
		const { label, url } = req.body;

		if (!label || !url) {
			return res
				.status(400)
				.json({ error: "Label and URL are required" });
		}

		db.run(
			"INSERT INTO resource_links (resource_id, label, url) VALUES (?, ?, ?)",
			[resourceId, label, url],
			function (this: any, err: Error | null) {
				if (err) {
					console.error("Error adding link:", err);
					return res.status(500).json({ error: "Error adding link" });
				}

				res.status(201).json({
					linkId: this.lastID,
					message: "Link added successfully",
				});
			}
		);
	}
);

// Delete a link
app.delete(
	"/api/resources/:id/links/:linkId",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const linkId = parseInt(req.params.linkId);

		db.run(
			"DELETE FROM resource_links WHERE link_id = ?",
			[linkId],
			(err: Error | null) => {
				if (err) {
					console.error("Error deleting link:", err);
					return res
						.status(500)
						.json({ error: "Error deleting link" });
				}

				res.json({ message: "Link deleted successfully" });
			}
		);
	}
);

// Update the main resource URL (for legacy resources)
app.patch(
	"/api/resources/:id",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const resourceId = parseInt(req.params.id);
		const { url } = req.body;

		db.run(
			"UPDATE resources SET url = ? WHERE resource_id = ?",
			[url, resourceId],
			(err: Error | null) => {
				if (err) {
					console.error("Error updating resource:", err);
					return res
						.status(500)
						.json({ error: "Error updating resource" });
				}

				res.json({ message: "Resource updated successfully" });
			}
		);
	}
);

// Update resource information
app.patch(
	"/api/resources/:id/info",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const resourceId = parseInt(req.params.id);
		const { teacher, email, course, department, type } = req.body;

		// Create search field for easier searching
		const search_field = `${teacher.toLowerCase()} ${course.toLowerCase()}`;

		db.run(
			"UPDATE resources SET teacher = ?, email = ?, course = ?, department = ?, type = ?, search_field = ? WHERE resource_id = ?",
			[
				teacher,
				email,
				course,
				department,
				type,
				search_field,
				resourceId,
			],
			(err: Error | null) => {
				if (err) {
					console.error("Error updating resource information:", err);
					return res
						.status(500)
						.json({ error: "Error updating resource information" });
				}

				res.json({
					message: "Resource information updated successfully",
				});
			}
		);
	}
);

// Check-in a tutor (start session)
app.post(
	"/api/tutors/:id/checkin",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const tutorId = parseInt(req.params.id);
		if (isNaN(tutorId) || tutorId < 0) {
			return res.status(400).json({ error: "Invalid tutor ID" });
		}
		const startTime = Date.now();
		// Set starttime and is_available=1 (active)
		db.run(
			"UPDATE tutors SET starttime = ?, is_available = 1 WHERE id = ?",
			[startTime, tutorId],
			function (err) {
				if (err) {
					console.error("Check-in error:", err);
					return res
						.status(500)
						.json({ error: "Error checking in tutor" });
				}
				if (this.changes === 0) {
					return res.status(404).json({ error: "Tutor not found" });
				}
				res.json({ message: "Tutor checked in", starttime: startTime });
			}
		);
	}
);

// Check-out a tutor (end session with override hours)
app.post(
	"/api/tutors/:id/checkout",
	authenticateAdmin,
	(req: Request, res: Response) => {
		const tutorId = parseInt(req.params.id);
		const { hoursToAdd } = req.body;

		if (isNaN(tutorId) || tutorId < 0) {
			return res.status(400).json({ error: "Invalid tutor ID" });
		}

		const hoursNum = Number(hoursToAdd);
		if (isNaN(hoursNum) || hoursNum < 0) {
			return res.status(400).json({ error: "Invalid hours value" });
		}

		// Get current starttime and totaltime
		db.get(
			"SELECT starttime, totaltime FROM tutors WHERE id = ?",
			[tutorId],
			(
				err: Error | null,
				row:
					| { starttime: number | null; totaltime: number | null }
					| undefined
			) => {
				if (err) {
					console.error("Check-out fetch error:", err);
					return res
						.status(500)
						.json({ error: "Error fetching tutor data" });
				}
				if (!row || row.starttime == null) {
					return res
						.status(400)
						.json({ error: "Tutor is not checked in" });
				}

				// Convert hours to milliseconds and add to totaltime
				const hoursInMs = hoursNum * 3600000;
				const newTotal = (row.totaltime || 0) + hoursInMs;

				// Set starttime to null, update totaltime, set is_available=0 (inactive)
				db.run(
					"UPDATE tutors SET starttime = NULL, totaltime = ?, is_available = 0 WHERE id = ?",
					[newTotal, tutorId],
					function (err2) {
						if (err2) {
							console.error("Check-out update error:", err2);
							return res
								.status(500)
								.json({ error: "Error checking out tutor" });
						}
						if (this.changes === 0) {
							return res
								.status(404)
								.json({ error: "Tutor not found" });
						}
						res.json({
							message: "Tutor checked out successfully",
							totaltime: newTotal,
							hoursAdded: hoursNum,
						});
					}
				);
			}
		);
	}
);

app.post(
	"/api/upload-image",
	authenticateAdmin,
	upload.single("image"), // "image" must match the FormData field name
	async (req: Request, res: Response) => {
		try {
			if (!(req as any).file) {
				return res.status(400).json({ error: "No file uploaded" });
			}

			// Upload to Cloudinary
			const result = await cloudinary.uploader.upload_stream(
				{
					folder: "peer-tutoring", // optional folder
					resource_type: "image",
				},
				(error, result) => {
					if (error) {
						console.error("Cloudinary upload error:", error);
						return res.status(500).json({ error: "Upload failed" });
					}
					res.json({ url: result?.secure_url });
				}
			);

			// Write the file buffer to Cloudinary stream
			result.end((req as any).file.buffer);
		} catch (err) {
			console.error("Cloudinary failed:", err);
			res.status(500).json({ error: "Cloudinary failed" });
		}
	}
);
