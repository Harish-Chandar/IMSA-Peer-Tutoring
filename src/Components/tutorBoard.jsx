import { useState } from "react";
import "./../App.css";
import TutorNote from "./tutorNote";

function TutorBoard() {
  

  return (
    <div className="p-10 pb-25 bg-slate-50 rounded-lg w-250 h-120 display: flex justify-center items-center flex-col font-sans shadow-2xl">
        <h1 className="text-4xl text-blue-500 font-bold">Available Tutors</h1>
        <button className=" bg-slate-50 text-blue-500 mt-3">Filter (Hall)</button>
         <div className="flex flex-row">
         
          <TutorNote
            name="Aarav Shah"
            hall="1505 A Wing"
            classes="MI 1/2, Ad Tops"
          />
          <TutorNote 
            name="Aarav Shah"
            hall="1505 A Wing"
            classes="MI 1/2, Ad Tops"
          />
          <TutorNote
            name="Aarav Shah"
            hall="1505 A Wing"
            classes="MI 1/2, Ad Tops"
          />

         </div>

      </div>
  );
}

export default TutorBoard;
