import React from 'react'

import { SearchResult } from "./SearchResult.jsx";

export const SearchResultsList = ({results}) => {
    return (
        <div classname = "results-list">
                {results.map((result, id) => { // change to db stuff
                    return <SearchResult result = {result.name} key = {id}/> // change to db stuff
                })}
        </div>
    )
}