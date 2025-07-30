import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./custom.css";
import Footer from "../components/Footer.jsx";
import AlertModal from "../components/AlertModal.jsx";
import { isTokenExpired, classCategories } from "../util.ts";

function EditTutor() {
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || isTokenExpired(token)) {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	// no hardcoded localhosts!!!
	const DBPORT = process.env.REACT_APP_DBPORT;
	const HOST = process.env.REACT_APP_HOST;
	const baseUrl = `http://${HOST}:${DBPORT}`;

	// state for the tutor being edited
	const [tutorData, setTutorData] = useState({
		fname: "",
		lname: "",
		fbname: "",
		imsaid: "",
		email: "",
		blurb: "",
		hall: "",
		wing: "",
		image: "",
	});

	// separate state for availability by day since it's not separated in the tutor data
	const [availability, setAvailability] = useState({
		sunday: "",
		monday: "",
		tuesday: "",
		wednesday: "",
		thursday: "",
		friday: "",
		saturday: "",
	});

	// selected classes for each category
	const [selectedClasses, setSelectedClasses] = useState({});

	// alert modal state
	const [alertModal, setAlertModal] = useState({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	// store original data for restore functionality
	const [originalData, setOriginalData] = useState({
		tutorData: {},
		availability: {},
		selectedClasses: {},
	});

	// fetch tutor data when component loads
	useEffect(() => {
		fetchTutorData();
	}, [id]);

	// fetch data for the specific tutor
	const fetchTutorData = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/tutors/${id}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();

			// handle both array and object responses
			const data = Array.isArray(responseData)
				? responseData[0]
				: responseData;

			if (!data) {
				throw new Error("No tutor data found");
			}

			// set tutor data
			setTutorData({
				fname: data.fname || "",
				lname: data.lname || "",
				fbname: data.fbname || "",
				imsaid: data.imsaid || "",
				email: data.email || "",
				blurb: data.blurb || "",
				hall: data.hall || "",
				wing: data.wing
					? { 1: "A", 2: "B", 3: "C", 4: "D" }[data.wing]
					: "",
				image: data.image || "",
			});

			// parse and set availability
			const parsedAvailability = {
				sunday: "",
				monday: "",
				tuesday: "",
				wednesday: "",
				thursday: "",
				friday: "",
				saturday: "",
			};
			if (data.availability) {
				data.availability.split(";").forEach((dayString) => {
					const parts = dayString.split(",");
					const day = parts[0].toLowerCase();
					const times = parts.slice(1).join(",");
					if (parsedAvailability.hasOwnProperty(day)) {
						parsedAvailability[day] = times;
					}
				});
			}
			setAvailability(parsedAvailability);

			// parse and set selected classes when classCategories is ready
			const parsedClasses = {};
			if (Object.keys(classCategories).length > 0) {
				Object.keys(classCategories).forEach((category) => {
					parsedClasses[category] = [];
				});

				Object.keys(classCategories).forEach((category) => {
					if (data[category] && data[category].trim()) {
						const classNames = data[category]
							.split(";")
							.map((c) => c.replace(/_/g, " "))
							.filter((name) => name.trim());
						parsedClasses[category] = classNames;
					}
				});
				setSelectedClasses(parsedClasses);
			} else {
				// if classCategories isn't ready yet, just initialize empty
				Object.keys(classCategories).forEach((category) => {
					parsedClasses[category] = [];
				});
				setSelectedClasses({});
			}

			// store original data for restore functionality
			const originalTutorData = {
				fname: data.fname || "",
				lname: data.lname || "",
				fbname: data.fbname || "",
				imsaid: data.imsaid || "",
				email: data.email || "",
				blurb: data.blurb || "",
				hall: data.hall || "",
				wing: data.wing
					? { 1: "A", 2: "B", 3: "C", 4: "D" }[data.wing]
					: "",
				image: data.image || "",
			};

			setOriginalData({
				tutorData: { ...originalTutorData },
				availability: { ...parsedAvailability },
				selectedClasses: { ...parsedClasses },
			});
		} catch (error) {
			console.error("Error fetching tutor data:", error);
			setAlertModal({
				isOpen: true,
				title: "Error",
				message: "Could not fetch tutor data. Please try again.",
				onConfirm: () =>
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					}),
			});
		}
	};

	// handle availability input changes
	const handleAvailabilityChange = (day, value) => {
		setAvailability((prev) => ({
			...prev,
			[day]: value,
		}));
	};

	// construct availability string for database
	const constructAvailabilityString = () => {
		const dayEntries = [];
		Object.entries(availability).forEach(([day, timeSlots]) => {
			if (timeSlots && timeSlots.trim()) {
				// Format the time slots during post-processing
				const formattedTimeSlots = formatTime(timeSlots);

				if (formattedTimeSlots) {
					const slots = formattedTimeSlots
						.split(",")
						.map((slot) => slot.trim())
						.filter((slot) => slot.length > 0);

					if (slots.length > 0) {
						dayEntries.push(`${day},${slots.join(",")}`);
					}
				}
			}
		});
		return dayEntries.join(";");
	};

	// handle form input changes
	const handleInputChange = (field, value) => {
		setTutorData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// handle class selection for each category
	const handleClassToggle = (category, className) => {
		setSelectedClasses((prev) => ({
			...prev,
			[category]: prev[category]?.includes(className)
				? prev[category].filter((c) => c !== className)
				: [...(prev[category] || []), className],
		}));
	};

	// convert class name to database format
	const formatClassForDatabase = (className) => {
		return className.replace(/ /g, "_").replace(/&/g, "&");
	};

	// format time - remove whitespace and any text, keep only numbers, colons, commas, and dashes
	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		return timeStr
			.replace(/[^0-9:,-]/g, "") // Remove everything except numbers, colons, commas, and dashes
			.replace(/\s+/g, "") // Remove all whitespace
			.trim();
	};

	// get display name for category headers
	const getCategoryDisplayName = (category) => {
		const categoryNames = {
			physics: "Physics",
			chem: "Chemistry",
			biology: "Biology",
			sciother: "Other Sciences",
			mathcore: "Core Math",
			mathother: "Other Math",
			cs: "Computer Science",
			language: "World Languages",
		};
		return categoryNames[category] || category;
	};

	// restore original data
	const handleRestoreData = () => {
		const confirmRestore = (confirmed) => {
			// First, close the confirmation modal
			setAlertModal({
				isOpen: false,
				title: "",
				message: "",
				onConfirm: null,
			});

			if (confirmed) {
				// Check if originalData has been properly set
				if (Object.keys(originalData.tutorData).length > 0) {
					setTutorData({ ...originalData.tutorData });
					setAvailability({ ...originalData.availability });
					setSelectedClasses({ ...originalData.selectedClasses });

					// Now, open the "Restored" confirmation modal
					setTimeout(() => {
						setAlertModal({
							isOpen: true,
							title: "Restored",
							message:
								"All fields have been restored to their original values.",
							onConfirm: () =>
								setAlertModal({
									isOpen: false,
									title: "",
									message: "",
									onConfirm: null,
								}),
						});
					}, 100); // A small delay ensures the state updates properly
				} else {
					// Fallback: re-fetch the data from server
					setTimeout(() => {
						setAlertModal({
							isOpen: true,
							title: "Refreshing Data",
							message: "Fetching original data from server...",
							onConfirm: () => {
								fetchTutorData();
								setAlertModal({
									isOpen: false,
									title: "",
									message: "",
									onConfirm: null,
								});
							},
						});
					}, 100);
				}
			}
		};

		// Open the initial confirmation modal
		setAlertModal({
			isOpen: true,
			title: "Restore Original Data",
			message:
				"Are you sure you want to restore all fields to their original values? All unsaved changes will be lost.",
			onConfirm: confirmRestore,
		});
	};

	// discard changes and go back
	const handleDiscardChanges = () => {
		setAlertModal({
			isOpen: true,
			title: "Discard Changes",
			message:
				"Are you sure you want to discard all changes and go back? All unsaved changes will be lost.",
			onConfirm: (confirmed) => {
				setAlertModal({
					isOpen: false,
					title: "",
					message: "",
					onConfirm: null,
				});

				if (confirmed) {
					window.scrollTo(0, 0);
					navigate("/addTutor");
				}
			},
		});
	};

	// handle updating the tutor
	const handleUpdateTutor = async () => {
		if (!tutorData.fname || !tutorData.lname || !tutorData.email) {
			setAlertModal({
				isOpen: true,
				title: "Missing Information",
				message:
					"Please fill in at least first name, last name, and email.",
				onConfirm: () =>
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					}),
			});
			return;
		}

		try {
			const formattedClasses = {};

			Object.keys(selectedClasses).forEach((category) => {
				if (selectedClasses[category]?.length > 0) {
					formattedClasses[category] = selectedClasses[category]
						.map(formatClassForDatabase)
						.join(";");
				} else {
					formattedClasses[category] = "";
				}
			});

			const wingMapping = { A: 1, B: 2, C: 3, D: 4 };
			const wingNumber = tutorData.wing
				? wingMapping[tutorData.wing]
				: null;

			const updatedTutorData = {
				...tutorData,
				imsaid: tutorData.imsaid ? parseInt(tutorData.imsaid) : null,
				hall: tutorData.hall ? parseInt(tutorData.hall) : null,
				wing: wingNumber,
				availability: constructAvailabilityString(),
				...formattedClasses,
			};

			const token = localStorage.getItem("token");
			const response = await fetch(`${baseUrl}/api/tutors/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTutorData),
			});

			if (response.ok) {
				// after a successful update, re-fetch the data
				fetchTutorData();

				setAlertModal({
					isOpen: true,
					title: "Success",
					message: "Tutor information updated successfully!",
					onConfirm: () => {
						setAlertModal({
							isOpen: false,
							title: "",
							message: "",
							onConfirm: null,
						});
						window.scrollTo(0, 0);
						navigate("/addTutor");
					},
				});
			} else {
				const errorData = await response.json();
				setAlertModal({
					isOpen: true,
					title: "Error",
					message: `Error updating tutor: ${errorData.error}`,
					onConfirm: () =>
						setAlertModal({
							isOpen: false,
							title: "",
							message: "",
							onConfirm: null,
						}),
				});
			}
		} catch (error) {
			console.error("Error updating tutor:", error);
			setAlertModal({
				isOpen: true,
				title: "Error",
				message: "Error updating tutor. Please try again.",
				onConfirm: () =>
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					}),
			});
		}
	};

	return (
		<div className="p-6 bg-gray-100 pt-14 min-h-screen">
			<div className="flex justify-between items-center mb-6 py-10">
				<button
					onClick={() => {
						window.scrollTo(0, 0);
						navigate("/adminDashboard");
					}}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
				>
					Back to Dashboard
				</button>

				<h1 className="text-4xl font-bold text-gray-700">Edit Tutor</h1>

				<div className="w-40"></div>
			</div>

			<div className="flex justify-center">
				<div className="max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
					{/* single card for editing tutor */}
					<div className="w-full">
						<div className="rounded-2xl shadow-md p-8 bg-white border overflow-y-auto w-full overflow-x-hidden">
							<h3 className="text-2xl font-bold text-gray-700 mb-6">
								Update {tutorData.fname} {tutorData.lname}'s
								Information
							</h3>

							<div className="space-y-6">
								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										First Name
									</label>
									<input
										type="text"
										placeholder="Enter first name..."
										value={tutorData.fname}
										onChange={(e) =>
											handleInputChange(
												"fname",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Last Name
									</label>
									<input
										type="text"
										placeholder="Enter last name..."
										value={tutorData.lname}
										onChange={(e) =>
											handleInputChange(
												"lname",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Facebook Name (optional)
									</label>
									<input
										type="text"
										placeholder="Enter facebook name..."
										value={tutorData.fbname}
										onChange={(e) =>
											handleInputChange(
												"fbname",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Email
									</label>
									<input
										type="email"
										placeholder="Enter email..."
										value={tutorData.email}
										onChange={(e) =>
											handleInputChange(
												"email",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										IMSA ID
									</label>
									<input
										type="number"
										placeholder="Enter IMSA ID..."
										value={tutorData.imsaid}
										onChange={(e) =>
											handleInputChange(
												"imsaid",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Hall
									</label>
									<select
										value={tutorData.hall}
										onChange={(e) =>
											handleInputChange(
												"hall",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									>
										<option value="">Select a hall</option>
										<option value="1501">1501</option>
										<option value="1502">1502</option>
										<option value="1503">1503</option>
										<option value="1504">1504</option>
										<option value="1505">1505</option>
										<option value="1506">1506</option>
										<option value="1507">1507</option>
									</select>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Wing
									</label>
									<select
										value={tutorData.wing}
										onChange={(e) =>
											handleInputChange(
												"wing",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									>
										<option value="">Select a wing</option>
										<option value="A">A</option>
										<option value="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
									</select>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2 text-center">
										Blurb (max 400 characters)
									</label>
									<textarea
										placeholder="Enter tutor description..."
										value={tutorData.blurb}
										onChange={(e) => {
											if (e.target.value.length <= 400) {
												handleInputChange(
													"blurb",
													e.target.value
												);
											}
										}}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
									<div className="text-sm text-gray-600 mt-1 text-center">
										<span
											className={
												tutorData.blurb.length > 400
													? "text-red-500"
													: ""
											}
										>
											{tutorData.blurb.length}/400
											characters
										</span>
									</div>
								</div>

								{/* availability fields for each day */}
								<div className="space-y-4">
									<label className="text-gray-700 font-bold mb-2 text-center block">
										Availability (enter time slots separated
										by commas)
									</label>
									<p className="text-xs text-gray-500 mb-3 text-center">
										Example: "5:30-6:00, 7:00-7:30 PM"
									</p>

									{Object.entries(availability).map(
										([day, timeSlots]) => (
											<div
												key={day}
												className="flex flex-col"
											>
												<label className="text-gray-700 font-bold mb-2 capitalize text-center">
													{day}
												</label>
												<input
													type="text"
													placeholder="e.g., 5:30-6:00, 6:00-6:30 PM"
													value={timeSlots}
													onChange={(e) =>
														handleAvailabilityChange(
															day,
															e.target.value
														)
													}
													className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
												/>
											</div>
										)
									)}
								</div>

								{/* class selection sections */}
								{Object.keys(classCategories).length === 0 ? (
									<div className="space-y-4">
										<p className="text-red-500 text-center">
											Error loading classes. Please
											refresh the page.
										</p>
									</div>
								) : (
									<div className="space-y-6">
										<label className="text-gray-700 font-bold mb-2 text-center block">
											Class Selection
										</label>
										{Object.entries(classCategories).map(
											([category, classes]) => (
												<div
													key={category}
													className="space-y-2"
												>
													<label className="text-gray-700 font-bold text-center block">
														{getCategoryDisplayName(
															category
														)}
													</label>
													<div className="border rounded-md p-4 max-h-32 overflow-y-auto bg-gray-50">
														{classes.map(
															(className) => (
																<label
																	key={
																		className
																	}
																	className="flex items-center mb-2 cursor-pointer"
																>
																	<input
																		type="checkbox"
																		checked={
																			selectedClasses[
																				category
																			]?.includes(
																				className
																			) ||
																			false
																		}
																		onChange={() =>
																			handleClassToggle(
																				category,
																				className
																			)
																		}
																		className="mr-3"
																	/>
																	<span className="text-sm text-gray-700">
																		{
																			className
																		}
																	</span>
																</label>
															)
														)}
													</div>
													{selectedClasses[category]
														?.length > 0 && (
														<p className="text-xs text-blue-600 mt-2 text-center">
															Selected:{" "}
															{selectedClasses[
																category
															].join(", ")}
														</p>
													)}
												</div>
											)
										)}
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-4 mt-6">
									<button
										onClick={handleUpdateTutor}
										disabled={
											Object.keys(classCategories)
												.length === 0
										}
										className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold flex-1 transition-all duration-200"
									>
										Update Information
									</button>

									<button
										onClick={handleRestoreData}
										disabled={
											Object.keys(classCategories)
												.length === 0
										}
										className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold flex-1 transition-all duration-200"
									>
										Restore Original
									</button>

									<button
										onClick={handleDiscardChanges}
										className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold flex-1 transition-all duration-200"
									>
										Discard & Back
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<AlertModal
				isOpen={alertModal.isOpen}
				title={alertModal.title}
				message={alertModal.message}
				onConfirm={alertModal.onConfirm}
			/>
		</div>
	);
}

export default EditTutor;
