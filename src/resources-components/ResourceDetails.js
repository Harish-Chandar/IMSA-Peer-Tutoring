import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ResourceDetails() {
    const { id } = useParams(); // get the resource id from the URl
    const [resource, setResource] = useState(null); // state to hold the resource data
    const [loading, setLoading] = useState(true); // state to manage loading state
    const [error, setError] = useState(null); // state to manage error state

    useEffect(() => {
        const fetchResource = async () => {
            try{
                const baseUrl = `http://${HOST}:${DBPORT}`; // avoid hardcoding urls 
                const response = await fetch(`${baseUrl}/api/resources/${id}`); // fetch resource data from the API
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); // handle errors
                }
                const data = await response.json();
                setResource(data); // set the resource data to state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // set loading to false after fetching the data

            }
        };
        fetchResource();
    }, [id]);
    if(loading) {
        return <div>Loading...</div>; // show loading message while fetching data
    }
    if(error) {
        return <div>Error: {error}</div>; // show error message if there is an error
    }
    if(!resource) {
        return <div>No resource found</div>; // show message if no resource is found
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section: Image */}
                <div className="flex justify-center items-center">
                    <img
                        src="https://via.placeholder.com/400x300" // Replace with a relevant image URL
                        alt="Resource"
                        className="rounded-lg shadow-md"
                    />
                </div>

                {/* Right Section: Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">{resource.course}</h1>
                    <p className="text-lg text-gray-700 mb-2">
                        <strong>Teacher:</strong> {resource.teacher}
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Department:</strong> {resource.department}
                    </p>
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                    >
                        View Resource
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ResourceDetails;