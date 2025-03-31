import { useState } from "react";
import "./../App.css";
import Note from "./note";

function Bulletin() {
  

  return (
    <div className="p-10 bg-slate-50 rounded-lg w-250 h-120 display: flex justify-center items-center flex-col font-sans shadow-2xl">
        <h1 className="text-4xl text-neutral-700 font-bold">Bulletin Board</h1>
         <div className="flex flex-row">
         
          <Note
            title="hello pookie"
            classy="Multi-Variable Calculus"
            teacher="Dr.Trimm"
            location="IN2"
            date="2/14/2025"
            time="3:00 AM"
            color="yellow"
          />
          <Note 
            title="Aarav is so cute"
            classy="Multi-Variable Calculus"
            teacher="Dr.Trimm"
            location="IN2"
            date="2/14/2025"
            time="3:00 AM"
            color="red"
          />
          <Note
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

export default Bulletin;
