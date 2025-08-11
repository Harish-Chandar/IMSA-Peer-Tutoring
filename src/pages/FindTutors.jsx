import React, { useState, useEffect } from "react";
import TutorCard from "../components/TutorCard";
import Footer from "../components/Footer";
import { classCategories } from "../util.ts";

function FindTutors() {
	// environment variables for API configuration
	const DBPORT = process.env.REACT_APP_DBPORT;
	const HOST = process.env.REACT_APP_HOST;
	const baseUrl = `http://${HOST}:${DBPORT}`;

	// default placeholder image URL from environment variable
	const DEFAULT_AVATAR_URL =
		process.env.REACT_APP_DEFAULT_AVATAR_URL ||
		"https://placehold.co/600x600";

	const [tutors, setTutors] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [filterDropdown, setFilterDropdown] = useState(false);
	const filterOptions = [
		"1501",
		"1502",
		"1503",
		"1504",
		"1505",
		"1506",
		"1507",
	];

	// automatically fetch tutors when loaded
	useEffect(() => {
		fetchTutors();
	}, []);

	// automatically update search results when searchQuery or selectedFilters change
	useEffect(() => {
		handleSearch();
	}, [searchQuery, selectedFilters]);

	const fetchTutors = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/tutors/search`);
			const data = await response.json();
			setTutors(data);
		} catch (error) {
			console.error("Error fetching tutors:", error);
		}
	};

	const handleSearch = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/tutors/search`);
			const data = await response.json();
			const lowerQuery = searchQuery.toLowerCase();

			const filtered = data.filter((tutor) => {
				// build an array of class names by splitting the stored DB string
				// replacing underscores with spaces, and trimming whitespace
				const classArray = Object.keys(classCategories).reduce(
					(arr, category) => {
						const dbVals = tutor[category] || "";
						const items = dbVals
							.split(";")
							.map((c) => c.replace(/_/g, " ").trim())
							.filter((c) => c.length > 0);
						return arr.concat(items);
					},
					[]
				);
				// join the class names into a single string for searching
				const classString = classArray.join(" ");

				// make big string to search against
				const source =
					`${tutor.fname} ${tutor.lname} ${tutor.hall} ${classString}`.toLowerCase();

				// skip tutors with incorrect hall if there's a filter
				if (
					selectedFilters.length > 0 &&
					!selectedFilters.includes(`${tutor.hall}`)
				) {
					return false;
				}

				return source.includes(lowerQuery);
			});
			setTutors(filtered);
		} catch (error) {
			console.error("Error searching tutors:", error);
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
			{/* Hero Section */}
			<div className="w-full h-16 pt-16"></div>
			<div className="flex flex-col md:flex-row justify-around w-full h-auto md:h-80 bg-slate-100 px-4">
				<div className="self-start flex flex-col text-left h-full justify-center py-8">
					<h1 className="text-gray-700 text-3xl md:text-4xl font-bold mb-5 md:mb-0">
						Find <span className="text-blue-500">tutors</span>{" "}
						below!
					</h1>
					<h2 className="text-gray-400 text-xl md:text-2xl font-normal mb-3">
						Sort by hall or subject!
					</h2>
				</div>
				<img
					src="GeneralImages/smartguy.png"
					alt="Tutor Hero"
					className="w-full md:w-auto max-w-xs h-64 object-contain mx-auto md:mx-0"
				/>
			</div>

			{/* Main Content */}
			<div className="p-4 max-w-6xl mx-auto py-10">
				{/* search bar and button */}
				<div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden">
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full p-4 text-blue-500 focus:outline-none bg-white"
					/>
					<button
						onClick={handleSearch}
						className="bg-blue-500 text-white px-4 py-4 hover:bg-blue-600 text-xl"
					>
						⌕
					</button>
				</div>
				<div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
					<div className="relative w-full sm:w-auto">
						<button
							className="w-full sm:w-40 p-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold bg-white hover:bg-blue-100 text-sm sm:text-base"
							onClick={() => setFilterDropdown(!filterDropdown)}
						>
							+ Add Filter
						</button>
						{filterDropdown && (
							<div className="absolute mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg z-50">
								{filterOptions.map((filter, index) => (
									<button
										key={index}
										className="w-full text-left p-2 hover:bg-blue-100"
										onClick={() => addFilter(filter)}
									>
										{filter}
									</button>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-2">
						{selectedFilters.map((filter, index) => (
							<span
								key={index}
								className="flex items-center bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-blue-200"
							>
								{filter}
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
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-6">
					{tutors.map((tutor, index) => (
						<TutorCard
							key={index}
							name={`${tutor.fname} ${tutor.lname}`}
							wing={tutor.wing}
							hall={tutor.hall}
							routing_link={`/tutor/${tutor.id}`}
							image={tutor.image || DEFAULT_AVATAR_URL}
							physics={tutor.physics}
							chem={tutor.chem}
							biology={tutor.biology}
							sciother={tutor.sciother}
							mathother={tutor.mathother}
							mathcore={tutor.mathcore}
							cs={tutor.cs}
							language={tutor.language}
						/>
					))}
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default FindTutors;
