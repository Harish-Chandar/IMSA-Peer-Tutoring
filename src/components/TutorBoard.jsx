import { useState, useEffect } from "react";
import "./../App.css";
import TutorNote from "./TutorNote.jsx";

function TutorBoard() {
  const [tutorNotes, setTutorNotes] = useState([]);
  const [error, setError] = useState(null);
  const port = process.env.DB_API_PORT || 5000;

  // got from tutorcard
  function assignWing(wingNum) {
    return String.fromCharCode(wingNum + 64);
  }

  function getCourses(tutor){
    let classes = [];
    if(tutor.mathcore !== ""){
      classes = classes.concat(tutor.mathcore.replace(/_/g, ' ').split(";"))
    }
    if(tutor.physics !== ""){
      classes = classes.concat(tutor.physics.replace(/_/g, ' ').split(";"))
    }
    if(tutor.chem !== ""){
      classes = classes.concat(tutor.chem.replace(/_/g, ' ').split(";"))
    } 
    if(tutor.biology !== ""){
      classes = classes.concat(tutor.biology.replace(/_/g, ' ').split(";")) 
    }
    if(tutor.cs !== ""){
      classes = classes.concat(tutor.cs.replace(/_/g, ' ').split(";"))
    }
    if(tutor.sciother !== ""){
      classes = classes.concat(tutor.sciother.replace(/_/g, ' ').split(";"))
    }
    if(tutor.mathother !== ""){
      classes = classes.concat(tutor.mathother.replace(/_/g, ' ').split(";"))
    }
    if(tutor.language !== ""){
      classes = classes.concat(tutor.language.replace(/_/g, ' ').split(";"))  
    }

    while(classes.length > 3){
      classes.pop();
    }

    return classes.join(', ');
  }
  

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
		  const API_URL = 'http://localhost:5000/api'
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
        {tutorNotes
        .filter(tutor => tutor.is_available === 1)
        .map(tutor => {    
          tutor.courses = getCourses(tutor);
          return (
            <TutorNote
              key={tutor.id}
              id={tutor.id}
              name={`${tutor.fname} ${tutor.lname}`}
              hall={`${tutor.hall} ${assignWing(tutor.wing)}-Wing`}
              classes={tutor.courses}
              img={tutor.image}
            />
          );
        })}
      </div>
      )}
      {tutorNotes.length === 0 && (
        <div className="text-gray-500 text-2xl flex flex-1 items-center">No tutors currently available</div>
      )}
    </div>
  );
}

export default TutorBoard;
