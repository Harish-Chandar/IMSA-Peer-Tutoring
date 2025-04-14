import { useState } from "react";
import "./../App.css";
import TutorNote from "./tutorNote";

function TutorBoard() {
  return (
    <div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center font-sans shadow-2xl">
        <h1 className="text-4xl text-blue-500 font-bold mb-8">Available Tutors</h1>
        <button className="!bg-slate-200 hover:!border-slate-300 !border-2 text-blue-500 mt-3 px-4 py-2 rounded">Filter (Hall)</button>
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full mt-8">
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
