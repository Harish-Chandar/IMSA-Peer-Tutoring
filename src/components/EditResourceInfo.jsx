import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";

import { isTokenExpired } from "../util.ts";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function EditResourceInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || isTokenExpired(token)) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

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
                        "Authorization": `Bearer ${token}`,
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

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-100 pt-14 min-h-screen">
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-600">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-100 pt-14 min-h-screen">
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-red-600">Error: {error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-between items-center mb-6 py-10">
                <button
                    onClick={() => navigate('/resources/modify')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Back to Search
                </button>

                <h1 className="text-4xl font-bold text-gray-700">
                    Edit Course Information
                </h1>

                <div className="w-40"></div>
            </div>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">Teacher Name</label>
                            <input
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                name="teacher"
                                value={formData.teacher}
                                onChange={handleChange}
                                placeholder="Teacher name"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">Email</label>
                            <input
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">Course</label>
                            <input
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="Course name"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">Department</label>
                            <select
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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

                        {/* <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Resource Type</label>
              <input
                className="border rounded p-2 bg-white text-gray-900"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Resource type (e.g., PDF, Video, Link, etc.)"
              />
            </div> */}

                        <div className="flex space-x-4 pt-6">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/resources/modify`)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditResourceInfo;