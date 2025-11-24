import React, { useState } from "react";
import AlertModal from "./AlertModal.jsx";

const COURSE_ABBREVIATIONS = {
	SI: "SI Physics",
	"Physics: Sound and Light": "Physics: Sound and Light",
	"Physics C: Mechanics": "Physics C: Mechanics",
	"Physics C: Electricity/Magnetism": "Physics C: Electricity/Magnetism",
	"Computational Science": "Computational Science",
	"SI Chemistry": "SI Chemistry",
	"Organic Chemistry I": "Organic Chemistry I",
	"Organic Chemistry II": "Organic Chemistry II",
	"Advanced Chemistry - Structure and Properties":
		"Advanced Chemistry - Structure and Properties",
	"Advanced Chemistry - Chemical Reactions":
		"Advanced Chemistry - Chemical Reactions",
	"Biotechnology Techniques in Chemistry":
		"Biotechnology Techniques in Chemistry",
	"Biology: Evolution & Environment": "Biology: Evolution & Environment",
	"Biology: Molecular & Cellular": "Biology: Molecular & Cellular",
	"Cancer Biology": "Cancer Biology",
	Biophysics: "Biophysics",
	Pathophysiology: "Pathophysiology",
	MSI: "MSI",
	"Introduction to Engineering": "Introduction to Engineering",
	Electronics: "Electronics",
	Geometry: "Geometry",
	"MI I/II": "MI I/II",
	"MI II": "MI II",
	"MI III": "MI III",
	"MI IV": "MI IV",
	"AB I": "AB I",
	"AB II": "AB II",
	"BC I": "BC I",
	"BC II": "BC II",
	"BC III": "BC III",
	"BC I/II": "BC I/II",
	"BC II/III": "BC II/III",
	"Introduction to Proofs": "Introduction to Proofs",
	"Multi-Variable Calculus": "Multi-Variable Calculus",
	"Differential Equations": "Differential Equations",
	"Linear Algebra": "Linear Algebra",
	"Number Theory": "Number Theory",
	"Discrete Mathematics": "Discrete Mathematics",
	"Statistical Exploration and Description":
		"Statistical Exploration and Description",
	"Statistical Experimentation and Inference":
		"Statistical Experimentation and Inference",
	CSI: "CSI",
	OOP: "OOP",
	"Web Technologies": "Web Technologies",
	"Advanced Programming": "Advanced Programming",
	"Microcontroller Applications (CS)": "Microcontroller Applications (CS)",
	"Artificial Intelligence 1": "Artificial Intelligence 1",
	"Artificial Intelligence 2": "Artificial Intelligence 2",
	"Advanced Web Technologies": "Advanced Web Technologies",
	"CS Seminar: Android Apps Development":
		"CS Seminar: Android Apps Development",
	"CS Seminar: Linux and Cybersecurity":
		"CS Seminar: Linux and Cybersecurity",
	"Elements of Computing Systems 1": "Elements of Computing Systems 1",
	"Spanish II": "Spanish II",
	"Spanish III": "Spanish III",
	"Spanish IV": "Spanish IV",
	"Spanish V": "Spanish V",
	"French I": "French I",
	"French II": "French II",
	"French III": "French III",
	"French IV": "French IV",
	"Mandarin Chinese I": "Mandarin Chinese I",
	"Mandarin Chinese II": "Mandarin Chinese II",
	"Mandarin Chinese III": "Mandarin Chinese III",
	"German I": "German I",
	"German II": "German II",
	"German III": "German III",
};

