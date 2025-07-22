import React, { useState, useEffect } from "react";
import "./custom.css";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal.jsx";

import { isTokenExpired } from "../util.ts";

const token = localStorage.getItem("token");

function AddTutor() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            navigate("/login", { replace: true });
        }
    }, []);
    // environment variables for API configuration
    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const baseUrl = `http://${HOST}:${DBPORT}`;

    // state for class categories from database
    const [classCategories, setClassCategories] = useState({});
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);

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

    // fetch classes from database when component loads
    useEffect(() => {
        fetchClasses();
        fetchTutors();
    }, []);

    // initialize selectedClasses when classCategories changes
    useEffect(() => {
        if (Object.keys(classCategories).length > 0) {
            const initialSelectedClasses = {};
            Object.keys(classCategories).forEach((department) => {
                initialSelectedClasses[department] = [];
            });
            setSelectedClasses(initialSelectedClasses);
        }
    }, [classCategories]);

    // filter tutors when search query or tutors array changes
    useEffect(() => {
        if (tutors.length > 0) {
            const filtered = tutors.filter((tutor) => {
                const fullName = `${tutor.fname} ${tutor.lname}`.toLowerCase();
                return fullName.includes(deleteSearchQuery.toLowerCase());
            });
            setFilteredTutors(filtered);
        }
    }, [deleteSearchQuery, tutors]);

    // fetch classes from database and organize by department
    const fetchClasses = async () => {
        try {
            setIsLoadingClasses(true);
            const response = await fetch(`${baseUrl}/api/classes`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const classes = await response.json();

            // organize classes by department
            const organizedClasses = {};
            classes.forEach((classItem) => {
                const { department, class_name } = classItem;
                if (!organizedClasses[department]) {
                    organizedClasses[department] = [];
                }
                organizedClasses[department].push(class_name);
            });

            setClassCategories(organizedClasses);
            console.log("Fetched classes from database:", organizedClasses);
        } catch (error) {
            console.error("Error fetching classes:", error);
            // fallback to empty object if API fails
            setClassCategories({});
        } finally {
            setIsLoadingClasses(false);
        }
    };

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
            [day]: formatTime(value),
        }));
    };

    // construct availability string for database
    const constructAvailabilityString = () => {
        const dayEntries = [];

        Object.entries(availability).forEach(([day, timeSlots]) => {
            if (timeSlots && timeSlots.trim()) {
                // split by commas and filter out empty entries
                const slots = timeSlots
                    .split(",")
                    .map((slot) => slot.trim())
                    .filter((slot) => slot.length > 0);

                if (slots.length > 0) {
                    dayEntries.push(`${day},${slots.join(",")}`);
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

    // format time from "7:30 PM - 8:00 PM" to "7:30-8:00"
    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        return timeStr
            .replace(/\s*PM\s*/g, "")
            .replace(/\s*AM\s*/g, "")
            .replace(/\s*-\s*/g, "-")
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
        if (
            !newTutor.fname ||
            !newTutor.lname ||
            !newTutor.email ||
            !newTutor.imsaid ||
            !newTutor.hall ||
            !newTutor.wing
        ) {
            alert("Please fill in all fields.");
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

                alert("Tutor added successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error creating tutor: ${errorData.error}`);
            }
        } catch (error) {
            console.error("error creating tutor:", error);
            alert("Error creating tutor. Please try again.");
        }
    };

    // handle deleting tutor with confirmation popup
    const handleDeleteTutor = async (tutorId) => {
        const tutorToDelete = tutors.find((tutor) => tutor.id === tutorId);

        setAlertModal({
            isOpen: true,
            title: "Confirm Delete",
            message: `Are you sure you want to delete the tutor "${tutorToDelete.fname} ${tutorToDelete.lname}"? This action cannot be undone.`,
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

    return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-between items-center mb-6 py-10">
                <button
                    onClick={() => navigate("/adminDashboard")}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left card - Add tutor form */}
                        <div className="rounded-2xl shadow-md p-8 bg-white border h-full">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-700 mb-6">
                                    Add New Tutor
                                </h3>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        First Name
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
                                        Last Name
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
                                        Facebook Name (optional)
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
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter email..."
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
                                        IMSA ID
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter IMSA ID..."
                                        value={newTutor.imsaid}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "imsaid",
                                                e.target.value
                                            )
                                        }
                                        min={126000}
                                        max={200000}
                                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        Hall
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
                                        Wing
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
                                        Blurb
                                    </label>
                                    <textarea
                                        placeholder="Enter tutor description..."
                                        value={newTutor.blurb}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "blurb",
                                                e.target.value
                                            )
                                        }
                                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                        rows="4"
                                    />
                                </div>

                                {/* Availability Section */}
                                <div className="border-t pt-6 mt-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">
                                        Availability
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Enter time slots separated by commas
                                        (e.g., "5:30-6:00, 6:00-6:30,
                                        7:00-7:30"). Do not include AM or PM.
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
                                        Class Selection
                                    </h3>

                                    {isLoadingClasses ? (
                                        <div className="text-gray-500">
                                            Loading classes...
                                        </div>
                                    ) : Object.keys(classCategories).length ===
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
                                        isLoadingClasses ||
                                        Object.keys(classCategories).length ===
                                            0
                                    }
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    {isLoadingClasses
                                        ? "Loading..."
                                        : "Add Tutor"}
                                </button>
                            </div>
                        </div>

                        {/* Right card - Delete tutor section */}
                        <div className="rounded-2xl shadow-md p-8 bg-white border h-[4859px] flex flex-none flex-col">
                            <div className="flex flex-col h-full">
                                <h3 className="text-2xl font-bold text-gray-700 mb-6">
                                    Delete Tutor
                                </h3>

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

                                <div className="border rounded-lg p-4 bg-gray-50 flex-none flex flex-col">
                                    <h4 className="font-bold text-gray-700 mb-3">
                                        Tutors List
                                    </h4>
                                    {/* This div now takes up the remaining height and scrolls when content overflows */}
                                    <div className="h-full flex-none overflow-y-scroll space-y-2">
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
                                                    <div className="flex-1 flex flex-col items-center">
                                                        <p className="font-semibold text-gray-800">
                                                            {tutor.fname}{" "}
                                                            {tutor.lname}
                                                        </p>
                                                        <p className="text-sm text-blue-400">
                                                            <a
                                                                href={`mailto:${tutor.email}`}
                                                            >
                                                                {tutor.email}
                                                            </a>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/editTutor/${tutor.id}`
                                                                )
                                                            }
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
