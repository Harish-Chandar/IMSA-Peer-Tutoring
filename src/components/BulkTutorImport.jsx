import React, { useState } from "react";
import AlertModal from "./AlertModal.jsx";
import { classCategories } from "../util.ts";

const COURSE_ALIASES = {
	SI: "Physics: Algebra-Based Mechanics",
	"SI Physics": "Physics: Algebra-Based Mechanics",
	"Physics C: Mechanics": "Physics: Calculus-Based Mechanics",
	"Physics C: Electricity/Magnetism":
		"Physics: Calculus-Based Electricity/Magnetism",
	"Physics: Calc Based Electricity/Magnetism":
		"Physics: Calculus-Based Electricity/Magnetism",
	"Bio Physics": "Biophysics",
	"Intro to Engineering": "Engineering",
	"Introduction to Engineering": "Engineering",
	"SI Chemistry": "Chemistry",
	"Org Chem I": "Organic Chemistry I",
	"Org Chem II": "Organic Chemistry II",
	"Advanced Chemistry: Chem Reactions":
		"Advanced Chemistry - Chemical Reactions",
	"ad chem: structure and properties":
		"Advanced Chemistry - Structure and Properties",
	"Biotech in Chem": "Biotechnology Techniques in Chemistry",
	"Physical Chem of Materials": "The Physical Chemistry of Materials",
	"Bio: Evolution & Environment": "Biology: Evolution & Environment",
	"Bio: Molecular & Cellular": "Biology: Molecular & Cellular",
	"Evolution Biodiversity and Ecology":
		"Evolution, Biodiversity, and Ecology",
	"Cancer Bio": "Cancer Biology",
	"Bio of Behavior": "Biology of Behavior",
	"AB I": "AB Calculus I",
	"AB CALC I": "AB Calculus I",
	"AB II": "AB Calculus II",
	"BC I": "BC Calculus I",
	"BC CALC I": "BC Calculus I",
	"BC II": "BC Calculus II",
	"BC CALC II": "BC Calculus II",
	"BC III": "BC Calculus III",
	"BC I/II": "BC Calculus I/II",
	"BC II/III": "BC Calculus II/III",
	"BC CALC II/III": "BC Calculus II/III",
	MVC: "Multi-Variable Calculus",
	Stats: "Statistics",
	"Statistical Exploration and Description":
		"Statistics",
	"Statistical Experimentation and Inference":
		"Advanced Topics in Data Analysis",
	"Adv Programming": "Advanced Programming",
	"Web Tech": "Web Technologies",
	"Adv Web Tech": "Advanced Web Technologies",
	Ai1: "Artificial Intelligence 1",
	"AI-1": "Artificial Intelligence 1",
	"AI-2": "Artificial Intelligence 2",
	"Mandarin I": "Mandarin Chinese I",
	"Mandarin II": "Mandarin Chinese II",
	"Mandarin III": "Mandarin Chinese III",
};

const normalizeCourseName = (course) =>
	course.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const CANONICAL_COURSES_BY_NORMALIZED_NAME = Object.fromEntries(
	Object.values(classCategories)
		.flat()
		.map((course) => [normalizeCourseName(course), course])
);

const COURSE_ALIASES_BY_NORMALIZED_NAME = Object.fromEntries(
	Object.entries(COURSE_ALIASES).map(([alias, course]) => [
		normalizeCourseName(alias),
		course,
	])
);

const resolveCanonicalCourse = (course) => {
	const normalizedName = normalizeCourseName(course);
	return (
		CANONICAL_COURSES_BY_NORMALIZED_NAME[normalizedName] ||
		COURSE_ALIASES_BY_NORMALIZED_NAME[normalizedName] ||
		null
	);
};

const EXCLUDED_TUTOR_COURSES = new Set([
	normalizeCourseName("Foundations of Healthy Living"),
]);

