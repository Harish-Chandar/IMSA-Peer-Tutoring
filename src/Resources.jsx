import { useState } from "react";
import "./Resources.jsx";
import { SearchBar } from "./resources-components/SearchBar.jsx";
import { SearchResultsList } from "./resources-components/SearchResultsList.jsx";
import ResourceHero from "./resources-components/ResourceHero.jsx";
import NavBar from "./resources-components/NavBar.jsx";
import ResourceBoard from "./resources-components/ResourceBoard.jsx";
import ResourceCard from "./resources-components/ResourceCard.jsx";


export const Resources = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="flex flex-col w-full">
      <NavBar />
      <ResourceHero />
      <div className="mx-auto w-1/2">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
      <ResourceBoard />
    </div>
  );
};
