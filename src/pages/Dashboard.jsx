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

  // bulletin board states - updated for backend integration
  const [posts, setPosts] = useState([]);

  // updated form state to match database schema
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    event_date: "",
    author: "",
    contact_info: "",
    highpriority: false,
  });

  // resources states for class management
  const [resources, setResources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);

  // fetch tutors, posts, and resources when page loads
  useEffect(() => {
    fetchTutors();
    fetchPosts();
    fetchResources();
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

  // filter resources when search query updates
  useEffect(() => {
    if (resources.length > 0) {
      const filtered = resources.filter((resource) => {
        return (
          resource.name
            .toLowerCase()
            .includes(resourceSearchQuery.toLowerCase()) ||
          resource.classes
            .toLowerCase()
            .includes(resourceSearchQuery.toLowerCase())
        );
      });
      setFilteredResources(filtered);
    }
  }, [resourceSearchQuery, resources]);

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

  // fetch posts from database
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bulletin");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("error fetching posts:", error);
    }
  };

  // fetch resources from database
  const fetchResources = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/resources");
      const data = await response.json();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error("error fetching resources:", error);
    }
  };

  // delete tutors
  // delete tutors with confirmation popup
  // delete tutors with confirmation popup - remove from database
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
          alert(`error deleting tutor: ${errorData.error}`);
        }
      } catch (error) {
        console.error("error deleting tutor:", error);
        alert("error deleting tutor. please try again.");
      }
    }
  };

  // handle form input changes for new post by changing a specified field's value
  const handlePostInputChange = (field, value) => {
    setNewPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle creating a new post - save to database
  const handleCreatePost = async () => {
    if (newPost.title && newPost.event_date) {
      try {
        const response = await fetch("http://localhost:5000/api/bulletin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newPost.title,
            content: newPost.content,
            event_date: newPost.event_date,
            author: newPost.author || "Admin",
            contact_info: newPost.contact_info,
            highpriority: newPost.highpriority,
          }),
        });

        if (response.ok) {
          // refresh posts from database
          fetchPosts();

          // clear the form
          setNewPost({
            title: "",
            content: "",
            event_date: "",
            author: "",
            contact_info: "",
            highpriority: false,
          });
        } else {
          alert("error creating post. please try again.");
        }
      } catch (error) {
        console.error("error creating post:", error);
        alert("error creating post. please try again.");
      }
    } else {
      alert("please fill in at least the event title and date.");
    }
  };

  // delete a post with confirmation popup - remove from database
  const handleDeletePost = async (postId) => {
    const postToDelete = posts.find((post) => post.id === postId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${postToDelete.title}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bulletin/${postId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // refresh posts from database
          fetchPosts();
        } else {
          alert("error deleting post. please try again.");
        }
      } catch (error) {
        console.error("error deleting post:", error);
        alert("error deleting post. please try again.");
      }
    }
  };

  // handle resource upload
  const handleResourceUpload = async () => {
    if (!selectedFile || !selectedClass) {
      alert("please select a file and a class.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedFile.name,
          email: "admin@imsa.edu", // admin email
          classes: selectedClass,
          url: `/uploads/${selectedFile.name}`, // placeholder url
          type: selectedFile.type || "file",
        }),
      });

      if (response.ok) {
        // refresh resources from database
        fetchResources();

        // clear form
        setSelectedFile(null);
        setSelectedClass(null);
        setSearchTerm("");

        alert("resource uploaded successfully!");
      } else {
        alert("error uploading resource. please try again.");
      }
    } catch (error) {
      console.error("error uploading resource:", error);
      alert("error uploading resource. please try again.");
    }
  };

  // handle deleting a resource
  const handleDeleteResource = async (resourceId) => {
    const resourceToDelete = resources.find(
      (resource) => resource.resource_id === resourceId
    );
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the resource "${resourceToDelete.name}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/resources/${resourceId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // refresh resources from database
          fetchResources();
        } else {
          alert("error deleting resource. please try again.");
        }
      } catch (error) {
        console.error("error deleting resource:", error);
        alert("error deleting resource. please try again.");
      }
    }
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
            Search and manage tutors:
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
                    onClick={() => handleDeleteTutor(tutor.id)}
                    className="ml-2 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
            {tutors.length === 0 && <p>No tutors here.</p>}
          </div>
        </div>

        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">
            Bulletin Board
          </h2>
          <h3 className="font-sans text-lg font-bold">Create new post:</h3>

          <p className="font-sans">Title of event:</p>
          <input
            type="text"
            placeholder="Enter event title..."
            value={newPost.title}
            onChange={(e) => handlePostInputChange("title", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <p className="font-sans">Date of event:</p>
          <input
            type="date"
            value={newPost.event_date}
            onChange={(e) =>
              handlePostInputChange("event_date", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <p className="font-sans">Author:</p>
          <input
            type="text"
            placeholder="Enter author name..."
            value={newPost.author}
            onChange={(e) => handlePostInputChange("author", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <p className="font-sans">Contact Info:</p>
          <input
            type="text"
            placeholder="Enter contact information..."
            value={newPost.contact_info}
            onChange={(e) =>
              handlePostInputChange("contact_info", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <p className="font-sans">Description:</p>
          <textarea
            placeholder="Enter event description..."
            value={newPost.content}
            onChange={(e) => handlePostInputChange("content", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={newPost.highpriority}
              onChange={(e) =>
                handlePostInputChange("highpriority", e.target.checked)
              }
              className="mr-2"
            />
            <span className="font-sans">High Priority</span>
          </label>

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
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>
                    {post.title} - {post.event_date}
                    {post.highpriority && (
                      <span className="text-red-600 font-bold">
                        {" "}
                        (HIGH PRIORITY)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
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

          <p className="font-sans mb-2">Select a class:</p>
          <input
            type="text"
            placeholder="Search for a class..."
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={selectedClass !== null}
          />

          {searchTerm && !selectedClass && (
            <ul className="border rounded-md bg-white shadow-md mt-1 max-h-40 overflow-y-auto mb-2">
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
            <div className="mt-3 mb-3 bg-blue-200 text-blue-800 px-3 py-2 rounded flex justify-between items-center w-fit">
              <span>{selectedClass}</span>
              <button
                className="ml-2 text-blue-800 hover:text-blue-900 font-bold"
                onClick={() => setSelectedClass(null)}
              >
                ×
              </button>
            </div>
          )}

          <p className="font-sans">Upload Supporting Materials:</p>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            onClick={handleResourceUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans"
          >
            Upload
          </button>

          <p className="font-sans mt-4">Search Supporting Materials:</p>
          <input
            type="text"
            placeholder="Search by file name or class..."
            value={resourceSearchQuery}
            onChange={(e) => setResourceSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
            {filteredResources.length === 0 ? (
              <p className="text-gray-500">No resources yet.</p>
            ) : (
              filteredResources.map((resource) => (
                <div
                  key={resource.resource_id}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>
                    {resource.name} - {resource.classes}
                  </span>
                  <button
                    onClick={() => handleDeleteResource(resource.resource_id)}
                    className="ml-2 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
