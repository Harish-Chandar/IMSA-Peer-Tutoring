import { useState, useEffect } from "react";
import "./../App.css";
import Note from "./BulletinNote.jsx";
// import {API_URL} from "../config.js";

function Bulletin() {
	const [bulletinNotes, setBulletinNotes] = useState([]);
	const [error, setError] = useState(null);

	const API_URL = 'localhost:5000/api'
	useEffect(() => {
		const fetchBulletinData = async () => {
			console.log('Fetching bulletin data...');
			const response = await fetch(`${API_URL}/bulletin`);

			if (!response.ok) {
				throw new Error(`ERROR`);
			}

			const data = await response.json();

			// Sort the data by event_date in ascending order (oldest first)
			const sortedData = data.sort((a, b) => {
				return new Date(a.event_date) - new Date(b.event_date);
			});

			setBulletinNotes(sortedData);
			setError(null);
		};

		fetchBulletinData();
	}, []);

	return (
		<div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center font-sans shadow-2xl">
		<h1 className="text-4xl text-gray-700 font-bold mb-8">Bulletin Board</h1>
		<div className="flex flex-row flex-wrap justify-center gap-4 w-full">
		{bulletinNotes.map(note => (
			<Note
			key={note.id}
			title={note.title}
			course={note.course}
			teachers={note.teachers}
			location="IN2"
			date={note.event_date}
			time={note.time}
			color={note.highpriority}
			/>
		))}
		</div>
		</div>
	);
}

export default Bulletin;
