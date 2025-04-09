import React from "react";

import { SearchResult } from "./SearchResult.jsx";

export const SearchResultsList = ({ results }) => {
  return (
    <div className="w-full bg-white block shadow-[0_0_8px_#ddd] rounded-[10px] mt-4 max-h-[300px] overflow-y-scroll">
      {results.map((result, id) => {
        // change to db stuff
        return <SearchResult result={result.name} key={id} />; // change to db stuff
      })}
    </div>
  );
};
