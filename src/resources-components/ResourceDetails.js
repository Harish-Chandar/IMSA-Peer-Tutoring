import NavBar from "../resources-components/NavBar.jsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import testimage from "../resource-images/gateway-arch.png";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [links, setLinks] = useState([]); // Add state for links
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const baseUrl = `http://${HOST}:${DBPORT}`;
        const response = await fetch(`${baseUrl}/api/resources/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResource(data);

        // Handle links data
        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
          // If API returns links array
          setLinks(data.links);
        } else if (data.url) {
          // Fallback to single URL if no links array
          setLinks([{ link_id: 0, label: "Main Resource", url: data.url }]);
        } else {
          setLinks([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!resource) {
    return <div>No resource found</div>;
  }

  return (
    <div className="bg-[#F1F1F1] min-h-screen pt-16">
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
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl h-[calc(100vh-8rem)] mx-auto overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-4">
              {resource.course}
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Department:</strong> {resource.department}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Teacher:</strong> {resource.teacher}
            </p>

            {/* Multiple Links Section */}
            <div className="space-y-3 mt-4">
              {links.map((link, index) => (
                <div key={link.link_id || index} className="mb-3">
                  <p className="text-md text-gray-700 mb-1 font-medium">
                    {link.label}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition w-full text-center block"
                  >
                    View {link.label}
                  </a>
                </div>
              ))}

              {links.length === 0 && (
                <p className="text-gray-500 italic">No resources available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetails;
