import { useState, useEffect } from "react";
import "./../App.css";
import TutorNote from "./TutorNote.jsx";
// import { API_URL } from "../config.js";

function TutorBoard() {
  const [tutorNotes, setTutorNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
		  const API_URL = 'localhost:5000/api'
        const response = await fetch(`${API_URL}/tutors`);
        
        if (!response.ok) {
          throw new Error(`Error fetching tutors`);
        }
        
        const data = await response.json();
        setTutorNotes(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError(error.message);
      }
    };

    fetchTutorData();
  }, []);

  return (
    <div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center font-sans shadow-2xl">
      <h1 className="text-4xl text-grey-700 font-bold mb-8">Available Tutors</h1>
      <button className="!bg-slate-200 hover:!border-slate-300 !border-2 text-blue-500 mt-3 px-4 py-2 rounded"><a href="/findTutors">Find All Tutors</a></button>
      {tutorNotes.length > 0 && (
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full mt-8">
        {tutorNotes.map(tutor => (
          <TutorNote
            key={tutor.id}
            name={`${tutor.fname} ${tutor.lname}`}
            hall={`${tutor.hall} ${tutor.wing}-Wing`}
            classes={tutor.courses}
            img={tutor.image}
          />
        ))}
      </div>
      )}
      {tutorNotes.length === 0 && (
        <div className="text-gray-500 text-2xl flex flex-1 items-center">No tutors currently available</div>
      )}
    </div>
  );
}

export default TutorBoard;
