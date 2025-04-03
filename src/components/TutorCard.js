import React from "react";

function TutorCard({ name, wing, hall, classes, routing_link, image }) {
  return (
    <div className="relative w-64 h-[22rem] flex flex-col items-center">
      <img
        src={image || "https://placehold.co/600x400"}
        alt={`${name}`}
        className="w-60 h-50 object-cover rounded-3xl border-4 border-blue-300 shadow-lg"
      />

      <div className="absolute bottom-0 w-full bg-white rounded-xl p-4 shadow-md text-center">
        <h3 className="text-lg font-semibold font-sans">{name}</h3>
        <p className="text-sm text-gray-400 font-sans">
          {" "}
          {hall}, {wing} wing
        </p>
        <p className="text-sm text-gray-700 font-sans">
          <span className="font-bold">Classes: </span> {classes.join(", ")}
        </p>
        <a
          href={routing_link}
          className="text-blue-500 font-medium mt-2 block "
        >
          View Profile →
        </a>
      </div>
    </div>
  );
}

export default TutorCard;
