import { useState } from "react";
import NavBar from "./resources-components/NavBar"; // Import NavBar component

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ResourceForm() {
  // Define preset departments
  const departments = [
    "English",
    "Fine Arts",
    "History & Social Science",
    "Mathematics & CS",
    "Science",
    "Wellness",
    "World Languages",
  ];

  const [formData, setFormData] = useState({
    teacher: "",
    email: "",
    course: "", // Changed from classes to course
    department: "", // Added department field
    url: "",
    type: "",
  });

  // Add state for managing multiple links
  const [links, setLinks] = useState([{ label: "Main Resource", url: "" }]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle changes to link inputs
  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);

    // Also update the main URL field for backward compatibility
    if (index === 0 && field === "url") {
      setFormData({ ...formData, url: value });
    }
  };

  // Add a new link input
  const addLink = () => {
    setLinks([...links, { label: "", url: "" }]);
  };

  // Remove a link input
  const removeLink = (index) => {
    if (links.length > 1) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const resourceData = {
      ...formData,
      links: links.map((link) => ({
        label: link.label,
        url: link.url,
      })),
    };

    const baseUrl = `http://${HOST}:${DBPORT}`;
    try {
      const response = await fetch(`${baseUrl}/api/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceData),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          teacher: "",
          email: "",
          course: "", // Changed from classes
          department: "", // Added
          url: "",
          type: "",
        });
        setLinks([{ label: "Main Resource", url: "" }]);
        alert("Resource added successfully!");
      } else {
        alert("Error adding resource: " + data.error);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      <NavBar />
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-16">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Resource
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Teacher Name</label>
            <input
              className="border rounded p-2"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              placeholder="Teacher name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Email</label>
            <input
              className="border rounded p-2"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Course</label>
            <input
              className="border rounded p-2"
              name="course" // Changed from classes to course
              value={formData.course}
              onChange={handleChange}
              placeholder="Course name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Department</label>
            <select
              className="border rounded p-2"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a department
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Resource Type</label>
            <input
              className="border rounded p-2"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Resource type (e.g., PDF, Video, Link, etc.)"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Resource Links</h3>

            {links.map((link, index) => (
              <div
                key={index}
                className="flex flex-col mb-4 p-3 border rounded bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Link #{index + 1}</span>
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex flex-col mb-2">
                  <label className="text-gray-700 mb-1">Label</label>
                  <input
                    className="border rounded p-2"
                    value={link.label}
                    onChange={(e) =>
                      handleLinkChange(index, "label", e.target.value)
                    }
                    placeholder="Link Label (e.g. Syllabus, Worksheet)"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1">URL</label>
                  <input
                    className="border rounded p-2"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLink}
              className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              + Add Another Link
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResourceForm;
