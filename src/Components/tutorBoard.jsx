import { useState } from "react";
import "./../App.css";
import TutorNote from "./tutorNote";

function TutorBoard() {
  

  return (
    <div className="p-10 bg-slate-50 rounded-lg w-250 h-120 display: flex justify-center items-center flex-col font-sans shadow-2xl">
        <h1 className="text-4xl text-blue-500 font-bold">Available Tutors</h1>
        <button className="slate-50 text-blue-500 border-slate-100">Filter (Hall)</button>
         <div className="flex flex-row">
         
          <TutorNote
            name="Aarav Shah"
            hall="1505 A Wing"
            classes="MI 1/2, Ad Tops"
          />
          <TutorNote 
            title="Aarav is so cute"
            classy="Multi-Variable Calculus"
            teacher="Dr.Trimm"
            location="IN2"
            date="2/14/2025"
            time="3:00 AM"
            color="red"
          />
          <TutorNote
            title="Vishnu needs to lock-in"
            classy="Multi-Variable Calculus"
            teacher="Dr.Trimm"
            location="IN2"
            date="2/14/2025"
            time="3:00 AM"
            color="blue"
          />

         </div>

      </div>
  );
}

export default TutorBoard;