function BulkTutorImport({ onImportComplete, baseUrl, token }) {
	const [isLoading, setIsLoading] = useState(false);
	const [alertModal, setAlertModal] = useState({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	const parseCSV = (csv) => {
		// Proper CSV parser that handles quoted fields
		const lines = csv.split("\n").filter((line) => line.trim().length > 0);

		if (lines.length < 2) {
			throw new Error(
				"CSV file must have at least a header row and one data row"
			);
		}

		const parseCSVLine = (line) => {
			const result = [];
			let current = "";
			let insideQuotes = false;

			for (let i = 0; i < line.length; i++) {
				const char = line[i];

				if (char === '"') {
					if (insideQuotes && line[i + 1] === '"') {
						// Handle escaped quotes
						current += '"';
						i++; // Skip next quote
					} else {
						insideQuotes = !insideQuotes;
					}
				} else if (char === "," && !insideQuotes) {
					result.push(current.trim());
					current = "";
				} else {
					current += char;
				}
			}

			result.push(current.trim());
			return result;
		};

		const headers = parseCSVLine(lines[0]);
		const data = [];

		for (let i = 1; i < lines.length; i++) {
			const values = parseCSVLine(lines[i]);
			const row = {};

			headers.forEach((header, index) => {
				// Remove surrounding quotes if present
				let value = values[index] || "";
				if (value.startsWith('"') && value.endsWith('"')) {
					value = value.slice(1, -1);
				}
				row[header] = value;
			});

			data.push(row);
		}

		return data;
	};

	const parseCoursesFromCell = (cellValue) => {
		if (!cellValue || cellValue.trim() === "") return [];

		return cellValue
			.split(",")
			.map((course) => course.trim())
			.filter((course) => course.length > 0);
	};

	const parseWingLetter = (wingNumber) => {
		// If it's already a letter (A, B, C, D), return it as is
		if (/^[ABCD]$/.test(wingNumber?.trim())) {
			return wingNumber.trim();
		}

		// If it's a number, convert to letter
		const wingMap = { 1: "A", 2: "B", 3: "C", 4: "D" };
		return wingMap[parseInt(wingNumber)] || "";
	};

	const parseAvailability = (dayAvailability) => {
		if (!dayAvailability || dayAvailability.trim() === "") return "";

		return dayAvailability
			.replace(/[^0-9:,-]/g, "")
			.replace(/\s+/g, "")
			.trim();
	};

	const formatCoursesForDatabase = (courses) => {
		return courses
			.map((course) => course.replace(/ /g, "_").replace(/&/g, "&"))
			.join(";");
	};

	const constructAvailabilityString = (tutorData) => {
		const dayMapping = {
			"Sunday availability:": "sunday",
			"Monday availability:": "monday",
			"Tuesday availability:": "tuesday",
			"Wednesday availability:": "wednesday",
			"Thursday availability:": "thursday",
			"Friday availability:": "friday",
			"Saturday availability:": "saturday",
		};

		const dayEntries = [];

		Object.entries(dayMapping).forEach(([csvHeader, dayName]) => {
			const timeSlots = tutorData[csvHeader];
			if (timeSlots && timeSlots.trim()) {
				const formattedTime = parseAvailability(timeSlots);
				if (formattedTime) {
					dayEntries.push(`${dayName},${formattedTime}`);
				}
			}
		});

		return dayEntries.join(";");
	};

	const extractCoursesFromColumns = (tutorData) => {
		const courseMap = {
			physics: "Physics Courses",
			chem: "Chemistry Courses",
			biology: "Biology Courses",
			sciother: "Other Science Courses",
			mathcore: "Core Math Courses",
			mathother: "Non-Core Math Courses",
			cs: "Computer Science Courses",
			language: "World Language Courses",
		};

		const courses = {};

		Object.entries(courseMap).forEach(([category, csvColumn]) => {
			const coursesStr = tutorData[csvColumn];
			const coursesList = parseCoursesFromCell(coursesStr);
			courses[category] = formatCoursesForDatabase(coursesList);
		});

		return courses;
	};

	const uploadImageToCloudinary = async (imageUrl, tutorName) => {
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

			// Send image URL to backend API to upload to Cloudinary
			const response = await fetch(`${baseUrl}/api/upload-image-url`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					imageUrl: imageUrl,
					tutorName: tutorName,
				}),
			});

			if (!response.ok) {
				// Fallback: submit image URL as-is
				const errorData = await response.json();
				console.warn(
					`Failed to upload image for ${tutorName}: ${
						errorData.error || "Unknown error"
					}, using original URL`
				);
				return imageUrl;
			}

			const data = await response.json();
			console.log(
				`Successfully uploaded to Cloudinary: ${data.secure_url}`
			);
			return data.secure_url;
		} catch (error) {
			console.error(`Failed to upload image for ${tutorName}:`, error);
			// Return original URL as fallback
			return imageUrl;
		}
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		setIsLoading(true);

		try {
			const fileContent = await file.text();
			const tutorsData = parseCSV(fileContent);

			let successCount = 0;
			let skippedCount = 0;
			let errorCount = 0;
			const errors = [];

			for (const tutorRow of tutorsData) {
				try {
					const fname = tutorRow["First Name"]?.trim();
					const lname = tutorRow["Last Name"]?.trim();
					const email =
						tutorRow["IMSA Email (name1@imsa.edu)"]?.trim();
					const imsaid = tutorRow["IMSA ID (12xxxx)"]?.trim();
					const hall = tutorRow["Hall"]?.trim();
					const wing = tutorRow["Wing"]?.trim();
					const blurb =
						tutorRow[
							"Short Blurb about yourself (400 characters max)"
						]?.trim();
					let imageUrl =
						tutorRow[
							"Upload an image of yourself. Ideally, this is the same image as your Facebook profile photo so that students can easily contact you."
						]?.trim();
					const fbname =
						tutorRow[
							"Facebook Name (First and Last name exactly how it appears on facebook)"
						]?.trim();

					// Validate required fields
					if (
						!fname ||
						!lname ||
						!email ||
						!imsaid ||
						!hall ||
						!wing
					) {
						errorCount++;
						errors.push(
							`Row with ${fname} ${lname}: Missing required fields`
						);
						continue;
					}

					// Parse wing letter
					const wingLetter = parseWingLetter(wing);
					if (!wingLetter) {
						errorCount++;
						errors.push(
							`${fname} ${lname}: Invalid wing number "${wing}"`
						);
						continue;
					}

					// Check if tutor already exists by email
					const checkResponse = await fetch(
						`${baseUrl}/api/tutors/check-email/${encodeURIComponent(
							email
						)}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (checkResponse.ok) {
						const existingTutor = await checkResponse.json();
						if (existingTutor.exists) {
							skippedCount++;
							continue;
						}
					}

					// Upload image to Cloudinary if provided
					if (imageUrl) {
						imageUrl = await uploadImageToCloudinary(
							imageUrl,
							`${fname}_${lname}`
						);
					}

					// Extract and format courses
					const courses = extractCoursesFromColumns(tutorRow);

					// Construct availability string
					const availability = constructAvailabilityString(tutorRow);

					// Prepare tutor data for submission
					const tutorData = {
						fname,
						lname,
						fbname: fbname || "",
						email,
						imsaid: parseInt(imsaid),
						hall: parseInt(hall),
						wing: wingLetter.charCodeAt(0) - 64, // Convert A-D to 1-4 (A=65, so 65-64=1)
						blurb: blurb || "",
						image: imageUrl || "",
						availability,
						is_available: 1,
						starttime: null,
						totaltime: 0,
						...courses,
					};

					// Submit to API
					const response = await fetch(`${baseUrl}/api/tutors`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(tutorData),
					});

					if (response.ok) {
						successCount++;
					} else {
						const errorData = await response.json();
						errorCount++;
						errors.push(
							`${fname} ${lname}: ${
								errorData.error || "Unknown error"
							}`
						);
					}
				} catch (error) {
					errorCount++;
					errors.push(`Error processing tutor: ${error.message}`);
				}
			}

			// Show summary
			let message = `Import completed!\n\nSuccessfully added: ${successCount}\nSkipped (already exist): ${skippedCount}\nErrors: ${errorCount}`;

			if (errors.length > 0 && errorCount > 0) {
				message += `\n\nFirst few errors:\n${errors
					.slice(0, 5)
					.join("\n")}`;
				if (errors.length > 5) {
					message += `\n... and ${errors.length - 5} more`;
				}
			}

			setAlertModal({
				isOpen: true,
				title: "Import Summary",
				message,
				onConfirm: () => {
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					});
					if (successCount > 0) {
						onImportComplete();
					}
				},
			});
		} catch (error) {
			console.error("Error importing CSV:", error);
			setAlertModal({
				isOpen: true,
				title: "Error",
				message: `Error importing CSV: ${error.message}`,
				onConfirm: () =>
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					}),
			});
		} finally {
			setIsLoading(false);
			event.target.value = "";
		}
	};

	return (
		<>
			<div className="flex flex-col items-center gap-3">
				<label className="w-full">
					<input
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
						disabled={isLoading}
						className="hidden"
					/>
					<button
						className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
						disabled={isLoading}
						onClick={(e) => {
							e.preventDefault();
							e.currentTarget.parentElement
								.querySelector('input[type="file"]')
								.click();
						}}
					>
						{isLoading ? "Importing..." : "Upload CSV File"}
					</button>
				</label>
				<p className="text-sm text-gray-600 text-center">
					Upload a CSV file with tutors data. Existing tutors (by
					email) will be skipped.
				</p>
			</div>

			<AlertModal
				isOpen={alertModal.isOpen}
				title={alertModal.title}
				message={alertModal.message}
				onConfirm={alertModal.onConfirm}
			/>
		</>
	);
}

export default BulkTutorImport;
