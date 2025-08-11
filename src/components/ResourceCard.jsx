import { useState } from "react";
import "../App.css";

function ResourceCard({ course, teacher, department, url, type }) {
    // All the colors needed for the background of notes
    // const colorClasses = {
    //   yellow: "bg-yellow-100",
    //   red: "bg-red-100",
    //   green: "bg-green-100",
    //   blue: "bg-blue-100",
    // };

    const resourceImage = {
        "English" : "/ClassImages/english.png",
        "Math" : "/ClassImages/math.png",
        "Science" : "/ClassImages/science.png",
        "World Languages" : "/ClassImages/worldlanguages.png",
        "Computer Science" : "/ClassImages/computerscience.png",
        "Wellness" : "/ClassImages/wellness.png",
    }

    console.log(department);

  return (

    <div className="relative w-64 flex flex-col items-center">
            {/* Image container */}
            <div className="w-full h-64 overflow-hidden border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-b-none rounded-t-3xl z-0">
                <img
                    src={resourceImage[department]}
                    className="w-full h-full object-cover object-top"
                    style={{ aspectRatio: "600/600" }}
                />
            </div>

            <div className="w-full bg-white -mt-12 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
                <h3 className="text-lg font-semibold font-sans">{course}</h3>
                <p className="text-md text-gray-400 font-sans">
                    {department}
                </p>
                <div className="text-md text-gray-700 font-sans mt-2  overflow-hidden">
                    <span className="font-bold">Teacher: </span>
                    <span>{teacher}</span>
                </div>
            </div>
        </div>
  );
}

export default ResourceCard;
