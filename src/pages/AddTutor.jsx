import React, { useState, useEffect } from "react";
import "./custom.css";

function AddTutor() {
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
    availability: "",
  });

  // selected classes for each category
  const [selectedClasses, setSelectedClasses] = useState({});

  // state for searching and deleting tutors
  const [deleteSearchQuery, setDeleteSearchQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

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
      const response = await fetch("http://localhost:5000/api/classes");

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
      const response = await fetch("http://localhost:5000/api/tutors/search");
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error("error fetching tutors:", error);
    }
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

  // handle creating a new tutor
  const handleCreateTutor = async () => {
    if (!newTutor.fname || !newTutor.lname || !newTutor.email) {
      console.log("please fill in at least first name, last name, and email.");
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

      const tutorData = {
        ...newTutor,
        imsaid: newTutor.imsaid ? parseInt(newTutor.imsaid) : null,
        hall: newTutor.hall ? parseInt(newTutor.hall) : null,
        wing: newTutor.wing ? parseInt(newTutor.wing) : null,
        ...formattedClasses,
      };

      const response = await fetch("http://localhost:5000/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          availability: "",
        });

        // reset selected classes
        const resetSelectedClasses = {};
        Object.keys(classCategories).forEach((department) => {
          resetSelectedClasses[department] = [];
        });
        setSelectedClasses(resetSelectedClasses);

        console.log("tutor added successfully!");
      } else {
        const errorData = await response.json();
        console.log(`error creating tutor: ${errorData.error}`);
      }
    } catch (error) {
      console.error("error creating tutor:", error);
      console.log("error creating tutor. please try again.");
    }
  };

  // handle deleting tutor with confirmation popup
  const handleDeleteTutor = async (tutorId) => {
    const tutorToDelete = tutors.find((tutor) => tutor.id === tutorId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the tutor "${tutorToDelete.fname} ${tutorToDelete.lname}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tutors/${tutorId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // refresh tutors from database after successful deletion
          fetchTutors();
        } else {
          const errorData = await response.json();
          console.log(`error deleting tutor: ${errorData.error}`);
        }
      } catch (error) {
        console.error("error deleting tutor:", error);
        console.log("error deleting tutor. please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto py-[6rem] px-4 custom-container">
      <h1 className="text-blue-500 text-4xl mb-6 text-center font-sans font-bold">
        Manage Tutors
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left side - add tutor form */}
        <div className="rounded-2xl shadow-md p-4 bg-white border overflow-y-auto w-full overflow-x-hidden">
          <h3 className="text-lg font-bold mb-4 text-blue-500">
            Add New Tutor
          </h3>

          <p className="font-sans text-gray-700 text-left">First Name:</p>
          <input
            type="text"
            placeholder="Enter first name..."
            value={newTutor.fname}
            onChange={(e) => handleInputChange("fname", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Last Name:</p>
          <input
            type="text"
            placeholder="Enter last name..."
            value={newTutor.lname}
            onChange={(e) => handleInputChange("lname", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">
            Facebook Name (optional):
          </p>
          <input
            type="text"
            placeholder="Enter facebook name..."
            value={newTutor.fbname}
            onChange={(e) => handleInputChange("fbname", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Email:</p>
          <input
            type="email"
            placeholder="Enter email..."
            value={newTutor.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">IMSA ID:</p>
          <input
            type="number"
            placeholder="Enter IMSA ID..."
            value={newTutor.imsaid}
            onChange={(e) => handleInputChange("imsaid", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Hall:</p>
          <input
            type="number"
            placeholder="Enter hall number..."
            value={newTutor.hall}
            onChange={(e) => handleInputChange("hall", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Wing:</p>
          <input
            type="number"
            placeholder="Enter wing number..."
            value={newTutor.wing}
            onChange={(e) => handleInputChange("wing", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Blurb:</p>
          <textarea
            placeholder="Enter tutor description..."
            value={newTutor.blurb}
            onChange={(e) => handleInputChange("blurb", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans text-gray-700 text-left">Availability:</p>
          <textarea
            placeholder="Format: sunday,5:30-6:00,6:00-6:30;tuesday,9:00-9:30"
            value={newTutor.availability}
            onChange={(e) => handleInputChange("availability", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white text-black"
          />

          {/* class selection sections */}
          {isLoadingClasses ? (
            <div className="mb-4">
              <p className="font-sans text-gray-500">Loading classes...</p>
            </div>
          ) : Object.keys(classCategories).length === 0 ? (
            <div className="mb-4">
              <p className="font-sans text-red-500">
                Error loading classes. Please refresh the page.
              </p>
            </div>
          ) : (
            Object.entries(classCategories).map(([category, classes]) => (
              <div key={category} className="mb-4">
                <p className="font-sans font-bold capitalize text-gray-700 text-left">
                  {category} Classes:
                </p>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto text-black">
                  {classes.map((className) => (
                    <label key={className} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={
                          selectedClasses[category]?.includes(className) ||
                          false
                        }
                        onChange={() => handleClassToggle(category, className)}
                        className="mr-2"
                      />
                      <span className="text-sm">{className}</span>
                    </label>
                  ))}
                </div>
                {selectedClasses[category]?.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Selected: {selectedClasses[category].join(", ")}
                  </p>
                )}
              </div>
            ))
          )}

          <button
            onClick={handleCreateTutor}
            disabled={
              isLoadingClasses || Object.keys(classCategories).length === 0
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-sans mt-4 w-full"
          >
            {isLoadingClasses ? "Loading..." : "Add Tutor"}
          </button>
        </div>

        {/* right side - delete tutor section */}
        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h3 className="font-sans text-lg font-bold mb-4 text-blue-500">
            Delete Tutor
          </h3>
          <input
            type="text"
            placeholder="Search tutor name..."
            value={deleteSearchQuery}
            onChange={(e) => setDeleteSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
          />

          <div className="w-full h-96 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2 text-black">
            {filteredTutors.length === 0 && tutors.length > 0 ? (
              <p>No tutors match your search.</p>
            ) : (
              filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>
                    {tutor.fname} {tutor.lname} - {tutor.email}
                  </span>
                  <button
                    onClick={() => handleDeleteTutor(tutor.id)}
                    className="ml-2 text-blue-800 hover:text-blue-900 bg-transparent focus:outline-none hover:border-none"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
            {tutors.length === 0 && <p>Loading tutors...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTutor;
