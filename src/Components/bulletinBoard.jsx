import { useState } from "react";
import "./../App.css";
import Note from "./note";

function Bulletin() {
  

  // Array of bulletin notes
  const bulletinNotes = [
    {
      id: 1, 
      title: "hello pookie",
      course: "Multi-Variable Calculus",
      teachers: "Dr.Trimm",
      location: "IN2",
      date: "2/14/2025",
      time: "3:00 AM",
      color: "yellow"
    },
    {
      id: 2,
      title: "Aarav is so cute",
      course: "Multi-Variable Calculus",
      teachers: "Dr.Trimm",
      location: "IN2",
      date: "2/14/2025",
      time: "3:00 AM",
      color: "red"
    },
    {
      id: 3,
      title: "Vishnu needs to lock-in",
      course: "Multi-Variable Calculus",
      teachers: "Dr.Trimm",
      location: "IN2",
      date: "2/14/2025",
      time: "3:00 AM",
      color: "blue"
    }
  ];

  return (
    <div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center font-sans shadow-2xl">
        <h1 className="text-4xl text-neutral-700 font-bold mb-8">Bulletin Board</h1>
        <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
          {bulletinNotes.map(note => (
            <Note
              key={note.id}
              title={note.title}
              course={note.course}
              teachers={note.teachers}
              location={note.location}
              date={note.date}
              time={note.time}
              color={note.color}
            />
          ))}
        </div>
    </div>
  );
}

export default Bulletin;
