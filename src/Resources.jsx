import { useState } from "react";
import "./Resources.jsx";
import "./Resources.css";
import { SearchBar } from "./resources-components/SearchBar.jsx";
import { SearchResultsList } from "./resources-components/SearchResultsList.jsx";
import ResourceHero from "./resources-components/ResourceHero.jsx";

export const Resources = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="Resources">
      <ResourceHero />
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
    </div>
  );
};
