// In your ResourceEditCard.jsx or equivalent component
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ResourceEditCard({ result }) {
    // Changed from SearchResultCard to ResourceEditCard
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <div className="block mb-2">
                <h3 className="text-xl font-bold text-gray-700">{result.course}</h3>
                <p className="text-gray-600">Teachers: {result.teacher}</p>
                <p className="text-gray-600">Department: {result.department}</p>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
                <button
                    onClick={() => navigate(`/resources/${result.resource_id}/edit-info`)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Edit Course Info
                </button>
                <button
                    onClick={() => navigate(`/resources/${result.resource_id}/edit`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Edit Resource Links
                </button>
            </div>
        </div>
    );
}

export default ResourceEditCard; // Make sure export matches component name
