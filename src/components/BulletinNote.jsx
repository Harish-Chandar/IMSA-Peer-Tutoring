import { useState } from "react";
import "./../App.css";

function Note({ title, course, teachers, date, color, contact,description }) {
  const colorClasses = {
    0: "bg-[#c1e6fd]",
    1: "bg-[#48a4ea]",
  };

  return (
    <div className={`w-60 h-80 shadow-2xl rounded-2xl m-5 relative hover:scale-105 duration-300 flex flex-col ${colorClasses[color]}`}>
      <div className="p-4 pb-0 flex-1 flex flex-col justify-between">
        <h3 className="font-sans text-black font-bold text-lg mb-1">{title}</h3>
        <h3 className="font-sans text-black text-sm mb-1">{course}</h3>
        <h3 className="font-sans text-black text-sm mb-1"><b>Author:</b> {teachers}</h3>
        <h3 className="font-sans text-black text-sm mb-1"><b>Date:</b> {date}</h3>
        <h3 className="font-sans text-black text-sm mb-1"><b>Contact:</b> {contact}</h3>
        <h3 className="font-sans text-black text-sm"><b>Description:</b> {description}</h3>
      </div>  
      <div className={`rounded-2xl w-full h-full relative p-2`}>
        <img className="h-full w-full object-cover rounded-2xl" src="/in2.jpg" alt="placeholder" />
      </div>
    </div>
  );
}

export default Note;
