import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { isTokenExpired, getTokenAccess } from "../util.ts"

function EditResource() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const DEV_SERVER = process.env.DEV_SERVER === 'true';
    useEffect(() => {
        if (!token || isTokenExpired(token)) {
            navigate('/login', { replace: true });
        }
        if (token && !isTokenExpired(token) && (getTokenAccess(token) < 1 || getTokenAccess(token) > 2)) {
            navigate('/adminDashboard');
        }
    }, []);
    const { id } = useParams();
    // const navigate = useNavigate();

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
                const protocol = DEV_SERVER ? 'http' : 'https';
                const baseUrl = `${protocol}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
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
            const protocol = DEV_SERVER ? 'http' : 'https';
            const baseUrl = `${protocol}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
            const response = await fetch(`${baseUrl}/api/resources/${id}/links`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
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
                    const protocol = DEV_SERVER ? 'http' : 'https';
                    const baseUrl = `${protocol}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
                    await fetch(`${baseUrl}/api/resources/${id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ url: "" }),
                    });
                } else {
                    // Normal link deletion
                    const protocol = DEV_SERVER ? 'http' : 'https';
                    const baseUrl = `${protocol}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
                    const response = await fetch(
                        `${baseUrl}/api/resources/${id}/links/${linkId}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
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

    if (isLoading) return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">Loading...</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <div className="text-center py-8">
                        <p className="text-red-600 text-lg">Error: {error}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    if (!resource) return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">Resource not found</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="p-6 bg-gray-100 pt-14 min-h-screen">
            <div className="flex justify-between items-center mb-6 py-10">
                <button
                    onClick={() => navigate("/resources/modify")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Back to Search
                </button>

                <h1 className="text-4xl font-bold text-gray-700">
                    Edit {resource.course}
                </h1>

                <button
                    onClick={() => navigate(`/resources/${id}`)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Course Preview
                </button>
            </div>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">

                    {/* Resource Information */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Course Information
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                            <p className="text-gray-700">
                                <span className="font-semibold">Course:</span> {resource.course}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Department:</span> {resource.department}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Teacher:</span> {resource.teacher}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Email:</span> {resource.email}
                            </p>
                        </div>
                    </div>

                    {/* Current Links */}
                    <div className="mb-8 border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Current Links
                        </h2>

                        {links.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border">
                                <p className="text-gray-500 text-lg">
                                    No links available for this resource.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {links.map((link, index) => (
                                    <div
                                        key={link.link_id || index}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-grow min-w-0">
                                            <p className="text-gray-900 font-semibold text-lg ml-24">{link.label}</p>
                                            <p className="text-gray-600 text-sm truncate ml-24">{link.url}</p>
                                        </div>
                                        <button
                                            onClick={() => removeLink(link.link_id, index)}
                                            disabled={isSubmitting}
                                            className="ml-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add New Link */}
                    <div className="border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Add New Link
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Link Label</label>
                                <input
                                    type="text"
                                    value={newLink.label}
                                    onChange={(e) => handleNewLinkChange("label", e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    placeholder="e.g., Lecture Notes, Practice Problems"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2">URL</label>
                                <input
                                    type="text"
                                    value={newLink.url}
                                    onChange={(e) => handleNewLinkChange("url", e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    placeholder="https://google.com..."
                                />
                            </div>

                            <button
                                onClick={addNewLink}
                                disabled={isSubmitting || !newLink.label || !newLink.url}
                                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${isSubmitting || !newLink.label || !newLink.url
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {isSubmitting ? "Adding..." : "Add Link"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditResource;
