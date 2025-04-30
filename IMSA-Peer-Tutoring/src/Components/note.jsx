import { useState } from "react";
import "./../App.css";

function Note({ title, course, teachers, location, date, time, color }) {

    // All the colors needed for the background of notes
const colorClasses = {
    1: "bg-[#c1e6fd]", 
    2: "bg-[#5ebcf9]", 
    3: "bg-[#48a4ea]", 
    blue: "bg-blue-100",
};

  return (
    <div className={`w-60 h-60 p-4 shadow-2xl rounded-lg m-5 ${colorClasses[color]} relative hover:scale-105 duration-300`}>
        <h3 className="font-sans text-black"><b>{title}</b></h3>
        <h3 className="font-sans text-black">{course}</h3>
        <h3 className="font-sans text-black"><b>Teachers:</b> {teachers}</h3>
        <h3 className="font-sans text-black"><b>Location:</b> {location}</h3>
        <h3 className="font-sans text-black"><b>Date:</b> {date}</h3>
        <h3 className="font-sans text-black"><b>Time:</b> {time}</h3>
      <div className={`${colorClasses[color]} shadow-2xl rounded-lg p-1 w-50 h-30 self-center`}>
        <img className="self-end h-full w-full object-cover rounded-lg" src="/assets/in2.jpg" alt="placeholder" />
      </div>
    </div>
  );
}

export default Note;
