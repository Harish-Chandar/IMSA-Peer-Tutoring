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
    const resourceImage2 = {
        "English" : "/ClassImages/english2.png",
        "Math" : "/ClassImages/math2.png",
        "Science" : "/ClassImages/science2.png",
        "World Languages" : "/ClassImages/worldlanguages2.png",
        "Computer Science" : "/ClassImages/computerscience2.png",
        "Wellness" : "/ClassImages/wellness2.png",
    }

    console.log(department);

  return (
    <div
      className={`w-60 h-60 shadow-2xl rounded-lg m-5 relative hover:scale-105 duration-300`}
    >
      <img
        className="self-end h-full w-full object-cover rounded-lg "
        src={resourceImage[department]}
        alt="placeholder"
      />
      <div
        className={`bg-slate-50 shadow-2xl rounded-lg p-1 w-50 h-30 mx-auto relative bottom-10`}
      >
        <h3 className="font-sans text-neutral-600">
          <b>{course}</b>
        </h3>
        <h3 className="font-sans text-neutral-600">{department}</h3>
        <h3 className="font-sans text-neutral-600">
          <b>Teacher:</b> {teacher}
        </h3>
      </div>
    </div>
  );
}

export default ResourceCard;
