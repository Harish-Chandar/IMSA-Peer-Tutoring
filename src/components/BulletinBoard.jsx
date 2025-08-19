import { useState, useEffect } from "react";
import "./../App.css";
import Note from "./BulletinNote.jsx";

function Bulletin() {
    const [bulletinNotes, setBulletinNotes] = useState([]);
    const [error, setError] = useState(null);
    // i (atharv) added the http:// it was causing network errors

    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const API_URL = `http://${HOST}:${DBPORT}/api`;

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

            for (let i = 0; i < sortedData.length; i++) {
                console.log(sortedData[i].event_date);
                if(sortedData[i].event_date < new Date().getDay()) {
                    sortedData.splice(i, 1);
                    i--;
                }
            }

            setBulletinNotes(sortedData);
            setError(null);
        };

        fetchBulletinData();
    }, []);

    return (
        <div className="p-10 bg-slate-50 rounded-lg w-full max-w-6xl mx-auto h-auto min-h-[500px] flex flex-col items-center shadow-2xl">
            <h1 className="text-4xl text-black font-bold mb-8">Bulletin</h1>

            {bulletinNotes.length > 0 &&

                <div className="flex flex-row flex-wrap justify-center gap-2 w-full">
                    {bulletinNotes.map((note) => (
                        <Note
                            key={note.id}
                            title={note.title}
                            course={note.course}
                            teachers={note.author}
                            date={new Date(note.event_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                            contact={note.contact_info}
                            color={note.highpriority}
                            description={note.content}
                            image={note.image}
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
