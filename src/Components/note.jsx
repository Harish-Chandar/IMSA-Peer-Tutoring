import { useState } from "react";
import "./../App.css";

function Note({ title, classy, teacher, location, date, time, color }) {

  // All the colors needed for the background of notes
  const colorClasses = {
    yellow: "bg-yellow-100",
    red: "bg-red-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
  };

  return (
    <div className={`w-60 h-60 p-4 shadow-2xl rounded-lg m-5 ${colorClasses[color]}`}>
      <div className="flex flex-row justify-end">
        <img className="absolute w-10 self-end" src="/assets/paperclip.png" alt="placeholder" />
      </div>
        <h3 className="font-sans text-black"><b>{title}</b></h3>
        <h3 className="font-sans text-black">{classy}</h3>
        <h3 className="font-sans text-black"><b>Teachers:</b> {teacher}</h3>
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
