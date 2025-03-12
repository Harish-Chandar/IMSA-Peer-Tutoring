import React from "react";

function TutorCard({ name, wing, hall, classes, routing_link, image }) {
  return (
    <div className="relative w-64 h-[22rem] flex flex-col items-center">
      <img
        src={image}
        alt={`${name}`}
        className="w-70 h-60 object-cover rounded-xl border-4 border-white shadow-lg"
      />
      
      <div className="absolute bottom-0 w-full bg-white rounded-xl p-4 shadow-md text-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600"> {hall}, {wing} wing</p>
        <p className="text-sm text-gray-700">
          Classes: {classes.join(", ")}
        </p>
        <a href={routing_link} className="text-blue-500 font-medium mt-2 block">
          View Profile →
        </a>
      </div>
    </div>
  );
}

export default TutorCard;
