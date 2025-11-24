import React, { useState, useEffect } from "react";
import "./custom.css";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal.jsx";
import MassTutorImport from "../components/MassTutorImport.jsx";

import { isTokenExpired, classCategories, getTokenAccess } from "../util.ts";
const token = localStorage.getItem("token");

import UploadWidget from "../components/UploadWidget.js";

function AddTutor() {
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || isTokenExpired(token)) {
			navigate("/login", { replace: true });
		}
		if (
			token &&
			!isTokenExpired(token) &&
			(getTokenAccess(token) < 1 ||
				getTokenAccess(token) > 3 ||
				getTokenAccess(token) === 2)
		) {
			navigate("/adminDashboard");
		}
	}, []);
	// environment variables for API configuration
	const DBPORT = process.env.REACT_APP_DBPORT;
	const HOST = process.env.REACT_APP_HOST;
	const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';
	const protocol = DEV_SERVER ? 'http' : 'https';
	const baseUrl = `${protocol}://${HOST}:${DBPORT}`;

	const isLoadingClasses = Object.keys(classCategories).length === 0; //TODO: I did this to fix a post-merge bug, probably not the right way to do it, whoever needs this review it later

	// form state for new tutor
	const [newTutor, setNewTutor] = useState({
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

	// separate state for availability by day
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
    
    // state for searching and deleting tutors
	const [deleteSearchQuery, setDeleteSearchQuery] = useState("");
	const [tutors, setTutors] = useState([]);
	const [filteredTutors, setFilteredTutors] = useState([]);

	// alert modal state
	const [alertModal, setAlertModal] = useState({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	// fetch tutors when component loads
	useEffect(() => {
		fetchTutors();
	}, []);

	// initialize selectedClasses when component loads
	useEffect(() => {
		const initialSelectedClasses = {};
		Object.keys(classCategories).forEach((department) => {
			initialSelectedClasses[department] = [];
		});
		setSelectedClasses(initialSelectedClasses);
	}, []);

	// filter tutors when search query or tutors array changes
	useEffect(() => {
		if (tutors.length > 0) {
			const filtered = tutors.filter((tutor) => {
				const fullName = `${tutor.fname} ${tutor.lname}`.toLowerCase();
				return fullName.includes(deleteSearchQuery.toLowerCase());
			});
			setFilteredTutors(filtered);
		} else {
			// Clear filtered tutors when tutors array is empty
			setFilteredTutors([]);
		}
	}, [deleteSearchQuery, tutors]);

	// fetch all tutors from api
	const fetchTutors = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/tutors/search`);
			const data = await response.json();
			setTutors(data);
		} catch (error) {
			console.error("error fetching tutors:", error);
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
		setNewTutor((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// handle class selection for each category
	const handleClassToggle = (category, className) => {
		setSelectedClasses((prev) => ({
			...prev,
			[category]: prev[category].includes(className)
				? prev[category].filter((c) => c !== className)
				: [...prev[category], className],
		}));
	};

	// convert class name to database format (spaces to underscores, etc.)
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

	// handle creating a new tutor
	const handleCreateTutor = async () => {
		// Check for required fields
		if (
			!newTutor.fname ||
			!newTutor.lname ||
			!newTutor.email ||
			!newTutor.imsaid ||
			!newTutor.hall ||
			!newTutor.wing
		) {
			setAlertModal({
				isOpen: true,
				title: "Missing Information",
				message:
					"Please fill in all required fields: First Name, Last Name, Email, IMSA ID, Hall, and Wing.",
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

		// Validate IMSA ID is numeric
		const imsaId = parseInt(newTutor.imsaid);
		if (isNaN(imsaId) || imsaId.toString() !== newTutor.imsaid.toString()) {
			setAlertModal({
				isOpen: true,
				title: "Invalid IMSA ID",
				message:
					"IMSA ID must be a valid number with no letters or special characters.",
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

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newTutor.email)) {
			setAlertModal({
				isOpen: true,
				title: "Invalid Email Format",
				message:
					"Please enter a valid email address (e.g., student@imsa.edu).",
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

		// Validate hall number range
		const hallNumber = parseInt(newTutor.hall);
		if (hallNumber < 1501 || hallNumber > 1507) {
			setAlertModal({
				isOpen: true,
				title: "Invalid Hall Number",
				message: "Hall number must be between 1501 and 1507.",
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

		// Validate availability times contain only valid time formats
		const timeValidationErrors = [];
		Object.entries(availability).forEach(([day, timeSlots]) => {
			if (timeSlots && timeSlots.trim()) {
				const formattedTime = formatTime(timeSlots);
				if (formattedTime !== timeSlots.replace(/\s+/g, "")) {
					timeValidationErrors.push(
						`${
							day.charAt(0).toUpperCase() + day.slice(1)
						} contains invalid characters. Use only numbers, colons, commas, and dashes.`
					);
				}
			}
		});

		if (timeValidationErrors.length > 0) {
			setAlertModal({
				isOpen: true,
				title: "Invalid Schedule Format",
				message: `Please fix the following schedule errors:\n\n${timeValidationErrors.join(
					"\n"
				)}\n\nUse format: "5:30-6:00, 6:00-6:30"`,
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
			// format selected classes for database
			const formattedClasses = {};
			Object.keys(selectedClasses).forEach((category) => {
				if (selectedClasses[category].length > 0) {
					formattedClasses[category] = selectedClasses[category]
						.map(formatClassForDatabase)
						.join(";");
				} else {
					formattedClasses[category] = "";
				}
			});

			const wingMapping = { A: 1, B: 2, C: 3, D: 4 };
			const wingNumber = newTutor.wing
				? wingMapping[newTutor.wing]
				: null;

			const tutorData = {
				...newTutor,
				imsaid: newTutor.imsaid ? parseInt(newTutor.imsaid) : null,
				hall: newTutor.hall ? parseInt(newTutor.hall) : null,
				wing: wingNumber,
				availability: constructAvailabilityString(),
				is_available: 0, // Set availability to 0 (false) for new tutors
				starttime: null, // Initialize starttime to null
				totaltime: 0, // Initialize totaltime to 0
				...formattedClasses,
			};

			const response = await fetch(`${baseUrl}/api/tutors`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(tutorData),
			});

			if (response.ok) {
				// refresh tutors list
				fetchTutors();

				// clear form
				setNewTutor({
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

				// reset availability
				setAvailability({
					sunday: "",
					monday: "",
					tuesday: "",
					wednesday: "",
					thursday: "",
					friday: "",
					saturday: "",
				});

				// reset selected classes
				const resetSelectedClasses = {};
				Object.keys(classCategories).forEach((department) => {
					resetSelectedClasses[department] = [];
				});
				setSelectedClasses(resetSelectedClasses);

				setAlertModal({
					isOpen: true,
					title: "Success",
					message: "Tutor added successfully!",
					onConfirm: () =>
						setAlertModal({
							isOpen: false,
							title: "",
							message: "",
							onConfirm: null,
						}),
				});
			} else {
				const errorData = await response.json();
				setAlertModal({
					isOpen: true,
					title: "Error",
					message: `Error creating tutor: ${errorData.error}`,
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
			console.error("error creating tutor:", error);
			setAlertModal({
				isOpen: true,
				title: "Error",
				message: "Unexpected error creating tutor. Please try again.",
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

	// handle deleting tutor with confirmation popup
	const handleDeleteTutor = async (tutorId) => {
		const tutorToDelete = tutors.find((tutor) => tutor.id === tutorId);

		setAlertModal({
			isOpen: true,
			title: "Confirm Delete",
			message: `Are you sure you want to delete the tutor "${tutorToDelete.fname} ${tutorToDelete.lname}"? This action cannot be undone. Make sure all tutor hours are saved on Helper Helper, otherwise they will be lost.`,
			onConfirm: async (confirmed) => {
				setAlertModal({
					isOpen: false,
					title: "",
					message: "",
					onConfirm: null,
				});

				if (confirmed) {
					try {
						const response = await fetch(
							`${baseUrl}/api/tutors/${tutorId}`,
							{
								method: "DELETE",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${token}`,
								},
							}
						);

						if (response.ok) {
							// refresh tutors from database after successful deletion
							fetchTutors();
							setAlertModal({
								isOpen: true,
								title: "Success",
								message: "Tutor deleted successfully!",
								onConfirm: () =>
									setAlertModal({
										isOpen: false,
										title: "",
										message: "",
										onConfirm: null,
									}),
							});
						} else {
							const errorData = await response.json();
							setAlertModal({
								isOpen: true,
								title: "Error",
								message: `Error deleting tutor: ${errorData.error}`,
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
						console.error("error deleting tutor:", error);
						setAlertModal({
							isOpen: true,
							title: "Error",
							message: "Error deleting tutor. Please try again.",
							onConfirm: () =>
								setAlertModal({
									isOpen: false,
									title: "",
									message: "",
									onConfirm: null,
								}),
						});
					}
				}
			},
		});
	};


    // handle deleting tutor with confirmation popup
	const handleTutorHours = async (tutorId) => {
		const tutorToUpdate = tutors.find((tutor) => tutor.id === tutorId);

		setAlertModal({
			isOpen: true,
			title: "Confirm Accepted Hours",
			message: `Are you sure you want to update the accepted hours for the tutor "${tutorToUpdate.fname} ${tutorToUpdate.lname}"? This will reset their hour counter to 0, so ensure that the hours are correctly inputted to HelperHelper.`,
			onConfirm: async (confirmed) => {
				setAlertModal({
					isOpen: false,
					title: "",
					message: "",
					onConfirm: null,
				});

				if (confirmed) {
					try {
						const response = await fetch(
							`${baseUrl}/api/tutors/${tutorId}/accept-hours`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${token}`,
								},
							}
						);

						if (response.ok) {
							// refresh tutors from database after successful deletion
							fetchTutors();
							setAlertModal({
								isOpen: true,
								title: "Success",
								message: "Tutor hours updated successfully!",
								onConfirm: () =>
									setAlertModal({
										isOpen: false,
										title: "",
										message: "",
										onConfirm: null,
									}),
							});
						} else {
							const errorData = await response.json();
							setAlertModal({
								isOpen: true,
								title: "Error",
								message: `Error updating tutor hours: ${errorData.error}`,
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
						console.error("error updating tutor hours:", error);
						setAlertModal({
							isOpen: true,
							title: "Error",
							message: "Error updating tutor hours. Please try again.",
							onConfirm: () =>
								setAlertModal({
									isOpen: false,
									title: "",
									message: "",
									onConfirm: null,
								}),
						});
					}
				}
			},
		});
	};





	const handleDeleteAllTutors = async () => {
		try {
			const checkResponse = await fetch(
				`${baseUrl}/api/tutors/check-outstanding-hours`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const checkData = await checkResponse.json();

			if (checkData.hasOutstandingHours) {
				const tutorList = checkData.tutorsWithOutstandingHours
					.map(
						(t) =>
							`${t.fname} ${t.lname}: ${t.totaltime - t.approvedtime} hours`
					)
					.join("\n");

				setAlertModal({
					isOpen: true,
					title: "Outstanding Hours Detected",
					message: `The following tutors have outstanding hours that haven't been approved:\n\n${tutorList}\n\nPlease approve or reset their hours before deleting all tutors.`,
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

			setAlertModal({
				isOpen: true,
				title: "Confirm Delete All Tutors",
				message: `Are you sure you want to delete all tutors? This action will delete ${tutors.length} tutor(s) and cannot be undone. Make sure all tutor hours are saved on Helper Helper, otherwise they will be lost!`,
				showCancel: true,
				onConfirm: async (confirmed) => {
					setAlertModal({
						isOpen: false,
						title: "",
						message: "",
						onConfirm: null,
					});

					if (confirmed) {
						try {
							const response = await fetch(
								`${baseUrl}/api/tutors/delete-all`,
								{
									method: "DELETE",
									headers: {
										"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,
									},
								}
							);

							if (response.ok) {
								const data = await response.json();
								setDeleteSearchQuery("");
								fetchTutors();
								setAlertModal({
									isOpen: true,
									title: "Success",
									message: `Successfully deleted ${data.deletedCount} tutor(s)!`,
									onConfirm: () =>
										setAlertModal({
											isOpen: false,
											title: "",
											message: "",
											onConfirm: null,
										}),
								});
							} else {
								const errorData = await response.json();
								setAlertModal({
									isOpen: true,
									title: "Error",
									message: `Error deleting tutors: ${errorData.error}`,
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
							console.error("error deleting all tutors:", error);
							setAlertModal({
								isOpen: true,
								title: "Error",
								message:
									"Error deleting tutors. Please try again.",
								onConfirm: () =>
									setAlertModal({
										isOpen: false,
										title: "",
										message: "",
										onConfirm: null,
									}),
							});
						}
					}
				},
			});
		} catch (error) {
			console.error("error checking outstanding hours:", error);
			setAlertModal({
				isOpen: true,
				title: "Error",
				message: "Error checking tutor hours. Please try again.",
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

				<h1 className="text-4xl font-bold text-gray-700">
					Manage Tutors
				</h1>

				<div className="w-40"></div>
			</div>

			<div className="flex justify-center">
				<div className="max-w-2xl md:max-w-4xl lg:max-w-6xl w-full">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
						{/* Left card - Add tutor form and bulk import */}
						<div className="rounded-2xl shadow-md p-8 bg-white border">
							<div className="space-y-6">
								{/* Bulk Import Section */}
								<div className="border-b pb-6 mb-6">
									<h3 className="text-2xl font-bold text-gray-700 mb-4">
										Mass Import Tutors
									</h3>
									<MassTutorImport
										onImportComplete={fetchTutors}
										baseUrl={baseUrl}
										token={token}
									/>
								</div>

								{/* Individual Add Tutor Section */}
								<h3 className="text-2xl font-bold text-gray-700 mb-6">
									Add New Tutor
								</h3>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										First Name *
									</label>
									<input
										type="text"
										placeholder="Enter first name..."
										value={newTutor.fname}
										onChange={(e) =>
											handleInputChange(
												"fname",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										required
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Last Name *
									</label>
									<input
										type="text"
										placeholder="Enter last name..."
										value={newTutor.lname}
										onChange={(e) =>
											handleInputChange(
												"lname",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										required
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Facebook Name
									</label>
									<input
										type="text"
										placeholder="Enter facebook name..."
										value={newTutor.fbname}
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
									<label className="text-gray-700 font-bold mb-2">
										Email *
									</label>
									<input
										type="email"
										placeholder="Enter email (e.g., student@imsa.edu)..."
										value={newTutor.email}
										onChange={(e) =>
											handleInputChange(
												"email",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										required
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										IMSA ID *
									</label>
									<input
										type="text"
										placeholder="Enter IMSA ID (numbers only)..."
										value={newTutor.imsaid}
										onChange={(e) => {
											// Only allow numeric input
											const value =
												e.target.value.replace(
													/[^0-9]/g,
													""
												);
											handleInputChange("imsaid", value);
										}}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										required
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Hall *
									</label>
									<input
										type="number"
										placeholder="Enter hall number..."
										value={newTutor.hall}
										min={1501}
										max={1507}
										onChange={(e) =>
											handleInputChange(
												"hall",
												e.target.value
											)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Wing *
									</label>
									<select
										value={newTutor.wing}
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
									<label className="text-gray-700 font-bold mb-2">
										Blurb (max 400 characters)
									</label>
									<textarea
										placeholder="Enter tutor description..."
										value={newTutor.blurb}
										onChange={(e) => {
											if (e.target.value.length <= 400) {
												handleInputChange(
													"blurb",
													e.target.value
												);
											}
										}}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										rows="4"
									/>
									<div className="text-sm text-gray-600 mt-1">
										<span
											className={
												newTutor.blurb.length > 400
													? "text-red-500"
													: ""
											}
										>
											{newTutor.blurb.length}/400
											characters
										</span>
									</div>
								</div>

								<UploadWidget
									setImageUrl={(url) =>
										handleInputChange("image", url)
									}
								/>

								{/* Availability Section */}
								<div className="border-t pt-6 mt-6">
									<h3 className="text-xl font-bold mb-4 text-gray-700">
										Availability
									</h3>
									<p className="text-sm text-gray-600 mb-4">
										Enter time slots separated by commas
										(e.g., "5:30-6:00, 6:00-6:30,
										7:00-7:30").
									</p>

									{Object.entries(availability).map(
										([day, timeSlots]) => (
											<div
												key={day}
												className="flex flex-col mb-4"
											>
												<label className="text-gray-700 font-bold mb-2 capitalize">
													{day}
												</label>
												<input
													type="text"
													placeholder="e.g., 5:30-6:00, 6:00-6:30"
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

								{/* Class Selection Section */}
								<div className="border-t pt-6 mt-6">
									<h3 className="text-xl font-bold mb-4 text-gray-700">
										Class Selection *
									</h3>

									{Object.keys(classCategories).length ===
									0 ? (
										<div className="text-red-500">
											Error loading classes. Please
											refresh the page.
										</div>
									) : (
										Object.entries(classCategories).map(
											([category, classes]) => (
												<div
													key={category}
													className="mb-6 p-4 border rounded-lg bg-gray-50"
												>
													<h4 className="font-bold text-gray-700 mb-3">
														{getCategoryDisplayName(
															category
														)}
													</h4>
													<div className="max-h-32 overflow-y-auto">
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
																		className="mr-2"
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
														<p className="text-xs text-blue-600 mt-2">
															Selected:{" "}
															{selectedClasses[
																category
															].join(", ")}
														</p>
													)}
												</div>
											)
										)
									)}
								</div>

								<button
									onClick={handleCreateTutor}
									disabled={
										Object.keys(classCategories).length ===
										0
									}
									className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
								>
									Add Tutor
								</button>
							</div>
						</div>

						{/* Right card - Delete tutor section */}
						<div className="rounded-2xl shadow-md p-8 bg-white border flex flex-col">
							<div className="flex flex-col h-full">
								<h3 className="text-2xl font-bold text-gray-700 mb-6">
									Delete Tutor
								</h3>

								<button
									onClick={handleDeleteAllTutors}
									className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
								>
									Delete All Tutors
								</button>

								<div className="flex flex-col mb-6">
									<label className="text-gray-700 font-bold mb-2">
										Search Tutor
									</label>
									<input
										type="text"
										placeholder="Search tutor name..."
										value={deleteSearchQuery}
										onChange={(e) =>
											setDeleteSearchQuery(e.target.value)
										}
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									/>
								</div>

								<div className="border rounded-lg p-4 bg-gray-50 flex-1 flex flex-col min-h-0">
									<h4 className="font-bold text-gray-700 mb-3">
										Tutors List
									</h4>
									<div className="flex-1 overflow-y-auto space-y-2">
										{filteredTutors.length === 0 &&
										tutors.length > 0 ? (
											<p className="text-gray-500">
												No tutors match your search.
											</p>
										) : (
											filteredTutors.map((tutor) => (
												<div
													key={tutor.id}
													className="flex items-center justify-between p-3 bg-white rounded-md border"
												>
													<div className="flex-1 flex flex-col items-start min-w-0">
														<p className="font-semibold text-gray-800 break-words text-left">
															{tutor.fname}{" "}
															{tutor.lname}
															<span className="text-sm font-normal text-gray-600 ml-2">
																(
																{tutor.totaltime
																	? (
																			(tutor.totaltime - tutor.approvedtime) /
																			3600000
																	  ).toFixed(
																			2
																	  )
																	: "0.00"}{" "}
																hrs pending approval)
                                                                
															</span>
														</p>
														<p className="text-sm text-blue-400 break-all">
															<a
																href={`mailto:${tutor.email}`}
															>
																{tutor.email}
															</a>
														</p>
													</div>
													<div className="flex items-center space-x-2">
                                                        <button
															onClick={() => {
																handleTutorHours(
                                                                    tutor.id
                                                                )
															}}
															className="w-10 h-10 flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-md transition-all duration-200 text-sm font-bold"
															title="Save Hours"
														>
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-check-fill" viewBox="0 0 16 16">
                                                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 4.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                                                            </svg>
														</button>
														<button
															onClick={() => {
																window.scrollTo(
																	0,
																	0
																);
																navigate(
																	`/editTutor/${tutor.id}`
																);
															}}
															className="w-10 h-10 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 text-sm font-bold"
															title="Edit Tutor"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth={2}
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
																/>
															</svg>
														</button>
														<button
															onClick={() =>
																handleDeleteTutor(
																	tutor.id
																)
															}
															className="w-10 h-10 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200 text-sm font-bold"
															title="Delete Tutor"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth={2}
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																/>
															</svg>
														</button>
													</div>
												</div>
											))
										)}
										{tutors.length === 0 && (
											<p className="text-gray-500">
												Loading tutors...
											</p>
										)}
									</div>
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

export default AddTutor;
