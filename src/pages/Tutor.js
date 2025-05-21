import React, { useState, useEffect } from "react";

// helper function to parse class strings
function parseClasses(classesString) {
  if (!classesString) return [];
  const spaceClasses = classesString.replace(/_/g, " ");
  return spaceClasses.split(";").map((course) => course.trim());
}

// helper function to get wing letter (1=A, 2=B, etc.)
function assignWing(wingNum) {
  const wings = ["A", "B", "C", "D"];
  return wings[wingNum - 1] || "";
}

// helper function to parse schedule string from raw format into structured object
function parseSchedule(scheduleStr) {
  if (!scheduleStr) return {};

  const result = {};

  // split by semicolons to get each day entry
  const dayEntries = scheduleStr.split(";");

  dayEntries.forEach((entry) => {
    if (!entry) return;

    // split by comma - first element is the day name
    const parts = entry.split(",");
    if (parts.length < 2) return;

    const day = parts[0].toLowerCase();
    const times = parts.slice(1); // all remaining elements are time slots

    result[day] = times;
  });

  return result;
}

// helper function to capitalize first letter for display purposes
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Tutor() {
  // extract tutor id from url path
  const urlPath = window.location.pathname;
  const id = urlPath.split("/").pop(); // gets the last segment of the URL

  // state variables for component
  const [tutor, setTutor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    urlPath: urlPath,
    extractedId: id,
  });

  // abbreviated day names for calendar header
  const daysOfWeek = [
    "Sun.",
    "Mon.",
    "Tues.",
    "Wed.",
    "Thurs.",
    "Fri.",
    "Sat.",
  ];

  // full day names for schedule display
  const fullDayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // effect to fetch tutor data when component mounts or id changes
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        // set loading state and initialize debug info
        setLoading(true);
        setDebugInfo((prev) => ({ ...prev, step: "starting fetch" }));

        // fetch basic tutor information
        const tutorResponse = await fetch(
          `http://localhost:5000/api/tutors/${id}`
        );
        setDebugInfo((prev) => ({
          ...prev,
          tutorResponseOk: tutorResponse.ok,
        }));

        if (!tutorResponse.ok) {
          throw new Error("tutor not found");
        }

        // parse tutor data and update state
        const tutorData = await tutorResponse.json();
        setDebugInfo((prev) => ({
          ...prev,
          tutorDataReceived: true,
          tutorKeys: Object.keys(tutorData),
          hallValue: tutorData.hall,
          wingValue: tutorData.wing,
          imageValue: tutorData.image || tutorData.imgurl,
        }));

        // set tutor data
        setTutor(tutorData);

        // fetch classes the tutor can teach
        const classesResponse = await fetch(
          `http://localhost:5000/api/tutors/${id}/classes`
        );
        setDebugInfo((prev) => ({
          ...prev,
          classesResponseOk: classesResponse.ok,
        }));

        const classesData = await classesResponse.json();
        setDebugInfo((prev) => ({
          ...prev,
          classesDataReceived: Boolean(classesData),
        }));

        // process classes into a flat array
        const allClasses = [];
        if (classesData && classesData.length > 0) {
          const classesObj = classesData[0];

          if (classesObj) {
            Object.entries(classesObj).forEach(([subject, value]) => {
              if (value) {
                allClasses.push(...parseClasses(value));
              }
            });
          }
        }

        setClasses(allClasses);

        // fetch tutor's availability schedule
        const scheduleResponse = await fetch(
          `http://localhost:5000/api/tutors/${id}/schedule`
        );
        setDebugInfo((prev) => ({
          ...prev,
          scheduleResponseOk: scheduleResponse.ok,
        }));

        if (scheduleResponse.ok) {
          // extract and parse the schedule string
          const { schedule: scheduleStr } = await scheduleResponse.json();
          setDebugInfo((prev) => ({
            ...prev,
            scheduleStringReceived: Boolean(scheduleStr),
            rawSchedule: scheduleStr,
          }));

          // convert raw schedule string into structured format
          const parsedSchedule = parseSchedule(scheduleStr);
          setSchedule(parsedSchedule);

          setDebugInfo((prev) => ({
            ...prev,
            parsedSchedule: parsedSchedule,
          }));
        }

        // update debug info with fetch completion status
        setDebugInfo((prev) => ({
          ...prev,
          classesCount: allClasses.length,
          fetchComplete: true,
        }));
      } catch (err) {
        // handle errors in fetching data
        console.error("error fetching tutor data:", err);
        setError(`failed to load tutor information: ${err.message}`);
        setDebugInfo((prev) => ({ ...prev, error: err.message }));
      } finally {
        // always complete loading state
        setLoading(false);
      }
    };

    // check if id exists before fetching
    if (id) {
      fetchTutorData();
    } else {
      setError("no tutor id provided in url");
      setLoading(false);
    }
  }, [id]);

  // generate a calendar for the current month
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const calendarDays = [];
    let day = 1;

    // create a 6-week calendar grid
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay.getDay()) || day > lastDay.getDate()) {
          // empty cells for days outside current month
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }
      calendarDays.push(week);
    }
    return calendarDays;
  };

  // get the calendar data
  const calendar = generateCalendar();

  // render loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <div>loading tutor information...</div>
        <div className="text-xs text-gray-500 max-w-md overflow-auto">
          debug: {JSON.stringify(debugInfo, null, 2)}
        </div>
      </div>
    );
  }

  // render error state
  if (error || !tutor) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <div className="text-red-500">{error || "tutor not found"}</div>
        <div className="text-xs text-gray-500 max-w-md overflow-auto">
          debug: {JSON.stringify(debugInfo, null, 2)}
        </div>
      </div>
    );
  }

  // prepare display information with safety checks
  const fullName = `${tutor.fname || ""} ${tutor.lname || ""}`;

  // safely handle wing with fallback
  const wingDisplay = tutor.wing !== undefined ? assignWing(tutor.wing) : "";

  // construct location string safely
  const location = tutor.hall
    ? `${tutor.hall}${wingDisplay ? ` ${wingDisplay} wing` : ""}`
    : "location unknown";

  // determine correct image property (might be 'image' or 'imgurl')
  const profileImage =
    tutor.image || tutor.imgurl || "https://placehold.co/600x600";

  // render main component
  return (
    <div className="flex flex-col md:flex-row px-4 md:px-[10rem] py-4 gap-6 items-start w-full">
      {/* tutor profile image section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={profileImage}
          alt={fullName}
          className="rounded-2xl shadow-md w-full md:w-[50vh] object-cover h-auto"
        />
      </div>

      {/* tutor information section */}
      <div className="bg-white shadow-xl p-4 w-full md:w-1/2 rounded-2xl max-w-full md:mr-6">
        {/* tutor name, location and classes */}
        <div className="mb-4">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 font-sans py-5">
            {fullName}
          </h2>
          <p className="text-xl text-gray-500 font-sans">{location}</p>
          <p className="text-xl text-gray-600 mt-2 font-sans">
            <span className="font-bold">classes taught:</span>{" "}
            {classes.length > 0 ? classes.join(", ") : "no classes listed"}
          </p>
        </div>

        {/* calendar and schedule section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* interactive calendar view */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {calendar.flat().map((date, index) =>
                date ? (
                  <div
                    key={index}
                    className={`p-2 rounded-md cursor-pointer hover:bg-blue-100 transition ${
                      selectedDate === date ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </div>
                ) : (
                  <div key={index} className="p-2"></div>
                )
              )}
            </div>
          </div>

          {/* weekly schedule display */}
          <div className="flex-1 text-sm text-gray-700">
            <h3 className="font-semibold mb-2 text-3xl text-gray-500">
              weekly schedule:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xl">
              {fullDayNames.map((day) => (
                <li key={day} className="py-1">
                  <span className="font-medium">
                    {capitalizeFirstLetter(day)}:
                  </span>{" "}
                  {schedule[day] && schedule[day].length > 0
                    ? schedule[day].join(", ")
                    : "-"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutor;
