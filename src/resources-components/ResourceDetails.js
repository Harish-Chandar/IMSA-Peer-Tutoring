import NavBar from "../resources-components/NavBar.jsx";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import testimage from "../resource-images/gateway-arch.png";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [links, setLinks] = useState([]);
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
          setLinks(data.links);
        } else if (data.url) {
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
    return (
      <div className="bg-[#F1F1F1] min-h-screen pt-16">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F1F1F1] min-h-screen pt-16">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="bg-[#F1F1F1] min-h-screen pt-16">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">No resource found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      <NavBar />

      {/* Mobile-friendly container */}
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto mt-16">
        {/* Mobile: stacked layout, Desktop: side-by-side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Image Section - smaller on mobile */}
          <div className="order-1 lg:order-1">
            <div className="h-48 sm:h-64 lg:h-[calc(100vh-10rem)]">
              <img
                src={testimage}
                alt="Resource"
                className="h-full w-full rounded-lg shadow-md object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="order-2 lg:order-2 bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full lg:h-[calc(100vh-10rem)] lg:overflow-y-auto">
            {/* Course title - responsive text size */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-3 lg:mb-4">
              {resource.course}
            </h1>

            {/* Resource info - responsive text and spacing */}
            <div className="space-y-2 mb-4">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                <strong>Department:</strong> {resource.department}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                <strong>Teacher:</strong> {resource.teacher}
              </p>
              {resource.email && (
                <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                  <strong>Email:</strong> {resource.email}
                </p>
              )}
              {resource.type && (
                <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                  <strong>Type:</strong> {resource.type}
                </p>
              )}
            </div>

            {/* Links Section */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">
                Resources
              </h2>

              {links.map((link, index) => (
                <div key={link.link_id || index} className="space-y-2">
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    {link.label}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow hover:bg-blue-600 transition w-full text-center block text-sm sm:text-base"
                  >
                    View {link.label}
                  </a>
                </div>
              ))}

              {links.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic text-sm sm:text-base">
                    No resources available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetails;
