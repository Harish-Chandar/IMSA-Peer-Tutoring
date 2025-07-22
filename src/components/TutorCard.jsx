import React from "react";

// default placeholder image URL from environment variable
const DEFAULT_AVATAR_URL = process.env.REACT_APP_DEFAULT_AVATAR_URL || "https://placehold.co/600x600";

// parse one subject's string into an array of all classes tutor teaches in that subject
// in original strings, _ are spaces in classes and ; are used to separate classes
function parseClass(subject) {
    // use regex to replace all underscores with spaces and split by semicolon
    const spaceClasses = subject.replace(/_/g, " ");
    const newClasses = spaceClasses.split(";").map((course) => course.trim());
    return newClasses;
}

// take the wing number from tutors db and return the corresponding wing letter
// 1 = A, 2 = B, 3 = C, 4 = D
function assignWing(wingNum) {
    return String.fromCharCode(wingNum + 64);
}

// assign a priority (higher value = higher priority) to a course if it should appear first
function getPriority(course) {
    const normalized = course.toLowerCase();
    if (normalized.includes("scientific inquiries: chemistry")) return 6;
    if (normalized.includes("scientific inquiries: physics")) return 6;
    if (normalized.includes("computer science inquiry")) return 6;
    if (normalized.includes("mathematical investigations: i/ii")) return 6;
    if (normalized.includes("mathematical investigations: ii")) return 6;
    if (normalized.includes("mathematical investigations: iii")) return 5;
    if (normalized.includes("mathematical investigations: iv")) return 4;
    if (normalized.includes("bc calculus i")) return 3;
    if (normalized.includes("object oriented programming")) return 3;
    if (normalized.includes("bc calculus ii")) return 2;
    return 0;
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
    let taughtClasses = [];

    // loop through all subjects and add parsed classes to taughtClasses array
    Object.values(subjects).forEach((subject) => {
        if (subject) {
            taughtClasses.push(...parseClass(subject));
        }
    });

    // sort taught classes by priority (highest first) then by alphabetical order as a tie breaker
    taughtClasses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        if (diff === 0) return a.localeCompare(b);
        return diff;
    });

    // Build display text by adding classes one by one until overflow
    const maxCharsPerLine = 20; // Approximate characters per line for small text
    const maxChars = maxCharsPerLine * 3; // 3 lines worth

    let displayText = "";
    let currentLength = "Classes: ".length; // Start with the label length

    for (let i = 0; i < taughtClasses.length; i++) {
        const classToAdd = taughtClasses[i];
        const separator = i === 0 ? "" : ", ";
        const additionalLength = separator.length + classToAdd.length;

        // Check if adding this class would exceed the limit
        if (currentLength + additionalLength > maxChars) {
            // If this isn't the first class and adding would overflow, add ellipsis
            if (i > 0) {
                displayText += "...";
            } else {
                // If even the first class is too long, truncate it
                const availableSpace = maxChars - currentLength - 3; // -3 for "..."
                displayText = classToAdd.substring(0, availableSpace) + "...";
            }
            break;
        }

        displayText += separator + classToAdd;
        currentLength += additionalLength;
    }

    // Fallback if no classes
    if (!displayText && taughtClasses.length === 0) {
        displayText = "No classes listed";
    }

    return (
        <div className="relative w-64 flex flex-col items-center">
            {/* Image container */}
            <div className="w-full h-64 overflow-hidden border-4 border-blue-300 shadow-lg rounded-b-none rounded-t-3xl z-0">
                <img
                    src={image || DEFAULT_AVATAR_URL}
                    alt={`${name}`}
                    className="w-full h-full object-cover object-top"
                    style={{ aspectRatio: "600/600" }}
                />
            </div>

            {/* Info container - same width as image, floating above */}
            <div className="w-full bg-white -mt-8 z-10 rounded-2xl p-4 shadow-xl text-center flex flex-col">
                <h3 className="text-lg font-semibold font-sans">{name}</h3>
                <p className="text-sm text-gray-400 font-sans">
                    {hall}, {assignWing(wing)} wing
                </p>
                <div className="text-sm text-gray-700 font-sans h-16 overflow-hidden">
                    <span className="font-bold">Classes: </span>
                    <span>{displayText}</span>
                </div>
                <a
                    href={routing_link}
                    className="text-blue-500 font-medium mt-auto pt-2 block"
                >
                    View Profile →
                </a>
            </div>
        </div>
    );
}

export default TutorCard;
