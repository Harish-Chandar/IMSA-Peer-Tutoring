import React, { useState, useEffect } from "react";
import ResourceEditCard from "../components/ResourceEditCard";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ModifyResources() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const url = `http://${HOST}:${DBPORT}/api/resources/departments`;
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

      const url = `http://${HOST}:${DBPORT}/api/resources/search?${params.toString()}`;
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
    <div className="bg-[#F1F1F1] min-h-screen w-full">
      <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-16">
        <h1 className="text-3xl text-gray-700 font-bold text-center mb-6">
          Modify Resources
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Search Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Search Resources</label>
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full p-3 border rounded bg-white"
              placeholder="Search by course, teacher, or department..."
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-gray-700 mb-2">
              Filter by Department
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(departments) ? (
                departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentChange(dept)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedDepartments.includes(dept)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {dept}
                  </button>
                ))
              ) : (
                <p>Loading departments...</p>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="results-container">
          {results.length > 0 ? (
            results.map((result) => (
              <ResourceEditCard key={result.resource_id} result={result} />
            ))
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                {input
                  ? "No resources found. Try a different search term."
                  : "Enter a search term to find resources to modify."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModifyResources;
