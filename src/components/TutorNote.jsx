import { useState } from "react";
import "./../App.css";

function TutorNote({id, name, hall,classes,img }) {

  return (
    <div className={`w-60 h-60 shadow-2xl rounded-lg m-5 mb-20 relative hover:scale-105 duration-300`}>
      <a href={`/tutor/${id}`}>
        <img className="self-end h-full w-full object-cover rounded-2xl border-4 border-blue-300 hover:border-blue-500" src={img} alt="placeholder" />
      <div className={`bg-slate-50 shadow-2xl rounded-2xl p-2 md:px-5 w-50 relative bottom-10`}>
        <h3 className="text-black text-lg"><b>{name}</b></h3>
        <h3 className="text-gray-500 text-sm">{hall}</h3>
        <h3 className="text-gray-700 text-sm"><b>Classes:</b> {classes}</h3>
      </div>
      </a>
    </div>
  );
}

export default TutorNote;
