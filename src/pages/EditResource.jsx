import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";

function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch resource and its links
    const fetchResource = async () => {
      try {
        const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
        const response = await fetch(`${baseUrl}/api/resources/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch resource: ${response.status}`);
        }

        const data = await response.json();
        setResource(data);

        // Set links from the API response
        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
          setLinks(data.links);
        } else if (data.url) {
          // Handle legacy resource with just a URL
          setLinks([
            {
              link_id: 0,
              label: "Main Resource",
              url: data.url,
              isLegacy: true,
            },
          ]);
        } else {
          setLinks([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleNewLinkChange = (field, value) => {
    setNewLink({
      ...newLink,
      [field]: value,
    });
  };

  const addNewLink = async () => {
    // Validate input
    if (!newLink.label.trim() || !newLink.url.trim()) {
      alert("Please provide both a label and URL for the new link");
      return;
    }

    // Add https:// if missing
    if (
      !newLink.url.startsWith("http://") &&
      !newLink.url.startsWith("https://")
    ) {
      newLink.url = "https://" + newLink.url;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
      const response = await fetch(`${baseUrl}/api/resources/${id}/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLink),
      });

      if (!response.ok) {
        throw new Error("Failed to add link");
      }

      const data = await response.json();

      // Add the new link with the ID from the server
      setLinks([...links, { ...newLink, link_id: data.linkId }]);

      // Reset new link form
      setNewLink({ label: "", url: "" });
    } catch (err) {
      alert(`Error adding link: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeLink = async (linkId, index) => {
    if (window.confirm("Are you sure you want to remove this link?")) {
      setIsSubmitting(true);

      try {
        // For legacy links that don't have an ID in the database
        if (links[index].isLegacy) {
          // Special handling for legacy links - update the main resource URL
          const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
          await fetch(`${baseUrl}/api/resources/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: "" }),
          });
        } else {
          // Normal link deletion
          const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
          const response = await fetch(
            `${baseUrl}/api/resources/${id}/links/${linkId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete link");
          }
        }

        // Remove the link from the UI
        const updatedLinks = [...links];
        updatedLinks.splice(index, 1);
        setLinks(updatedLinks);
      } catch (err) {
        alert(`Error removing link: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  if (!resource)
    return <div className="text-center p-10">Resource not found</div>;

  return (
    <div className="min-h-screen w-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-gray-700 font-bold">
            Edit Resource: {resource.course}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/resources/modify")}
              className="bg-blue-200 text-blue-800 px-4 py-2 rounded hover:bg-blue-300"
            >
              Back to Search
            </button>
            <button
              onClick={() => navigate(`/resources/${id}`)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to Resource
            </button>
          </div>
        </div>

        {/* Resource Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-lg text-gray-700 font-semibold mb-2">
            Resource Information
          </h2>
          <p className="text-gray-700">
            <strong>Course:</strong> {resource.course}
          </p>
          <p className="text-gray-700">
            <strong>Department:</strong> {resource.department}
          </p>
          <p className="text-gray-700">
            <strong>Teacher:</strong> {resource.teacher}
          </p>
          <p className="text-gray-700">
            {" "}
            <strong>Email:</strong> {resource.email}
          </p>
        </div>

        {/* Current Links */}
        <div className="mb-8">
          <h2 className="text-xl text-gray-700 font-semibold mb-4">
            Current Links
          </h2>

          {links.length === 0 && (
            <p className="text-gray-500 italic">
              No links available for this resource.
            </p>
          )}

          {links.map((link, index) => (
            <div
              key={link.link_id || index}
              className="flex items-center mb-3 p-3 border rounded"
            >
              <div className="flex-grow">
                <p className="text-gray-900 font-medium">{link.label}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>
              <button
                onClick={() => removeLink(link.link_id, index)}
                disabled={isSubmitting}
                className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Link */}
        <div className="border-t pt-6">
          <h2 className="text-xl text-gray-700 font-semibold mb-4">
            Add New Link
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Link Label</label>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => handleNewLinkChange("label", e.target.value)}
                className="w-full border p-2 rounded bg-white text-gray-700"
                placeholder="e.g., Lecture Notes, Practice Problems"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => handleNewLinkChange("url", e.target.value)}
                className="w-full border p-2 rounded bg-white text-gray-700"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            onClick={addNewLink}
            disabled={isSubmitting || !newLink.label || !newLink.url}
            className={`px-4 py-2 rounded  ${
              isSubmitting || !newLink.label || !newLink.url
                ? "bg-blue-200 cursor-not-allowed text-blue-800"
                : "bg-blue-600 hover:bg-blue-700 text-blue-800"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Link"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditResource;
