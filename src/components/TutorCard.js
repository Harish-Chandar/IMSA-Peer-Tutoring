import React from "react";

// parse one subject's string into an array of all classes tutor teaches in that subject
// in original strings, _ are spaces in classes and ; are used to separate classes
function parseClass(subject) {
  // use regex to replace all underscores with spaces and split by semicolon
  const spaceClasses = subject.replace(/_/g, " ");
  const newClasses = spaceClasses.split(";").map((course) => course.trim());
  return newClasses;
}

function TutorCard({
  name,
  wing,
  hall,
  routing_link,
  image,
  physics,
  chem,
  biology,
  sciother,
  mathother,
  mathcore,
  cs,
  language,
}) {
  // create array of all classes tutor teaches
  const subjects = {
    physics,
    chem,
    biology,
    sciother,
    mathother,
    mathcore,
    cs,
    language,
  };
  const taughtClasses = [];
  Object.values(subjects).forEach((subject) => {
    if (subject) {
      taughtClasses.push(...parseClass(subject));
    }
  });

  console.log(taughtClasses);

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
          {/* in the future, make this display 3 classes that the tutor chooses? */}
          <span className="font-bold">Classes: </span>
          {taughtClasses.join(", ")}
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
