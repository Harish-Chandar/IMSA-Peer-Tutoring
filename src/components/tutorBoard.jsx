import { useState, useEffect } from "react";
import "./../App.css";
import TutorNote from "./tutorNote";
import { API_URL } from "../config.js";

function TutorBoard() {
  const [tutorNotes, setTutorNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        console.log('Fetching tutor data...');
        console.log(API_URL)
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
      <h1 className="text-4xl text-blue-500 font-bold mb-8">Available Tutors</h1>
      <button className="!bg-slate-200 hover:!border-slate-300 !border-2 text-blue-500 mt-3 px-4 py-2 rounded">Find All Tutors</button>
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
    </div>
  );
}

export default TutorBoard;
