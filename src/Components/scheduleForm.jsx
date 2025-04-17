import { useState } from "react";
import "./../App.css";
import Note from "./note";

function Bulletin() {

  return (
    <>
        <h1>Schedule Entry Form</h1>
        <form id="scheduleForm">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required/>
            </div>
            <div class="form-group">
                <label for="course">Course:</label>
                <input type="text" id="course" name="course" required/>
            </div>
            <div class="form-group">
                <label for="teachers">Teachers:</label>
                <input type="text" id="teachers" name="teachers" required/>
            </div>
            <div class="form-group">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" required/>
            </div>
            <div class="form-group">
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required/>
            </div>
            <div class="form-group">
                <label for="time">Time:</label>
                <input type="time" id="time" name="time" required/>
            </div>
            <button type="submit">Submit</button>
        </form>
        <div id="message"></div>
    </>
  );
}

export default Bulletin;
