import React from 'react'
import { useState } from "react";
import TutorCard from "../components/TutorCard";

function FindTutors() {
    const [tutors, setTutors] = useState([
      {
        name:"Aarav Shah",
        wing:"D",
        hall:"1505",
        classes:["Advanced Topics", "MI 1/2", "Anatomy and Physiology"],
        routing_link:"/tutor/ashah",
        image:"/ashah.jpg",
      },
      {
        name:"Aarav Shah",
        wing:"D",
        hall:"1505",
        classes:["Advanced Topics", "MI 1/2", "Anatomy and Physiology"],
        routing_link:"/tutor/ashah",
        image:"/ashah.jpg",
      },
      {
        name:"Aarav Shah",
        wing:"D",
        hall:"1505",
        classes:["Advanced Topics", "MI 1/2", "Anatomy and Physiology"],
        routing_link:"/tutor/ashah",
        image:"/ashah.jpg",
      },
      {
        name:"Aarav Shah",
        wing:"D",
        hall:"1505",
        classes:["Advanced Topics", "MI 1/2", "Anatomy and Physiology"],
        routing_link:"/tutor/ashah",
        image:"/ashah.jpg",
      },
      {
        name:"Aarav Shah",
        wing:"D",
        hall:"1505",
        classes:["Advanced Topics", "MI 1/2", "Anatomy and Physiology"],
        routing_link:"/tutor/ashah",
        image:"/ashah.jpg",
      },
    ]);
    
    const [searchQuery, setSearchQuery] = useState("");

    const addTutor = () => {
      setTutors([...tutors, {
        name: "INSERT NEW INFORMATION HERE (NAME)",
        wing: "NEW WING",
        hall: "NEW HALL",
        classes: ["NEW CLASSES"],
        routing_link: "NEW ROUTE",
        image: "NEW IMAGE",
      }]);
    };

    const removeFilter = (filterToRemove) => {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== filterToRemove));
    };


    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterDropdown, setFilterDropdown] = useState(false); 
    const filterOptions = ["1501", "1502", "1503", "1504", "1505", "1506", "1507"];

    const addFilter = (filter) => {
      if (!selectedFilters.includes(filter)) {
        setSelectedFilters([...selectedFilters, filter]);
      }
      setFilterDropdown(false);
    };

    const handleSearch = () => {
      alert(`Searching for: ${searchQuery}`); 
      // PUT YOUR SEARCHING LOGIC HERE
    };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-5xl mb-6 text-center font-sans font-bold tracking-wide text-gray-700">Find Tutors Below!</h1>
        <h1 className="text-xl mb-6 text-center font-sans text-gray-700">Sort by hall, subject, and more!</h1>
        <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 text-blue-500 focus:outline-none"/>
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 text-3xl">⌕</button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative">
            <button className="w-40 p-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold bg-white hover:bg-blue-100" onClick={() => setFilterDropdown(!filterDropdown)}>+ Add Filter</button>
            {filterDropdown && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                {filterOptions.map((filter, index) => (
                  <button key={index} className="w-full text-left p-2 hover:bg-blue-100" onClick={() => addFilter(filter)}>{filter}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter, index) => (
              <span key={index} className="flex items-center bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {filter}
                <button className="ml-2 text-blue-900 hover:text-red-600 font-bold" onClick={() => removeFilter(filter)}>×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center mt-6">
          {tutors.map((tutor, index) => (
            <TutorCard key={index} {...tutor} />
          ))}
        </div>
      </div>
    </div>
  );
}
  

export default FindTutors
