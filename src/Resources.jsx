import { useState } from "react";
import "./Resources.jsx";
import { SearchBar } from "./components/SearchBar.jsx";
import { SearchResultsList } from "./components/SearchResultsList.jsx";

export const Resources = () => {

    const [results, setResults] = useState([]);

    return(
        <div className = "Resources">
            <div className = "search-bar-container">
                <SearchBar setResults = {setResults}/>
                <SearchResultsList results ={results}/>
            </div>
        </div>
    )
}

