import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users") // change to db. Replace fetch with SQL query (SELECT * FROM classes IN resources). Goal is to build an array of search results, no duplicate classes as well
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          ); // Change this to reflect db values <!>
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search for any class or department..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
