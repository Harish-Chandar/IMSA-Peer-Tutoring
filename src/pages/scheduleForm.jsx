import { useState } from "react";
import "./../App.css";
import Note from "../components/Bulletinnote";

function ScheduleForm() {

  async function schedule(){
    const formData = {
      title: document.getElementById('title').value,
      course: document.getElementById('course').value,
      teachers: document.getElementById('teachers').value,
      location: document.getElementById('location').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value
    };

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        messageDiv.textContent = 'Schedule entry added successfully!';
        messageDiv.className = 'success';
        document.getElementById('scheduleForm').reset();
      } else {
        messageDiv.textContent = 'Error: ' + result.error;
        messageDiv.className = 'error';
      }
    } catch (error) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error submitting form: ' + error.message;
      messageDiv.className = 'error';
    }
  }

  return (
    <div className="display-flex flex-col w-full">
      <div className="flex flex-col md:flex-row justify-evenly w-screen h-auto md:h-80 bg-slate-100 px-4 mt-13 md:px-0">
      <div className="self-start flex flex-col text-left h-full justify-center py-8 ml-10">
                  <h2 className="text-gray-700 text-3xl md:text-4xl font-bold">Schedule A <span className="text-blue-500">Tutoring Session</span></h2>
                  <h2 className="text-gray-400 text-md font-bold mb-3">Use the form below and schedule a tutoring sessions with your own peers!</h2>
                  
                </div>
                <img src="/assets/smartguy.png" className="w-full md:w-auto max-w-md mx-auto"></img>
        </div>              
      
      <div className="mt-6 mb-4 px-4 md:px-0">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form id="scheduleForm" className="space-y-6">
            <h3 className="text-2xl text-blue-500 font-bold self-end ">Schedule Form</h3>
            <div className="form-group">
              <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Title"
                required
                className="text-gray-700 placeholder-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                id="course" 
                name="course" 
                placeholder="Course"
                required
                className="text-gray-700 placeholder-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                id="teachers" 
                name="teachers" 
                placeholder="Teachers"
                required
                className="text-gray-700 placeholder-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="Location"
                required
                className="text-gray-700 placeholder-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <input 
                type="date" 
                id="date" 
                name="date" 
                placeholder="Date"
                required
                className="text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <input 
                type="time" 
                id="time" 
                name="time" 
                placeholder="Time"
                required
                className="text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
              onClick={schedule()}
           >
              Schedule Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScheduleForm;
