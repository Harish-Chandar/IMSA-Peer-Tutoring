import { apiFetch as fetch } from "../apiFetch.js";
import React, { useState, useEffect } from "react";
import ResourceEditCard from "../components/ResourceEditCard";
import Footer from "../components/Footer.jsx";
import { useNavigate } from 'react-router-dom';

import { isTokenExpired, getTokenAccess } from "../util.ts"

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;
const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';

function ModifyResources() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("session");
        if (!token || isTokenExpired(token)) {
            navigate('/login', { replace: true });
        }
        if (token && !isTokenExpired(token) && (getTokenAccess(token) < 1 || getTokenAccess(token) > 2)) {
            navigate('/adminDashboard');
        }
    }, []);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const protocol = DEV_SERVER ? 'http' : 'https';
                const url = `${protocol}://${HOST}:${DBPORT}/api/resources/departments`;
                console.log("Fetching departments from:", url);

                const response = await fetch(url);
                const text = await response.text(); // Get raw text first
                console.log("Raw department response:", text);

                let data;
                try {
                    data = JSON.parse(text); // Try to parse as JSON
                    console.log("Parsed departments:", data);
                } catch (e) {
                    console.error("Failed to parse department data as JSON:", e);
                    setDepartments([]);
                    return;
                }

                if (Array.isArray(data)) {
                    // Filter out "Resource not found" if it exists
                    const filteredDepts = data.filter(
                        (dept) => dept !== "Resource not found"
                    );
                    setDepartments(filteredDepts);
                } else {
                    setDepartments([]);
                    console.error("Unexpected departments data format:", data);
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
                setDepartments([]);
            }
        };

        fetchDepartments();
    }, []);

    // Load all resources when component mounts
    useEffect(() => {
        fetchResults("", []);
    }, []);

    // Handle search input changes
    const handleInputChange = (value) => {
        console.log("Search input changed to:", value);
        setInput(value);
        fetchResults(value, selectedDepartments);
    };

    // Handle department filter changes
    const handleDepartmentChange = (dept) => {
        const updatedDepartments = selectedDepartments.includes(dept)
            ? selectedDepartments.filter((d) => d !== dept)
            : [...selectedDepartments, dept];

        setSelectedDepartments(updatedDepartments);
        fetchResults(input, updatedDepartments);
    };

    // Fetch search results
    const fetchResults = async (query, departments) => {
        try {
            // Build the query parameters - UPDATED to match FindResources.js
            let params = new URLSearchParams();
            if (query) params.append("searchQuery", query); // Changed from "query" to "searchQuery"
            if (departments.length > 0)
                params.append("department", departments.join(","));

            console.log("Search params:", params.toString()); // Debug

            const protocol = DEV_SERVER ? 'http' : 'https';
            const url = `${protocol}://${HOST}:${DBPORT}/api/resources/search?${params.toString()}`;
            console.log("Fetching from:", url); // Debug

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Search results:", data); // Debug
            setResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setResults([]); // Clear results on error
        }
    };

    return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-between items-center mb-6 py-10">
                <button
                    onClick={() => navigate('/adminDashboard')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold text-gray-700">
                    Modify Course Information
                </h1>

                <div className="w-40"></div>
            </div>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    {/* Search Input */}
                    <div className="flex flex-col mb-6">
                        <label className="text-gray-700 font-bold mb-2">Search Resources</label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            placeholder="Search by course, teacher, or department..."
                        />
                    </div>

                    {/* Department Filter */}
                    <div className="flex flex-col mb-8">
                        <label className="text-gray-700 font-bold mb-2">
                            Filter by Department
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(departments) ? (
                                departments.map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => handleDepartmentChange(dept)}
                                        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${selectedDepartments.includes(dept)
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                            }`}
                                    >
                                        {dept}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500">Loading departments...</p>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="border-t pt-6 mt-6">
                        <div className="results-container space-y-4">
                            {results.length > 0 ? (
                                results.map((result) => (
                                    <ResourceEditCard key={result.resource_id} result={result} />
                                ))
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border">
                                    <p className="text-gray-500 text-lg">
                                        {input || selectedDepartments.length > 0
                                            ? "No resources found. Try a different search term or filter."
                                            : "Enter a search term or select departments to find resources to modify."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ModifyResources;
