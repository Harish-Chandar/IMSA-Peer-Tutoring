import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";

// environment variables for API configuration
const DBPORT = process.env.REACT_APP_DBPORT || "5000";
const HOST = process.env.REACT_APP_HOST || "localhost";

// Base URL for API calls
const API_BASE_URL = `http://${HOST}:${DBPORT}`;

// default placeholder image URL from environment variable
const DEFAULT_AVATAR_URL =
	process.env.REACT_APP_DEFAULT_AVATAR_URL || "https://placehold.co/600x600";

// helper function to parse class strings
function parseClasses(classesString) {
	if (!classesString) return [];
	const spaceClasses = classesString.replace(/_/g, " ");
	return spaceClasses.split(";").map((course) => course.trim());
}

// helper function to get wing letter (1=A, 2=B, etc.)
function assignWing(wingNum) {
	return String.fromCharCode(wingNum + 64);
}

// helper function to parse schedule string from raw format into structured object
function parseSchedule(scheduleStr) {
	if (!scheduleStr) return {};

	const result = {};

	// split by semicolons to get each day entry
	const dayEntries = scheduleStr.split(";");

	dayEntries.forEach((entry) => {
		if (!entry) return;

		// split by comma - first element is the day name
		const parts = entry.split(",");
		if (parts.length < 2) return;

		const day = parts[0].toLowerCase();
		const times = parts.slice(1); // all remaining elements are time slots

		result[day] = times;
	});

	return result;
}

// helper function to capitalize first letter for display purposes
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function Tutor() {
	// extract tutor id from url path
	const urlPath = window.location.pathname;
	const id = urlPath.split("/").pop(); // gets the last segment of the URL

	// state variables for component
	const [tutor, setTutor] = useState(null);
	const [classes, setClasses] = useState({});
	const [schedule, setSchedule] = useState({});
	const [selectedDate, setSelectedDate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [debugInfo, setDebugInfo] = useState({
		urlPath: urlPath,
		extractedId: id,
	});

	// abbreviated day names for calendar header
	const daysOfWeek = [
		"Sun.",
		"Mon.",
		"Tues.",
		"Wed.",
		"Thurs.",
		"Fri.",
		"Sat.",
	];

	// full day names for schedule display
	const fullDayNames = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

	// effect to fetch tutor data when component mounts or id changes
	useEffect(() => {
		const fetchTutorData = async () => {
			try {
				// set loading state and initialize debug info
				setLoading(true);
				setDebugInfo((prev) => ({ ...prev, step: "starting fetch" }));

				// fetch basic tutor information
				const tutorResponse = await fetch(
					`${API_BASE_URL}/api/tutors/${id}`
				);
				setDebugInfo((prev) => ({
					...prev,
					tutorResponseOk: tutorResponse.ok,
				}));

				if (!tutorResponse.ok) {
					throw new Error("tutor not found");
				}

				// parse tutor data and update state
				const tutorData = await tutorResponse.json();

				// Handle both array and object responses (same as EditTutor)
				const tutor = Array.isArray(tutorData)
					? tutorData[0]
					: tutorData;

				setDebugInfo((prev) => ({
					...prev,
					tutorDataReceived: true,
					tutorKeys: Object.keys(tutor),
					hallValue: tutor.hall,
					wingValue: tutor.wing,
					imageValue: tutor.image || tutor.imgurl,
					isArray: Array.isArray(tutorData),
				}));

				// set tutor data
				setTutor(tutor);

				// fetch classes the tutor can teach
				const classesResponse = await fetch(
					`${API_BASE_URL}/api/tutors/${id}/classes`
				);
				setDebugInfo((prev) => ({
					...prev,
					classesResponseOk: classesResponse.ok,
				}));

				const classesData = await classesResponse.json();
				setDebugInfo((prev) => ({
					...prev,
					classesDataReceived: Boolean(classesData),
				}));

				setClasses(classesData[0]);

				// fetch tutor's availability schedule
				const scheduleResponse = await fetch(
					`${API_BASE_URL}/api/tutors/${id}/schedule`
				);
				setDebugInfo((prev) => ({
					...prev,
					scheduleResponseOk: scheduleResponse.ok,
				}));

				if (scheduleResponse.ok) {
					// extract and parse the schedule string
					const { availability: scheduleStr } =
						await scheduleResponse.json();
					setDebugInfo((prev) => ({
						...prev,
						scheduleStringReceived: Boolean(scheduleStr),
						rawSchedule: scheduleStr,
					}));

					// convert raw schedule string into structured format
					const parsedSchedule = parseSchedule(scheduleStr);
					setSchedule(parsedSchedule);

					setDebugInfo((prev) => ({
						...prev,
						parsedSchedule: parsedSchedule,
					}));
				}

				// update debug info with fetch completion status
				setDebugInfo((prev) => ({
					...prev,
					classesCount: classesData[0].length,
					fetchComplete: true,
				}));
			} catch (err) {
				// handle errors in fetching data
				console.error("error fetching tutor data:", err);
				setError(`failed to load tutor information: ${err.message}`);
				setDebugInfo((prev) => ({ ...prev, error: err.message }));
			} finally {
				// always complete loading state
				setLoading(false);
			}
		};

		// check if id exists before fetching
		if (id) {
			fetchTutorData();
		} else {
			setError("no tutor id provided in url");
			setLoading(false);
		}
	}, [id]);

	// generate a calendar for the current month
	const generateCalendar = () => {
		const today = new Date();
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();
		const firstDay = new Date(currentYear, currentMonth, 1);
		const lastDay = new Date(currentYear, currentMonth + 1, 0);

		const calendarDays = [];
		let day = 1;

		// create a 6-week calendar grid
		for (let i = 0; i < 6; i++) {
			const week = [];
			for (let j = 0; j < 7; j++) {
				if (
					(i === 0 && j < firstDay.getDay()) ||
					day > lastDay.getDate()
				) {
					// empty cells for days outside current month
					week.push(null);
				} else {
					// Store the actual date object instead of just the day number
					const dateObj = new Date(currentYear, currentMonth, day);
					week.push({ day, dateObj });
					day++;
				}
			}
			calendarDays.push(week);
		}
		return calendarDays;
	};

	// get current month name
	const getCurrentMonthName = () => {
		const today = new Date();
		return today.toLocaleString("default", {
			month: "long",
			year: "numeric",
		});
	};

	// get the calendar data
	const calendar = generateCalendar();

	// render loading state
	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				Loading tutor information...
			</div>
		);
	}

	// render error state
	if (error || !tutor) {
		return (
			<div className="flex flex-col justify-center items-center h-screen gap-2">
				<div className="text-red-500">{error || "tutor not found"}</div>
				<div className="text-xs text-gray-500 max-w-md overflow-auto">
					debug: {JSON.stringify(debugInfo, null, 2)}
				</div>
			</div>
		);
	}

	// prepare display information with safety checks
	const fullName = `${tutor.fname || ""} ${tutor.lname || ""}`;

	// safely handle wing with fallback - use the same logic as TutorCard
	const wingDisplay = tutor.wing ? assignWing(tutor.wing) : "";

	// construct location string safely - match TutorCard format
	const location =
		tutor.hall && tutor.wing
			? `${tutor.hall}, ${wingDisplay} wing`
			: tutor.hall
			? `${tutor.hall}`
			: "location unknown";

	// handle image with fallback - match FindTutors logic
	const profileImage = tutor.image || DEFAULT_AVATAR_URL;

	// render main component
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex flex-col md:flex-row px-4 md:px-[6rem] py-4 gap-8 items-start w-full pt-20 flex-grow">
				{/* tutor profile image section */}
				<div className="w-full md:w-2/5 flex justify-center items-center md:min-h-[600px]">
					<img
						src={profileImage}
						alt={fullName}
						className="rounded-2xl shadow-md w-[500px] h-[500px] object-cover"
					/>
				</div>

				{/* tutor information section */}
				<div className="bg-white shadow-xl p-6 w-full md:w-3/5 rounded-2xl">
					{/* tutor name, location and classes */}
					<div className="mb-6">
						<h2 className="text-3xl md:text-5xl font-semibold text-gray-800 font-sans py-5">
							{fullName}
						</h2>
						<p className="text-xl text-gray-500 font-sans mb-3">
							{location}
						</p>
						<div className="text-lg text-gray-600 font-sans">
							<span className="font-bold text-left">
								Classes taught:
							</span>
							<div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-2 text-base">
								{/* Math Core */}
								{parseClasses(classes.mathcore).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Math Courses(Core)
										</div>
										{parseClasses(classes.mathcore).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* Math Non-Core */}
								{parseClasses(classes.mathother).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Math Courses(Non-Core)
										</div>
										{parseClasses(classes.mathother).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* Physics */}
								{parseClasses(classes.physics).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Physics Courses
										</div>
										{parseClasses(classes.physics).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* Chemistry */}
								{parseClasses(classes.chem).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Chemistry Courses
										</div>
										{parseClasses(classes.chem).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* CS */}
								{parseClasses(classes.cs).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											CS Courses
										</div>
										{parseClasses(classes.cs).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* Language */}
								{parseClasses(classes.language).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Language Courses
										</div>
										{parseClasses(classes.language).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
								{/* Sci Other */}
								{parseClasses(classes.sciother).length > 0 && (
									<div>
										<div className="underline font-semibold mb-1">
											Other Science
										</div>
										{parseClasses(classes.sciother).map(
											(c, i) =>
												c && <div key={i}>{c}</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* calendar and schedule section */}
					<div className="flex flex-col lg:flex-row gap-6">
						{/* interactive calendar view */}
						<div className="flex-1">
							<h3 className="font-semibold mb-4 text-2xl text-gray-500 text-center">
								{getCurrentMonthName()}
							</h3>
							<div className="grid grid-cols-7 gap-2 text-center mb-4">
								{daysOfWeek.map((day) => (
									<div
										key={day}
										className="text-sm font-medium text-gray-600 pb-2"
									>
										{day}
									</div>
								))}
								{calendar.flat().map((dateInfo, index) =>
									dateInfo ? (
										<div
											key={index}
											className={`p-2 rounded-md cursor-pointer hover:bg-blue-100 transition ${
												selectedDate &&
												selectedDate.getTime() ===
													dateInfo.dateObj.getTime()
													? "bg-blue-500 text-white"
													: ""
											}`}
											onClick={() =>
												setSelectedDate(
													dateInfo.dateObj
												)
											}
										>
											{dateInfo.day}
										</div>
									) : (
										<div key={index} className="p-2"></div>
									)
								)}
							</div>
						</div>

						{/* selected day schedule display */}
						<div className="flex-1 text-sm text-gray-700">
							<h3 className="font-semibold mb-4 text-2xl text-gray-500">
								{selectedDate
									? `Schedule for ${selectedDate.toLocaleDateString(
											"en-US",
											{
												weekday: "long",
												month: "long",
												day: "numeric",
											}
									  )}`
									: "Select a date to view schedule"}
							</h3>
							{selectedDate ? (
								<div className="text-xl">
									{(() => {
										const dayName =
											fullDayNames[selectedDate.getDay()];

										if (
											schedule[dayName] &&
											schedule[dayName].length > 0
										) {
											return schedule[dayName].map(
												(timeSlot, index) => (
													<div
														key={index}
														className="mb-1"
													>
														{timeSlot} PM
													</div>
												)
											);
										} else {
											return "No schedule available for this day";
										}
									})()}
								</div>
							) : (
								<div className="text-xl text-gray-400">
									Click on a date above to see the tutor's
									availability for that day.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Tutor;
