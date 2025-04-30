import React, { useState, useEffect } from "react";
import ResourceCard from "./resources-components/ResourceCard.jsx";
import ResourceHero from "./resources-components/ResourceHero.jsx";
import NavBar from "./resources-components/NavBar.jsx";
import { Link } from "react-router-dom";

function FindResources() {
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterDropdown, setFilterDropdown] = useState(false);
    const filterOptions = [
      "English",
      "Fine Arts",
      "History & Social Science",
      "Mathematics & CS",
      "Science",
      "Wellness",
      "World Languages",
    ];
  
    // automatically fetch resources when loaded
    useEffect(() => {
      fetchResources();
    }, []);
  
    // automatically update search results when searchQuery or selectedFilters change
    useEffect(() => {
      handleSearch();
    }, [searchQuery, selectedFilters]);
  
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/resources/search");
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };
  
    const handleSearch = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("searchQuery", searchQuery);
        if (selectedFilters.length > 0)
          queryParams.append("department", selectedFilters.join(","));
        
        console.log("Query Params:", queryParams.toString()); // Debugging

        const response = await fetch(
          `http://localhost:5000/api/resources/search?${queryParams.toString()}` // change hardcoding
        );
        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Search Results:", data); // Debugging
        setResources(data);
      } catch (error) {
        console.error("Error searching resources:", error);
        setResources([]); // Clear resources on error
      }
    };
  
    const addFilter = (filter) => {
      if (!selectedFilters.includes(filter)) {
        setSelectedFilters([...selectedFilters, filter]);
      }
      setFilterDropdown(false);
    };
  
    const removeFilter = (filterToRemove) => {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter !== filterToRemove)
      );
    };
    return (
        <div className="bg-[#F1F1F1] min-h-screen">
            <div className="bg-gray-100">
                <NavBar />
                <ResourceHero />
            </div>
            <div className="p-4 max-w-6xl mx-auto">
                <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden bg-white">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {setSearchQuery(e.target.value);
                          console.log("Search Query:", e.target.value); // Debugging
                        }}
                        className="w-full p-3 text-blue-500 focus:outline-none bg-white"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 text-3xl"
                    >
                        ⌕
                    </button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <div className="relative">
                        <button
                            className="w-40 p-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold bg-white hover:bg-blue-100"
                            onClick={() => setFilterDropdown(!filterDropdown)}
                        >
                            + Add Filter
                        </button>
                        {filterDropdown && (
                            <div className="absolute mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                                {filterOptions.map((filter, index) => (
                                    <button
                                        key={index}
                                        className="w-full text-left p-2 hover:bg-blue-100"
                                        onClick={() => addFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedFilters.map((filter, index) => (
                            <span
                                key={index}
                                className="flex items-center bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                                {filter}
                                <button
                                    className="ml-2 text-blue-900 hover:text-red-600 font-bold"
                                    onClick={() => removeFilter(filter)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center mt-6">
                    {resources.length > 0 ? (
                        resources.map((resource, index) => (
                            <Link to={`/resources/${resource.resource_id}`} key={index}> 
                                <ResourceCard
                                    course={resource.course}
                                    teacher={resource.teacher}
                                    department={resource.department}
                                    url={resource.url}
                                    type={resource.type}
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-6">No resources found.</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default FindResources;

