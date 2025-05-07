import React from 'react'

function AddTutor() {
  return (
    <div>
      <h1 className="text-4xl font-sans mb-6 text-center">Add Tutor</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow-md p-4 bg-white border">
                <p className="font-sans">Name of tutor:</p>
                <input type="text" placeholder="Enter tutor name here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Facebook name of tutor (leave blank if same as tutor name)</p>
                <input type="text" placeholder="Enter tutor fb name here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Email of tutor:</p>
                <input type="email" placeholder="Enter tutor email here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans"></p>
                <p className="font-sans">ID Number of tutor:</p>
                <input type="text" placeholder="Enter tutor ID number here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Blurb of tutor:</p>
                <textarea placeholder="Enter tutor blurb here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <p className="font-sans">Hall of tutor:</p>
                <input type="text" placeholder="Enter tutor hall here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Image of tutor:</p>
                <input type="file" accept="image/*" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Availability, formatted like:“sunday,5:30-6:00,6:00-6:30,7:00-7:30;tuesday,9:00-9:30,9:30-10:00,10:30-11:00”:</p>
                <input type="text" placeholder="Enter tutor availability here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p className="font-sans">Subjects of tutor:</p>
                <input type="text" placeholder="Enter tutor subjects here..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans mt-4">Add Tutor</button>
                
            </div>
            <div className="rounded-2xl shadow-md p-4 bg-white border">
                <h3 className="font-sans text-lg mt-4 py-2">Delete tutor:</h3>
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
            </div>
        </div>
    </div>
  )
}

export default AddTutor
