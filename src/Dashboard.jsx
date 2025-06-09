import React from 'react'

function Dashboard() {
    // Populate from database later
    const classes = [
        'MI 1/2', 'SI Chemistry', 'SI Physics', 'Advanced Topics'
      ];
      
      const [searchTerm, setSearchTerm] = React.useState('');
      const [selectedClass, setSelectedClass] = React.useState(null);
      
      const filteredClasses = classes.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const handleSelectClass = (className) => {
        setSelectedClass(className);
        setSearchTerm('');
      };

    return (   
    <div className="p-6 bg-gray-100">
        <h1 className="text-4xl font-sans mb-6 text-center font-bold py-10">Administrator Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl shadow-md p-4 bg-white border">
                <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">Tutor Management</h2>
                {/* ROUTE TO THE ADD TUTOR PAGE */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">Add / Delete Tutor →</button>
                
                <p className="font-sans text-lg py-3 font-bold">Submit hours for a tutor:</p>
                <p className="font-sans py-1">Name of tutor:</p>
                <input type="text" placeholder="The name of the tutor..." className="w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <div className="w-full h-60 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2 scroll-auto">
                    {/* SOMETHING NEEDS TO HAPPEN WHEN YOU CHANGE THE SEARCH FIELD - IMPLEMENT SEARCH ALGORITHM */}
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor Name - Tutor Email</span> <button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Tutor Name - Tutor Email</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                </div>
                <p className="font-sans py-2">Start hours for tutor:</p>
                <input type="time" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans py-2">End hours for tutor:</p>
                <input type="time" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans py-2">Date of hours:</p>
                <input type="date" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">Submit</button>
                {/* IMPROVE LEVEL OF SECURITY FOR THIS SECTION */}
                <p className="font-sans py-2">Approve hours for tutors:</p>
                <div className="w-full h-60 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2 scroll-auto">
                    {/* SOMETHING NEEDS TO HAPPEN WHEN YOU CHANGE THE SEARCH FIELD - IMPLEMENT SEARCH ALGORITHM */}
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Aarav Shah - 18,394 hours - 5/7/25 <br></br>1:00 am - 2:00 pm</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Tutor name - hours - date - time</span> <button className="rounded-md py-1 px-1 ml-2 text-white bg-green-400 hover:bg-green-600">Approve</button> <button className="rounded-md py-1 px-1 ml-2 text-white bg-red-400 hover:bg-red-600">Decline</button></div>
                </div>


            </div>

            <div className="rounded-2xl shadow-md p-4 bg-white border">
                <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">Bulletin Board</h2>
                <h3 className="font-sans text-lg font-bold">Create new post:</h3>
                <p className="font-sans">Name of event:</p>
                <input type="text" placeholder="Enter event name..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans">Date of event:</p>
                <input type="date" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans">Time of event:</p>
                <input type="time" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans">Location of event:</p>
                <input type="text" placeholder="Enter event location..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <p className="font-sans">Short description of event:</p>
                <textarea placeholder="Enter event description..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></textarea>
                {/* SOMETHING NEEDS TO HAPPEN WHEN YOU CLICK THIS BUTTON */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">Post</button>
                <h3 className="font-sans text-lg mt-4">Current posts:</h3>
                <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
                    {/* SOMETHING NEEDS TO HAPPEN WHEN YOU CLICK THE X BUTTON ON EACH ITEM IN THE LIST */}
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Study Session in IN2 - 5/12/25</span> <button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Event Name - Event Date</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>Event Name - Event Date</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                </div>
            </div>

            <div className="rounded-2xl shadow-md p-4 bg-white border">
                <h2 className="text-xl font-semibold mb-2 font-sans text-blue-500">Class Management</h2>
                <input
                type="text"
                placeholder="Search for a class..."
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={selectedClass !== null}
                />

                {searchTerm && !selectedClass && (
                    <ul className="border rounded-md bg-white shadow-md mt-1 max-h-40 overflow-y-auto">
                        {filteredClasses.length > 0 ? (
                        filteredClasses.map((className, idx) => (
                            <li
                            key={idx}
                            onClick={() => handleSelectClass(className)}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                            {className}
                            </li>
                        ))
                        ) : (
                        <li className="px-3 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                )}

                {selectedClass && (
                    <div className="mt-3 bg-blue-200 text-blue-800 px-3 py-2 rounded flex justify-between items-center w-fit">
                        <span>{selectedClass}</span>
                        <button className="ml-2 text-blue-800 hover:text-blue-900 font-bold" onClick={() => setSelectedClass(null)} >×</button>
                    </div>
                )}
                <p>Upload Supporting Materials:</p>
                <input type="file" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans">Upload</button>
                <p className="font-sans">Delete Supporting Materials:</p>
                <input type="text" placeholder="The name of the file..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></input>
                <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
                    {/* SOMETHING NEEDS TO HAPPEN WHEN YOU CLICK THE X BUTTON ON EACH ITEM IN THE LIST */}
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"> <span>Item name</span> <button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                    <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"><span>MI4 study sheet</span><button className="ml-2 text-blue-800 hover:text-blue-900">×</button></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
