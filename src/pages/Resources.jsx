import { useState } from "react";
import "./Resources.jsx";
import { SearchBar } from "./components/SearchBar.jsx";
import { SearchResultsList } from "./components/SearchResultsList.jsx";
import ResourceHero from "../components/ResourceHero.jsx";
import Navbar from "../components/Navbar.jsx";
import ResourceBoard from "../components/ResourceBoard.jsx";
import ResourceCard from "../components/ResourceCard.jsx";

export const Resources = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <ResourceHero />
      <div className="mx-auto w-1/2">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
      <ResourceBoard />
    </div>
  );
};
