import { useState, useEffect } from "react";
import "./../App.css";
import Note from "./BulletinNote.jsx";
// import {API_URL} from "../config.js";

function Bulletin() {
  const [bulletinNotes, setBulletinNotes] = useState([]);
  const [error, setError] = useState(null);
  // i (atharv) added the http:// it was causing network errors
  const API_URL = "http://localhost:5000/api";
  useEffect(() => {
    const fetchBulletinData = async () => {
      const response = await fetch(`${API_URL}/bulletin`);

      if (!response.ok) {
        throw new Error(`ERROR`);
      }

      const data = await response.json();

      const sortedData = data.sort((a, b) => {
        return new Date(a.event_date) - new Date(b.event_date);
      });

      setBulletinNotes(sortedData);
      setError(null);
    };

    fetchBulletinData();
  }, []);

  return (
    <div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center font-sans shadow-2xl">
      <h1 className="text-4xl text-gray-700 font-bold mb-8">Bulletin</h1>

      {bulletinNotes.length > 0 && 

      <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
        {bulletinNotes.map((note) => (
          <Note
            key={note.id}
            title={note.title}
            course={note.course}
            teachers={note.author}
            date={note.event_date.split(" ")[0]}
            time={note.event_date.split(" ")[1]}
            contact={note.contact_info}
            color={note.highpriority}
            description={note.content}
          />
        ))}
      </div>}
      {bulletinNotes.length === 0 && (
        <div className="text-gray-500 text-2xl flex flex-1 items-center">No upcoming events</div>
      )}
    </div>
  );
}

export default Bulletin;