const COURSE_TO_CATEGORY = Object.fromEntries(
	Object.entries(classCategories).flatMap(([category, courses]) =>
		courses.map((course) => [course, category])
	)
);

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
			.replace(
				/Evolution,\s*Biodiversity,?\s+and\s+Ecology/gi,
				"Evolution Biodiversity and Ecology"
			)
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

		const courseLists = Object.fromEntries(
			Object.keys(courseMap).map((category) => [category, []])
		);
		const additionalInterests = [];
		const droppedCourses = [];
		const movedCourses = [];
		const unmappedCourses = [];

		Object.entries(courseMap).forEach(([sourceCategory, csvColumn]) => {
			const coursesStr = tutorData[csvColumn];
			const coursesList = parseCoursesFromCell(coursesStr);

			coursesList.forEach((course) => {
				const normalizedCourse = resolveCanonicalCourse(course);

				if (EXCLUDED_TUTOR_COURSES.has(normalizeCourseName(course))) {
					droppedCourses.push(course);
					return;
				}

				if (!normalizedCourse) {
					additionalInterests.push(course);
					unmappedCourses.push({ course, source: csvColumn });
					return;
				}

				const targetCategory = COURSE_TO_CATEGORY[normalizedCourse];

				if (targetCategory !== sourceCategory) {
					movedCourses.push({
						course: normalizedCourse,
						from: csvColumn,
						to: courseMap[targetCategory],
					});
				}

				if (!courseLists[targetCategory].includes(normalizedCourse)) {
					courseLists[targetCategory].push(normalizedCourse);
				}
			});
		});

		const courses = Object.fromEntries(
			Object.entries(courseLists).map(([category, courseList]) => [
				category,
				formatCoursesForDatabase(courseList),
			])
		);

		return {
			courses,
			additionalInterests,
			droppedCourses,
			movedCourses,
			unmappedCourses,
		};
	};

	const appendTutoringInterestsToBlurb = (blurb, additionalInterests) => {
		if (additionalInterests.length === 0) return blurb || "";

		const uniqueInterests = [...new Set(additionalInterests)];
		const joinedInterests = uniqueInterests.join("; ");
		const ending = /[.!?]$/.test(joinedInterests) ? "" : ".";
		const interestsText = `Additional tutoring interests: ${joinedInterests}${ending}`;
		return [blurb?.trim(), interestsText].filter(Boolean).join(" ");
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
			const importEvents = {
				dropped: [],
				moved: [],
				appended: [],
				unmapped: [],
			};

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
					const {
						courses,
						additionalInterests,
						droppedCourses,
						movedCourses,
						unmappedCourses,
					} = extractCoursesFromColumns(tutorRow);
					const blurbWithInterests = appendTutoringInterestsToBlurb(
						blurb,
						additionalInterests
					);

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
						blurb: blurbWithInterests,
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
						const tutorName = `${fname} ${lname}`;
						importEvents.dropped.push(
							...droppedCourses.map((course) => `${tutorName}: ${course}`)
						);
						importEvents.moved.push(
							...movedCourses.map(
								({ course, from, to }) =>
									`${tutorName}: ${course} (${from} -> ${to})`
							)
						);
						importEvents.appended.push(
							...additionalInterests.map(
								(interest) => `${tutorName}: ${interest}`
							)
						);
						importEvents.unmapped.push(
							...unmappedCourses.map(
								({ course, source }) =>
									`${tutorName}: ${course} (${source})`
							)
						);
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

			const appendEventSection = (heading, events) => {
				if (events.length === 0) return;
				message += `\n\n${heading} (${events.length}):\n${events
					.map((event) => `- ${event}`)
					.join("\n")}`;
			};

			appendEventSection("Dropped tutor courses", importEvents.dropped);
			appendEventSection("Moved to canonical categories", importEvents.moved);
			appendEventSection(
				"Appended to tutor bios",
				importEvents.appended
			);
			appendEventSection(
				"Unmapped class values (preserved in bios)",
				importEvents.unmapped
			);

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
