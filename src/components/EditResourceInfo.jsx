import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function EditResourceInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teacher: "",
    email: "",
    course: "",
    department: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch resource data
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(
          `http://${HOST}:${DBPORT}/api/resources/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch resource");
        }

        const data = await response.json();
        setFormData({
          teacher: data.teacher || "",
          email: data.email || "",
          course: data.course || "",
          department: data.department || "",
          type: data.type || "",
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://${HOST}:${DBPORT}/api/resources/${id}/info`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      alert("Resource updated successfully!");
      navigate(`/resources/modify`); // Navigate back to modify page
    } catch (err) {
      setError(err.message);
      alert(`Error updating resource: ${err.message}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#F1F1F1] min-h-screen w-screen">
      <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Resource Information
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
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Course</label>
            <input
              className="border rounded p-2"
              name="course"
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

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/resources/modify`)}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResourceInfo;
