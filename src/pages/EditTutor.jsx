import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./custom.css";
import Footer from "../components/Footer.jsx";
import { isTokenExpired } from "../util.ts";

function EditTutor() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Environment variables for API configuration
    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const baseUrl = `http://${HOST}:${DBPORT}`;

    // State for class categories from database
    const [classCategories, setClassCategories] = useState({});
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);

    // Form state for the tutor being edited
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

    // Separate state for availability by day
    const [availability, setAvailability] = useState({
        sunday: "",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
    });

    // Selected classes for each category
    const [selectedClasses, setSelectedClasses] = useState({});

    // Fetch tutor data and all classes when component mounts
    useEffect(() => {
        fetchClasses();
    }, [id]);

    // Fetch tutor data after classes are loaded
    useEffect(() => {
        if (Object.keys(classCategories).length > 0) {
            fetchTutorData();
        }
    }, [classCategories, id]);

    // Initialize selectedClasses when classCategories changes
    useEffect(() => {
        if (Object.keys(classCategories).length > 0) {
            const initialSelectedClasses = {};
            Object.keys(classCategories).forEach((department) => {
                initialSelectedClasses[department] = [];
            });
            setSelectedClasses(initialSelectedClasses);
        }
    }, [classCategories]);

    // Fetch classes from database and organize by department
    const fetchClasses = async () => {
        try {
            setIsLoadingClasses(true);
            const response = await fetch(`${baseUrl}/api/classes`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const classes = await response.json();

            // Organize classes by department
            const organizedClasses = {};
            classes.forEach((classItem) => {
                const { department, class_name } = classItem;
                if (!organizedClasses[department]) {
                    organizedClasses[department] = [];
                }
                organizedClasses[department].push(class_name);
            });

            setClassCategories(organizedClasses);
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClassCategories({});
        } finally {
            setIsLoadingClasses(false);
        }
    };

    // Fetch data for the specific tutor
    const fetchTutorData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/tutors/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Set basic tutor data
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

            // Parse and set availability
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

            // Parse and set selected classes when classCategories is ready
            if (Object.keys(classCategories).length > 0) {
                const parsedClasses = {};
                // Map category names to database field names
                const categoryToDbField = {
                    biology: "biology",
                    chem: "chem",
                    cs: "cs",
                    language: "language",
                    mathcore: "mathcore",
                    mathother: "mathother",
                    physics: "physics",
                    sciother: "sciother",
                };

                Object.keys(classCategories).forEach((category) => {
                    parsedClasses[category] = [];
                    // Get the corresponding database field name
                    const dbFieldName = categoryToDbField[category];
                    if (
                        dbFieldName &&
                        data[dbFieldName] &&
                        data[dbFieldName].trim()
                    ) {
                        const classNames = data[dbFieldName]
                            .split(";")
                            .map((c) => c.replace(/_/g, " "))
                            .filter((name) => name.trim());
                        parsedClasses[category] = classNames;
                    }
                });
                setSelectedClasses(parsedClasses);
            }
        } catch (error) {
            console.error("Error fetching tutor data:", error);
            console.log("Could not fetch tutor data. Please try again.");
        }
    };

    // Handle availability input changes
    const handleAvailabilityChange = (day, value) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: value.trim(),
        }));
    };

    // Construct availability string for database
    const constructAvailabilityString = () => {
        const dayEntries = [];
        Object.entries(availability).forEach(([day, timeSlots]) => {
            if (timeSlots && timeSlots.trim()) {
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

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setTutorData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle class selection for each category
    const handleClassToggle = (category, className) => {
        setSelectedClasses((prev) => ({
            ...prev,
            [category]: prev[category]?.includes(className)
                ? prev[category].filter((c) => c !== className)
                : [...(prev[category] || []), className],
        }));
    };

    // Convert class name to database format
    const formatClassForDatabase = (className) => {
        return className.replace(/ /g, "_").replace(/&/g, "&");
    };

    // Handle updating the tutor
    const handleUpdateTutor = async () => {
        if (!tutorData.fname || !tutorData.lname || !tutorData.email) {
            console.log(
                "Please fill in at least first name, last name, and email."
            );
            return;
        }

        try {
            const formattedClasses = {};
            // Map category names to database field names
            const categoryToDbField = {
                biology: "biology",
                chem: "chem",
                cs: "cs",
                language: "language",
                mathcore: "mathcore",
                mathother: "mathother",
                physics: "physics",
                sciother: "sciother",
            };

            Object.keys(selectedClasses).forEach((category) => {
                // Convert category name to database field name
                const dbFieldName = categoryToDbField[category];
                if (dbFieldName) {
                    if (selectedClasses[category]?.length > 0) {
                        formattedClasses[dbFieldName] = selectedClasses[
                            category
                        ]
                            .map(formatClassForDatabase)
                            .join(";");
                    } else {
                        formattedClasses[dbFieldName] = "";
                    }
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
                console.log("Tutor information updated successfully!");
                // Don't navigate anywhere yet as requested
            } else {
                const errorData = await response.json();
                console.log(`Error updating tutor: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating tutor:", error);
            console.log("Error updating tutor. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="min-h-screen overflow-x-hidden overflow-y-auto py-[6rem] px-4 custom-container">
                <h1 className="text-blue-500 text-4xl mb-6 text-center font-sans font-bold">
                    Edit Tutor Information
                </h1>
                <div className="flex justify-center">
                    {/* single card for editing tutor */}
                    <div className="max-w-4xl w-full">
                        <div className="rounded-2xl shadow-md p-4 bg-white border overflow-y-auto w-full overflow-x-hidden">
                            <h3 className="text-lg font-bold mb-4 text-blue-500">
                                Update Your Information
                            </h3>

                            <p className="font-sans text-gray-700 text-left">
                                First Name:
                            </p>
                            <input
                                type="text"
                                placeholder="Enter first name..."
                                value={tutorData.fname}
                                onChange={(e) =>
                                    handleInputChange("fname", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Last Name:
                            </p>
                            <input
                                type="text"
                                placeholder="Enter last name..."
                                value={tutorData.lname}
                                onChange={(e) =>
                                    handleInputChange("lname", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Facebook Name (optional):
                            </p>
                            <input
                                type="text"
                                placeholder="Enter facebook name..."
                                value={tutorData.fbname}
                                onChange={(e) =>
                                    handleInputChange("fbname", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Email:
                            </p>
                            <input
                                type="email"
                                placeholder="Enter email..."
                                value={tutorData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                IMSA ID:
                            </p>
                            <input
                                type="number"
                                placeholder="Enter IMSA ID..."
                                value={tutorData.imsaid}
                                onChange={(e) =>
                                    handleInputChange("imsaid", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Hall:
                            </p>
                            <input
                                type="number"
                                placeholder="Enter hall number..."
                                value={tutorData.hall}
                                onChange={(e) =>
                                    handleInputChange("hall", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Wing:
                            </p>
                            <input
                                type="text"
                                placeholder="Enter wing (A, B, C, or D)..."
                                value={tutorData.wing}
                                onChange={(e) =>
                                    handleInputChange("wing", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
                            />

                            <p className="font-sans text-gray-700 text-left">
                                Blurb:
                            </p>
                            <textarea
                                placeholder="Enter tutor description..."
                                value={tutorData.blurb}
                                onChange={(e) =>
                                    handleInputChange("blurb", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white text-black"
                            />

                            {/* availability fields for each day */}
                            <div className="mb-4">
                                <p className="font-sans font-bold text-gray-700 text-left mb-2">
                                    Availability (enter time slots separated by
                                    commas):
                                </p>
                                <p className="font-sans text-xs text-gray-500 mb-3 text-left">
                                    Example: "5:30-6:00, 6:00-6:30, 7:00-7:30",
                                    please do not include AM or PM!
                                </p>

                                {Object.entries(availability).map(
                                    ([day, timeSlots]) => (
                                        <div key={day} className="mb-2">
                                            <label className="font-sans text-gray-600 text-sm capitalize mb-1 block text-left">
                                                {day}:
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
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-sm"
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            {/* class selection sections */}
                            {isLoadingClasses ? (
                                <div className="mb-4">
                                    <p className="font-sans text-gray-500">
                                        Loading classes...
                                    </p>
                                </div>
                            ) : Object.keys(classCategories).length === 0 ? (
                                <div className="mb-4">
                                    <p className="font-sans text-red-500">
                                        Error loading classes. Please refresh
                                        the page.
                                    </p>
                                </div>
                            ) : (
                                Object.entries(classCategories).map(
                                    ([category, classes]) => (
                                        <div key={category} className="mb-4">
                                            <p className="font-sans font-bold capitalize text-gray-700 text-left">
                                                {category} Classes:
                                            </p>
                                            <div className="border rounded-md p-2 max-h-32 overflow-y-auto text-black">
                                                {classes.map((className) => (
                                                    <label
                                                        key={className}
                                                        className="flex items-center mb-1"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedClasses[
                                                                    category
                                                                ]?.includes(
                                                                    className
                                                                ) || false
                                                            }
                                                            onChange={() =>
                                                                handleClassToggle(
                                                                    category,
                                                                    className
                                                                )
                                                            }
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            {className}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            {selectedClasses[category]?.length >
                                                0 && (
                                                <p className="text-xs text-blue-600 mt-1">
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

                            <button
                                onClick={handleUpdateTutor}
                                disabled={
                                    isLoadingClasses ||
                                    Object.keys(classCategories).length === 0
                                }
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-sans mt-4 w-full"
                            >
                                {isLoadingClasses
                                    ? "Loading..."
                                    : "Update Information"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditTutor;
