import { useState } from "react";
import "./../App.css";

function Note({ classy, department, teachers }) {

  

  return (
    <div className={`w-60 h-60 p-4 shadow-2xl rounded-lg m-5`}>

      <h3 className="font-sans text-black"><b>{classy}</b></h3>
      <h3 className="font-sans text-black">{department}</h3>
      <h3 className="font-sans text-black"><b>Teachers:</b> {teachers}</h3>
      <div className= " shadow-2xl rounded-lg p-1 w-50 h-30 self-center ">
        <img className="self-end h-full w-full object-cover rounded-lg" src="" alt="Image" />
      </div>
    </div>
  );
}

export default Note;
