import { useState } from "react";
import "./../App.css";

function Note({ title, course, teachers, date, color, contact, description, image}) {
  const colorClasses = {
    0: "bg-[#c1e6fd]",
    1: "bg-[#48a4ea]",
  };
  const [finalColor, setFinalColor] = useState(colorClasses[color] || "bg-[#48a4ea]");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={`w-60 h-80 shadow-2xl rounded-2xl m-5 relative hover:scale-105 duration-300 flex flex-col ${finalColor}`}>
        <div className="p-4 pb-0 flex-1 flex flex-col justify-between">
          <h3 className="text-black font-bold text-lg mb-1">{title}</h3>
          <h3 className="text-black text-sm mb-1">{course}</h3>
          <h3 className="text-black text-sm mb-1"><b>Author:</b> {teachers}</h3>
          <h3 className="text-black text-sm mb-1"><b>Date:</b> {date}</h3>
          <h3 className="text-black text-sm mb-1"><b>Contact:</b> {contact}</h3>
          <h3 className="text-black text-sm"><b>Description:</b> {description}</h3>
        </div>  
        <div className={`rounded-2xl w-full h-full relative p-2`}>
          <img 
            className="h-full w-full object-cover rounded-2xl cursor-pointer"
            src={image}
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative inline-block"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 text-white text-3xl pb-1 font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition"
              onClick={() => setModalOpen(false)}>×</button>
            <img
              src={image}
              className="rounded-2xl h-[90vh] max-w-[80vw] w-auto object-cover shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Note;
