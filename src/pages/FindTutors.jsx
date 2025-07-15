import React, { useState, useEffect } from "react";
import TutorCard from "../components/TutorCard";

function FindTutors() {
  const [tutors, setTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const filterOptions = [
    "1501",
    "1502",
    "1503",
    "1504",
    "1505",
    "1506",
    "1507",
  ];

  // automatically fetch tutors when loaded
  useEffect(() => {
    fetchTutors();
  }, []);

  // automatically update search results when searchQuery or selectedFilters change
  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedFilters]);

  const fetchTutors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tutors/search");
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("name", searchQuery);
      if (selectedFilters.length > 0)
        queryParams.append("hall", selectedFilters.join(","));

      const response = await fetch(
        `http://localhost:5000/api/tutors/search?${queryParams.toString()}`
      );
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error("Error searching tutors:", error);
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
    <div className="bg-gray-100 min-h-screen py-20">
      
      <div className="p-4 max-w-6xl mx-auto py-10">
        <h1 className="text-5xl mb-6 text-center font-sans font-bold tracking-wide text-gray-700">
          Find Tutors Below!
        </h1>
        <h1 className="text-xl mb-6 text-center font-sans text-gray-700">
          Sort by hall, subject, and more!
        </h1>
        <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 text-blue-500 focus:outline-none bg-white"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 text-3xl pb-4"
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
          {tutors.map((tutor, index) => (
            <TutorCard
              key={index}
              name={`${tutor.fname} ${tutor.lname}`}
              wing={tutor.wing}
              hall={tutor.hall}
              routing_link={`/tutor/${tutor.id}`}
              image={tutor.image || "https://placehold.co/600x600"}
              physics={tutor.physics}
              chem={tutor.chem}
              biology={tutor.biology}
              sciother={tutor.sciother}
              mathother={tutor.mathother}
              mathcore={tutor.mathcore}
              cs={tutor.cs}
              language={tutor.language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindTutors;
