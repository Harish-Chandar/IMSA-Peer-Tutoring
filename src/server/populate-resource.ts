import sqlite3 from "sqlite3";

export const sampleResources = [
	{
		teacher: "Mr. Pranav Gadde",
		email: "pgadde@imsa.edu",
		course: "Object Oriented Programming",
		department: "Computer Science",
	},
	{
		teacher: "Atharv Kanchi",
		email: "akanchi2@imsa.edu",
		course: "Advanced Programming",
		department: "Computer Science",
	},
	{
		teacher: "Krithik",
		email: "ksenthilkumar@imsa.edu",
		course: "SI Physics",
		department: "Science",
	},
	{
		teacher: "Ian Wang",
		email: "iwang@imsa.edu",
		course: "BC 1",
		department: "Math",
	},
	{
		teacher: "Harish Chandar",
		email: "hchandar@imsa.edu",
		course: "Foundations of Healthy Living",
		department: "Wellness",
	},
	{
		teacher: "Vishnu Vijay",
		email: "vvijay@imsa.edu",
		course: "Creative Writing",
		department: "English",
	},
	{
		teacher: "Aarav Shah",
		email: "ashah@imsa.edu",
		course: "BC 2",
		department: "Math",
	},
	{
		teacher: "Ms. Zuidema",
		email: "mzuidema@imsa.edu",
		course: "Spanish IV",
		department: "World Languages",
	},
];

export const sampleLinks = [
	{
		resourceIndex: 0,
		label: "Khan Academy Tutorials",
		url: "https://khanacademy.org/cs",
	},
	{
		resourceIndex: 1,
		label: "Advanced Programming Guide",
		url: "https://khanacademy.org/ap",
	},
	{
		resourceIndex: 1,
		label: "GitHub Code Examples",
		url: "https://github.com/examples/ap",
	},
	{
		resourceIndex: 2,
		label: "Physics Formulas",
		url: "https://physicsformulas.com",
	},
	{
		resourceIndex: 3,
		label: "Calculus Reference",
		url: "https://mathreference.com/calculus",
	},
	{
		resourceIndex: 7,
		label: "Spanish Conjugation Practice",
		url: "https://conjuguemos.com/practice",
	},
];

export function populateResources(
	db: any,
	sampleResources: any[],
	sampleLinks: any[],
	callback: () => void
) {
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
			const insertResource = `INSERT INTO resources (teacher, email, course, department, search_field) VALUES (?, ?, ?, ?, ?)`;
			let completed = 0;
			if (sampleResources.length === 0) {
				callback();
				return;
			}
			sampleResources.forEach((resource, index) => {
				// Course abbreviation to full name mapping
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
					MSI: "Methods in Scientific Inquiries",
					"MI II":
						"Mathematical Investigations II Mathematical Investigations 2",
					"MI I/II":
						"Mathematical Investigations I/II Mathematical Investigations 1/2 Mathematical Investigations 1",
					"BC I": "BC Calculus I BC Calculus 1 BC 1",
					"BC II": "BC Calculus II BC Calculus 2 BC 2",
					"BC III": "BC Calculus III BC Calculus 3 BC 3",
					"BC I/II": "BC Calculus I/II BC Calculus 1/2",
					"BC II/III": "BC Calculus II/III BC Calculus 2/3",
					"AB I": "AB Calculus I AB Calculus 1 AB 1",
					"AB II": "AB Calculus II AB Calculus 2 AB 2",
					"Object Oriented Programming": "OOP",
				};

				// Build enhanced search field with abbreviations
				let searchField = `${resource.teacher.toLowerCase()} ${resource.course.toLowerCase()}`;

				// Add abbreviations if course matches any mapping (both ways)
				Object.keys(courseMapping).forEach((key) => {
					if (
						resource.course
							.toLowerCase()
							.includes(key.toLowerCase())
					) {
						searchField += ` ${courseMapping[key].toLowerCase()}`;
					}
					if (
						resource.course
							.toLowerCase()
							.includes(courseMapping[key].toLowerCase())
					) {
						searchField += ` ${key.toLowerCase()}`;
					}
				});

				db.run(
					insertResource,
					[
						resource.teacher,
						resource.email,
						resource.course,
						resource.department,
						searchField,
					],
					function (this: { lastID: number }, err: Error | null) {
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
								(link) => link.resourceIndex === index
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
											console.log(
												`Successfully inserted link: ${link.label}`
											);
										}
									}
								);
							});
						}
						completed++;
						if (completed === sampleResources.length) {
							db.all(
								"SELECT * FROM resources",
								[],
								(err: Error | null, rows: any[]) => {
									if (err) {
										console.error(
											"Error verifying resources data:",
											err.message
										);
									} else {
										console.log("Inserted resources:");
										console.table(rows);
									}
									db.all(
										"SELECT * FROM resource_links",
										[],
										(err: Error | null, rows: any[]) => {
											if (err) {
												console.error(
													"Error verifying resource_links data:",
													err.message
												);
											} else {
												console.log(
													"Inserted resource links:"
												);
												console.table(rows);
											}
											callback();
										}
									);
								}
							);
						}
					}
				);
			});
		});
	});
}

// execution block for running this file independently
const isMainModule =
	process.argv[1] && process.argv[1].endsWith("populate-resource.ts");
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
						console.error(
							'Error creating "resource_links" table:',
							err.message
						);
					} else {
						console.log(
							'Successfully created "resource_links" table.'
						);
					}

					populateResources(db, sampleResources, sampleLinks, () => {
						db.close((err: Error | null) => {
							if (err) {
								console.error(
									"Error closing database:",
									err.message
								);
							} else {
								console.log(
									"Database population complete and connection closed."
								);
							}
						});
					});
				});
			}
		}
	);
}
