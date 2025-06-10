import React, { useState, useEffect } from "react";

function Dashboard() {
  // we actually don't have a field in the database for all the classes so i hardcoded it
  const classes = [
    "SI Physics",
    "Physics: Sound and Light",
    "Physics C: Mechanics",
    "Physics C: Electricity/Magnetism",
    "Planetary Science",
    "Modern Physics",
    "Computational Science",
    "SI Chemistry",
    "Advanced Chemistry - Structure and Properties",
    "Advanced Chemistry - Chemical Reactions",
    "The Physical Chemistry of Materials",
    "Organic Chemistry I",
    "Organic Chemistry II",
    "Biochemistry",
    "Environmental Chemistry",
    "Medicinal Chemistry",
    "Biology: Evolution & Environment",
    "Biology: Molecular & Cellular",
    "Evolution, Biodiversity, and Ecology",
    "Cancer Biology",
    "Environmental Microbiology",
    "Pathophysiology",
    "Biology of Behavior",
    "Methods of Scientific Inquiries",
    "Electronics",
    "Engineering",
    "Engineering: Statics & Dynamics",
    "Introduction to Proofs",
    "Modern Geometries",
    "Statistical Exploration and Description",
    "Statistical Experimentation and Inference",
    "Number Theory",
    "Discrete Mathematics",
    "Multi-Variable Calculus",
    "Theory of Analysis",
    "Differential Equations",
    "Linear Algebra",
    "Abstract Algebra",
    "Geometry",
    "MI I/II",
    "MI II",
    "MI III",
    "MI IV",
    "AB Calculus I",
    "AB Calculus II",
    "BC I",
    "BC II",
    "BC III",
    "BC I/II",
    "BC II/III",
    "CSI",
    "OOP",
    "Web Technologies",
    "Advanced Programming",
    "Microcontroller Applications (CS)",
    "CS Seminar: Android Apps Development",
    "CS Seminar: Linux and Cybersecurity",
    "CS Seminar: Machine Learning",
    "French I",
    "French II",
    "French III",
    "French IV",
    "French V",
    "Spanish II",
    "Spanish III",
    "Spanish IV",
    "Spanish V",
    "German I",
    "German II",
    "German III",
    "Mandarin Chinese I",
    "Mandarin Chinese II",
    "Mandarin Chinese III",
  ];

  // state variables for class search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const filteredClasses = classes.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectClass = (className) => {
    setSelectedClass(className);
    setSearchTerm("");
  };

  // lotta states so that you can search for tutors
  const [tutorSearchQuery, setTutorSearchQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

  // bulletin board states
  const [posts, setPosts] = useState([]);

  // this one got fields so i can edit them directly and is easier
  const [newPost, setNewPost] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  // fetch tutors when page loads
  useEffect(() => {
    fetchTutors();
  }, []);

  // new filtering code for filtering tutors when search query updates
  useEffect(() => {
    if (tutors.length > 0) {
      const filtered = tutors.filter((tutor) => {
        const fullName = `${tutor.fname} ${tutor.lname}`.toLowerCase();
        return fullName.includes(tutorSearchQuery.toLowerCase());
      });
      setFilteredTutors(filtered);
    }
  }, [tutorSearchQuery, tutors]);

  // copy pasted from findtutors but it just fetches all tutors from api
  const fetchTutors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tutors/search");
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  // delete tutors
  const handleDeleteTutor = (tutorId) => {
    setTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
    // Also update filtered tutors to reflect the change immediately
    setFilteredTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
  };

  // handle form input changes for new post by changing a specified field's value
  const handlePostInputChange = (field, value) => {
    setNewPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle creating a new post
  const handleCreatePost = () => {
    setPosts((prev) => [newPost, ...prev]); // add new post to the beginning

    // clear the form
    setNewPost({
      name: "",
      date: "",
      time: "",
      location: "",
      description: "",
    });
  };

  // delete a post by filtering the posts and removing the post with the specified index
  const handleDeletePost = (indexToDelete) => {
    setPosts((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-4xl font-sans mb-6 text-center font-bold py-10">
        Administrator Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">
            Tutor Management
          </h2>
          {/* ROUTE TO THE ADD TUTOR PAGE */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">
            Add / Delete Tutor →
          </button>

          <p className="font-sans text-lg py-3 font-bold">
            Submit hours for a tutor:
          </p>
          <p className="font-sans py-1">Name of tutor:</p>
          <input
            type="text"
            placeholder="The name of the tutor..."
            value={tutorSearchQuery}
            onChange={(e) => setTutorSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-full h-60 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2 scroll-auto">
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
                    onClick={() => handleDeleteTutor(tutor.id)} // Added functionality
                    className="ml-2 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
            {tutors.length === 0 && <p>No tutors here.</p>}
          </div>
          <p className="font-sans py-2">Start hours for tutor:</p>
          <input
            type="time"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          ></input>
          <p className="font-sans py-2">End hours for tutor:</p>
          <input
            type="time"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          ></input>
          <p className="font-sans py-2">Date of hours:</p>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          ></input>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">
            Submit
          </button>
          {/* IMPROVE LEVEL OF SECURITY FOR THIS SECTION */}
          <p className="font-sans py-2">Approve hours for tutors:</p>
          <div className="w-full h-60 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2 scroll-auto">
            {/* this is still hardcoded because i couldn't figure out how we would do this */}
            <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center">
              <span>
                Aarav Shah - 18,394 hours - 5/7/25 <br></br>1:00 am - 2:00 pm
              </span>
              <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">
                Approve
              </button>
              <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">
                Decline
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">
            Bulletin Board
          </h2>
          <h3 className="font-sans text-lg font-bold">Create new post:</h3>
          <p className="font-sans">Name of event:</p>
          <input
            type="text"
            placeholder="Enter event name..."
            value={newPost.name}
            onChange={(e) => handlePostInputChange("name", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <p className="font-sans">Date of event:</p>
          <input
            type="date"
            value={newPost.date}
            onChange={(e) => handlePostInputChange("date", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <p className="font-sans">Time of event:</p>
          <input
            type="time"
            value={newPost.time}
            onChange={(e) => handlePostInputChange("time", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <p className="font-sans">Location of event:</p>
          <input
            type="text"
            placeholder="Enter event location..."
            value={newPost.location}
            onChange={(e) => handlePostInputChange("location", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <p className="font-sans">Short description of event:</p>
          <textarea
            placeholder="Enter event description..."
            value={newPost.description}
            onChange={(e) =>
              handlePostInputChange("description", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            onClick={handleCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans"
          >
            Post
          </button>
          <h3 className="font-sans text-lg mt-4">Current posts:</h3>
          <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>
                    {post.name}
                    {post.location && ` in ${post.location}`} - {post.date}
                  </span>
                  <button
                    onClick={() => handleDeletePost(index)}
                    className="ml-2 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">
            Class Management
          </h2>
          <input
            type="text"
            placeholder="Search for a class..."
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={selectedClass !== null}
          />

          {searchTerm && !selectedClass && (
            <ul className="border rounded-md bg-white shadow-md mt-1 max-h-40 overflow-y-auto">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((className, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectClass(className)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {className}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}

          {selectedClass && (
            <div className="mt-3 bg-blue-200 text-blue-800 px-3 py-2 rounded flex justify-between items-center w-fit">
              <span>{selectedClass}</span>
              <button
                className="ml-2 text-blue-800 hover:text-blue-900 font-bold"
                onClick={() => setSelectedClass(null)}
              >
                ×
              </button>
            </div>
          )}
          <p>Upload Supporting Materials:</p>
          <input
            type="file"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">
            Upload
          </button>
          <p className="font-sans">Delete Supporting Materials:</p>
          <input
            type="text"
            placeholder="The name of the file..."
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
            <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center">
              <span>Item name</span>
              <button className="ml-2 text-blue-800 hover:text-blue-900">
                ×
              </button>
            </div>
            <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center">
              <span>MI4 study sheet</span>
              <button className="ml-2 text-blue-800 hover:text-blue-900">
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
