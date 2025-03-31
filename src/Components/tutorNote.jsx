import { useState } from "react";
import "./../App.css";

function TutorNote({ name, hall,classes }) {

  // All the colors needed for the background of notes
  const colorClasses = {
    yellow: "bg-yellow-100",
    red: "bg-red-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
  };

  return (
    <div className={`w-60 h-60 shadow-2xl rounded-lg m-5`}>
        <img className="self-end h-full w-full object-cover rounded-lg" src="/assets/in2.jpg" alt="placeholder" />
      <div className={`bg-slate-50 shadow-2xl rounded-lg p-1 w-50 h-30 self-center relative bottom-10`}>
        <h3 className="font-sans text-black"><b>{name}</b></h3>
        <h3 className="font-sans text-black">{hall}</h3>
        <h3 className="font-sans text-black"><b>Classes Taught:</b> {classes}</h3>
      </div>
    </div>
  );
}

export default TutorNote;
