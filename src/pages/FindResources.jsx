import React, { useState, useEffect } from "react";
import ResourceCard from "../components/ResourceCard.jsx";
import ResourceHero from "../components/ResourceHero.jsx";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

import { departments } from "../util.ts"; 

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;

function FindResources() {
	const baseUrl = `http://${HOST}:${DBPORT}`;

	const [resources, setResources] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [filterDropdown, setFilterDropdown] = useState(false);

	// Updated filter options to match actual database departments
	// const departments = [
	// 	"Computer Science",
	// 	"Math",
	// 	"Science",
	// 	"English",
	// 	"Wellness",
	// 	"World Languages",
	// ];

	// automatically fetch resources when loaded
	useEffect(() => {
		fetchResources();
	}, []);

	// automatically update search results when searchQuery or selectedFilters change
	useEffect(() => {
		handleSearch();
	}, [searchQuery, selectedFilters]);

	const fetchResources = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/resources/search`);
			const data = await response.json();
			setResources(data);
		} catch (error) {
			console.error("Error fetching resources:", error);
		}
	};

	const handleSearch = async () => {
		try {
			const queryParams = new URLSearchParams();
			if (searchQuery) queryParams.append("searchQuery", searchQuery);
			if (selectedFilters.length > 0)
				queryParams.append("department", selectedFilters.join(","));

			console.log("Query Params:", queryParams.toString()); // Debugging

			const response = await fetch(
				`${baseUrl}/api/resources/search?${queryParams.toString()}` // change hardcoding
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log("Fetched Search Results:", data); // Debugging
			setResources(data);
		} catch (error) {
			console.error("Error searching resources:", error);
			setResources([]); // Clear resources on error
		}
	};

	const addFilter = (filter) => {
		if (!selectedFilters.includes(filter)) {
			setSelectedFilters([...selectedFilters, filter]);
		}
		setFilterDropdown(false);
	};

	const removeFilter = (filterToRemove) => {
		setSelectedFilters(
			selectedFilters.filter((filter) => filter !== filterToRemove)
		);
	};
	return (
		<div className="bg-[#e4e5e3] min-h-screen">
			<Navbar />

			<ResourceHero />

			<div className="p-2 sm:p-4 max-w-6xl mx-auto">
				<div className="flex flex-row items-center border-2 border-blue-500 rounded-lg overflow-hidden bg-white mb-4">
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							console.log("Search Query:", e.target.value);
						}}
						className="w-full p-4 text-blue-500 focus:outline-none bg-white text-sm sm:text-base"
					/>
					<button
						onClick={handleSearch}
						className="bg-blue-500 text-white px-4 md:px-6 py-2 hover:bg-blue-600 text-3xl pb-4"
					>
						⌕
					</button>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
					<div className="relative">
						<button
							className="w-full sm:w-40 p-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold bg-white hover:bg-blue-100 text-sm sm:text-base"
							onClick={() => setFilterDropdown(!filterDropdown)}
						>
							+ Add Filter
						</button>
						{filterDropdown && (
							<div className="absolute mt-2 w-full sm:w-40 bg-white border border-gray-300 shadow-lg rounded-lg z-50 max-h-60 overflow-y-auto">
								{departments.map((filter, index) => (
									<button
										key={index}
										className="w-full bg-white text-gray-700 text-left p-2 hover:bg-blue-100 text-sm sm:text-base"
										onClick={() => addFilter(filter)}
									>
										{filter}
									</button>
								))}
							</div>
						)}
					</div>

					<div className="flex flex-wrap gap-1 sm:gap-2">
						{selectedFilters.map((filter, index) => (
							<span
								key={index}
								className="flex items-center bg-blue-200 text-blue-700 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold border-2 border-blue-200"
							>
								<span className="truncate max-w-24 sm:max-w-none">
									{filter}
								</span>
								<button
									className="ml-2 text-blue-900 hover:text-red-600 font-bold"
									onClick={() => removeFilter(filter)}
								>
									×
								</button>
							</span>
						))}
					</div>
				</div>

				{/* Mobile-friendly resource grid */}
				<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 justify-items-center mb-10">
					{resources.length > 0 ? (
						resources.map((resource, index) => (
							<Link
								to={`/resources/${resource.resource_id}`}
								key={index}
								className="w-full flex justify-center"
							>
								<ResourceCard
									course={resource.course}
									teacher={resource.teacher}
									department={resource.department}
                                    resource_id={resource.resource_id}
								/>
							</Link>
						))
					) : (
						<div className="col-span-full">
							<p className="text-gray-500 text-center py-8 text-sm sm:text-base">
								No resources found.
							</p>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default FindResources;
