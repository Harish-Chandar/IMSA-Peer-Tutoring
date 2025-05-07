import NavBar from "../resources-components/NavBar.jsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import testimage from "../resource-images/gateway-arch.png";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ResourceDetails() {
  const { id } = useParams(); // get the resource id from the URl
  const [resource, setResource] = useState(null); // state to hold the resource data
  const [loading, setLoading] = useState(true); // state to manage loading state
  const [error, setError] = useState(null); // state to manage error state

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const baseUrl = `http://${HOST}:${DBPORT}`; // avoid hardcoding urls
        const response = await fetch(`${baseUrl}/api/resources/${id}`); // fetch resource data from the API
        if (!response.ok) {
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
  if (loading) {
    return <div>Loading...</div>; // show loading message while fetching data
  }
  if (error) {
    return <div>Error: {error}</div>; // show error message if there is an error
  }
  if (!resource) {
    return <div>No resource found</div>; // show message if no resource is found
  }

  return (
    <div className="bg-[#F1F1F1] min-h-screen pt-16">
      {" "}
      <div className="bg-gray-100">
        <NavBar />
      </div>
      <div className="p-4 max-w-6xl mx-auto mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section: Image */}
          <div className="flex-grow h-[calc(100vh-8rem)]">
            <img
              src={testimage}
              alt="Resource"
              className="h-full w-full rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Right Section: Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl h-[calc(100vh-8rem)] mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">
              {resource.course}
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Department:</strong> {resource.department}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Teacher:</strong> {resource.teacher}
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition w-full text-center block"
            >
              View Resource
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetails;
