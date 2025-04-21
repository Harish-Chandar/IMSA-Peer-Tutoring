import React, { useState, useEffect } from "react";

function Tutor() {
    const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = [
    "Sun.",
    "Mon.",
    "Tues.",
    "Wed.",
    "Thurs.",
    "Fri.",
    "Sat."
  ];

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const calendarDays = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay.getDay()) || day > lastDay.getDate()) {
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

  const calendar = generateCalendar();

  return (
    <div className="flex flex-col md:flex-row px-[10rem] py-4 gap-6 items-start w-full">
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="./ashah.jpg"
          alt="Profile"
          className="rounded-2xl shadow-md  w-[50vh] object-cover"
        />
      </div>

      <div className="bg-white shadow-xl p-4 w-full md:w-1/2 rounded-2xl max-w-full md:mr-6">
        <div className="mb-4">
        {/* REPLACE THIS WITH THE INFO OF THE TUTOR IN QUESTION */}
          <h2 className="text-5xl font-semibold text-gray-800 font-sans py-5">Aarav Shah</h2> 
          <p className = "text-xl text-gray-500 font-sans">1505 D wing</p>
          <p className="text-xl text-gray-600 mt-2 font-sans"><span className="font-bold">Classes Taught:</span> MI 1/2, Advancted Topics</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {calendar.flat().map((date, index) => (
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
              ))}
            </div>
          </div>
          <div className="flex-1 text-sm text-gray-700">
            <h3 className="font-semibold mb-2 text-3xl text-gray-500">Weekly Schedule:</h3>
            <ul className="list-disc pl-5 space-y-1 text-xl">
              <li>Monday: 10 PM - 11 PM</li>
              <li>Tuesday: -</li>
              <li>Wednesday: 7 PM - 10 PM</li>
              <li>Thursday: 4:30 PM - 5:30 PM</li>
              <li>Friday: 8 PM - 10 PM</li>
              <li>Saturday: 9 PM - 10 PM</li>
              <li>Sunday: -</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutor
