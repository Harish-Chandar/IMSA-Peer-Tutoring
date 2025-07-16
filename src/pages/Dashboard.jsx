import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";

function Dashboard() {
  // environment variables for API configuration
  const DBPORT = process.env.REACT_APP_DBPORT || "5000";
  const HOST = process.env.REACT_APP_HOST || "localhost";
  const baseUrl = `http://${HOST}:${DBPORT}`;

  // state variables for class search
  const [classes, setClasses] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const filteredClasses = classes.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectClass = (className) => {
    setSelectedClass(className);
    setSearchTerm("");
  };

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
  const [resourceLink, setResourceLink] = useState("");
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);

  // fetch posts and resources when page loads
  useEffect(() => {
    fetchPosts();
    fetchResources();
    fetchClasses();
  }, []);

  // filter resources when search query updates WITH UPDATED RESOURCES TABLE STUFF
  useEffect(() => {
    if (resources.length > 0) {
      const filtered = resources.filter((resource) => {
        return (
          (resource.teacher &&
            resource.teacher
              .toLowerCase()
              .includes(resourceSearchQuery.toLowerCase())) ||
          (resource.course &&
            resource.course
              .toLowerCase()
              .includes(resourceSearchQuery.toLowerCase())) ||
          (resource.department &&
            resource.department
              .toLowerCase()
              .includes(resourceSearchQuery.toLowerCase()))
        );
      });
      setFilteredResources(filtered);
    }
  }, [resourceSearchQuery, resources]);

  // fetch posts from database
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/bulletin`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("error fetching posts:", error);
    }
  };

  // updated fetchResources to have the new structure of the resources table
  const fetchResources = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/resources`);
      const data = await response.json();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error("error fetching resources:", error);
    }
  };

  // fetch classes from database
  const fetchClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await fetch(`${baseUrl}/api/classes`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const classData = await response.json();

      // extract just the class names from the response
      const classNames = classData.map((classItem) => classItem.class_name);
      setClasses(classNames);

      console.log("Fetched classes from database:", classNames);
    } catch (error) {
      console.error("Error fetching classes:", error);
      // fallback to empty array if API fails
      setClasses([]);
    } finally {
      setIsLoadingClasses(false);
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
        const response = await fetch(`${baseUrl}/api/bulletin`, {
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
        const response = await fetch(`${baseUrl}/api/bulletin/${postId}`, {
          method: "DELETE",
        });

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

  // handle resource creation
  const handleResourceUpload = async () => {
    if (!resourceLink || !selectedClass) {
      alert("please enter a resource link and select a class.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher: "Admin",
          email: "admin@imsa.edu",
          course: selectedClass,
          department: "General",
          url: resourceLink,
          type: "link",
        }),
      });

      if (response.ok) {
        // refresh resources from database
        fetchResources();

        // clear form
        setResourceLink("");
        setSelectedClass(null);
        setSearchTerm("");

        alert("resource created successfully!");
      } else {
        alert("error creating resource. please try again.");
      }
    } catch (error) {
      console.error("error creating resource:", error);
      alert("error creating resource. please try again.");
    }
  };

  // handle deleting a resource
  const handleDeleteResource = async (resourceId) => {
    const resourceToDelete = resources.find(
      (resource) => resource.resource_id === resourceId
    );
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the resource for "${resourceToDelete.course}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${baseUrl}/api/resources/${resourceId}`, {
          method: "DELETE",
        });

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
    <div className="p-6 bg-gray-100 pt-14">
      <h1 className="text-4xl mb-6 text-center font-bold py-10 text-blue-500">
        Administrator Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="py-4 text-3xl font-bold mb-2 font-sans text-blue-500">
            Bulletin Board
          </h2>

          <h3 className="font-sans text-xl font-bold text-gray-600 mb-3  mt-2">
            Manage Posts
          </h3>
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
                    className="ml-2 text-blue-800 hover:text-blue-900 bg-transparent focus:outline-none"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <h3 className="font-sans text-xl font-bold text-gray-600 mb-2 mt-8">
            Create Post
          </h3>

          <p className="font-sans font-bold text-gray-700 text-left">
            Title of event:
          </p>
          <input
            type="text"
            placeholder="Enter event title..."
            value={newPost.title}
            onChange={(e) => handlePostInputChange("title", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans font-bold text-gray-700 text-left py-2">
            Date of event:
          </p>
          {/* IDK HOW TO STYLE THIS GOOD LUCK VISHNU!!! @vishnu @vishnu @vishnu @vishnu */}
          <input
            type="date"
            value={newPost.event_date}
            onChange={(e) =>
              handlePostInputChange("event_date", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white placeholder:text-gray-500 text-black"
          />

          <p className="font-bold py-2 font-sans text-gray-700 text-left">
            Author:
          </p>
          <input
            type="text"
            placeholder="Enter author name..."
            value={newPost.author}
            onChange={(e) => handlePostInputChange("author", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className=" font-bold py-2 font-sans text-gray-700 text-left">
            Contact Info:
          </p>
          <input
            type="text"
            placeholder="Enter contact information..."
            value={newPost.contact_info}
            onChange={(e) =>
              handlePostInputChange("contact_info", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-bold py-2 font-sans text-gray-700 text-left">
            Description:
          </p>
          <textarea
            placeholder="Enter event description..."
            value={newPost.content}
            onChange={(e) => {
              if (e.target.value.length <= 110) {
                handlePostInputChange("content", e.target.value);
              }
            }}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
            maxLength={110}
          />
          <div className="text-right text-sm text-gray-500 mb-2">
            {newPost.content.length}/110 characters
          </div>

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={newPost.highpriority}
              onChange={(e) =>
                handlePostInputChange("highpriority", e.target.checked)
              }
              className="mr-2 appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 accent-white"
            />
            <span className="font-sans text-gray-700">High Priority</span>
          </label>

          <button
            onClick={handleCreatePost}
            className="w-1/3 text-lg bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all duration-200"
          >
            Post
          </button>
        </div>

        <div className="rounded-2xl shadow-md p-4 bg-white border">
          <h2 className="py-4 text-3xl font-bold mb-2 font-sans text-blue-500">
            Resource Management
          </h2>
          <h3 className="font-sans text-lg font-bold text-gray-600 mb-3">
            Add Resource
          </h3>

          <p className="font-sans mb-2 text-left text-gray-700 font-bold">
            Select a class:
          </p>
          <input
            type="text"
            placeholder={
              isLoadingClasses ? "Loading classes..." : "Search for a class..."
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={selectedClass !== null || isLoadingClasses}
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

          <p className="font-sans text-left text-gray-700 py-2  font-bold">
            Link(s) of resources:
          </p>
          <input
            type="text"
            placeholder="Enter resource link (URL)..."
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />
          <div className="py-2"></div>
          <button
            onClick={handleResourceUpload}
            className="w-1/3 text-lg bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all duration-200"
          >
            Create Resource
          </button>

          <p className="font-sans mt-4 text-left text-gray-700 font-bold py-2">
            Search Supporting Materials:
          </p>
          <input
            type="text"
            placeholder="Search by teacher, course, or department..."
            value={resourceSearchQuery}
            onChange={(e) => setResourceSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
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
                    {resource.teacher} - {resource.course} (
                    {resource.department})
                  </span>
                  <button
                    onClick={() => handleDeleteResource(resource.resource_id)}
                    className="ml-2 text-blue-800 hover:text-blue-900 bg-transparent focus:outline-none"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
