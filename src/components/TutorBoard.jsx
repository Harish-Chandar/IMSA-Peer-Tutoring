import { apiFetch as fetch } from "../apiFetch.js";
import { useState, useEffect } from "react";
import "./../App.css";
import TutorNote from "./TutorNote.jsx";
import TutorCard from "./TutorCard.jsx";

function TutorBoard() {
	const [tutorNotes, setTutorNotes] = useState([]);
	const [error, setError] = useState(null);

	const DBPORT = process.env.REACT_APP_DBPORT;
	const HOST = process.env.REACT_APP_HOST;
	const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';
	const protocol = DEV_SERVER ? 'http' : 'https';
	const API_URL = `${protocol}://${HOST}:${DBPORT}/api`;

	// got from tutorcard
	function assignWing(wingNum) {
		return String.fromCharCode(wingNum + 64);
	}

	function getCourses(tutor) {
		let classes = [];
		if (tutor.mathcore !== "") {
			classes = classes.concat(
				tutor.mathcore.replace(/_/g, " ").split(";")
			);
		}
		if (tutor.physics !== "") {
			classes = classes.concat(
				tutor.physics.replace(/_/g, " ").split(";")
			);
		}
		if (tutor.chem !== "") {
			classes = classes.concat(tutor.chem.replace(/_/g, " ").split(";"));
		}
		if (tutor.biology !== "") {
			classes = classes.concat(
				tutor.biology.replace(/_/g, " ").split(";")
			);
		}
		if (tutor.cs !== "") {
			classes = classes.concat(tutor.cs.replace(/_/g, " ").split(";"));
		}
		if (tutor.sciother !== "") {
			classes = classes.concat(
				tutor.sciother.replace(/_/g, " ").split(";")
			);
		}
		if (tutor.mathother !== "") {
			classes = classes.concat(
				tutor.mathother.replace(/_/g, " ").split(";")
			);
		}
		if (tutor.language !== "") {
			classes = classes.concat(
				tutor.language.replace(/_/g, " ").split(";")
			);
		}

		while (classes.length > 3) {
			classes.pop();
		}

		return classes.join(", ");
	}

	useEffect(() => {
		const fetchTutorData = async () => {
			try {
				const response = await fetch(`${API_URL}/tutors`);

				if (!response.ok) {
					throw new Error(`Error fetching tutors`);
				}

				const data = await response.json();
				setTutorNotes(data);
				setError(null);
			} catch (error) {
				console.error("Error fetching tutors:", error);
				setError(error.message);
			}
		};

		fetchTutorData();
	}, []);

	return (
		<div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center shadow-2xl">
			<h1 className="text-4xl text-black font-bold mb-8">
				Currently Active Tutors
			</h1>
			<button className="bg-blue-500 text-white py-2 px-4 rounded">
				<a href="/findTutors">Find All Tutors</a>
			</button>
			{tutorNotes.length > 0 && (
				<div className="flex flex-row flex-wrap justify-center gap-4 w-full mt-8">
					{tutorNotes
						.filter((tutor) => tutor.is_available === 1)
						.map((tutor, index) => {
							tutor.courses = getCourses(tutor);
							return (
								<TutorCard
									key={index}
									name={`${tutor.fname} ${tutor.lname}`}
									wing={tutor.wing}
									hall={tutor.hall}
									routing_link={`/tutor/${tutor.id}`}
									image={tutor.image}
									physics={tutor.physics}
									chem={tutor.chem}
									biology={tutor.biology}
									sciother={tutor.sciother}
									mathother={tutor.mathother}
									mathcore={tutor.mathcore}
									cs={tutor.cs}
									language={tutor.language}
								/>
							);
						})}
				</div>
			)}
			{tutorNotes.length === 0 && (
				<div className="text-gray-500 text-2xl flex flex-1 items-center">
					No tutors currently available
				</div>
			)}
		</div>
	);
}

export default TutorBoard;
