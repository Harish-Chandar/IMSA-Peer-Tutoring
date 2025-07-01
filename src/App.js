import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDetails from "./components/ResourceDetails.js";
import FindResources from "./pages/FindResources.jsx";
import AddResource from "./pages/AddResource.jsx";
import ModifyResources from "./pages/ModifyResources.jsx";
import EditResource from "./pages/EditResource.jsx";
import EditResourceInfo from "./components/EditResourceInfo.jsx";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ScheduleForm from "./pages/ScheduleForm.jsx";
import Bulletin from "./components/BulletinBoard.jsx";

import Login from "./pages/Login.jsx";
import AddTutor from "./pages/AddTutor.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FindTutors from "./pages/FindTutors.jsx";
import Tutor from "./pages/Tutor.jsx";


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/scheduleForm" element={<ScheduleForm />} />
        <Route path="/bulletinBoard" element={<Bulletin />} />
        <Route path="/resources" element={<FindResources />} />
        <Route path="/resources/new" element={<AddResource />} />
        <Route path="/resources/modify" element={<ModifyResources />} />
        <Route path="/resources/:id/edit" element={<EditResource />} />
        <Route path="/resources/:id/edit-info" element={<EditResourceInfo />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addTutor" element={<AddTutor />} />
        <Route path="/adminDashboard" element={<Dashboard />} />
        <Route path="/findTutors" element={<FindTutors />} />
        <Route path="/tutor/:id" element={<Tutor />} />
      </Routes>
    </Router>
  );
}

//import "./App.css";
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Homepage from "./pages/Home.jsx";
//import Navbar from "./components/Navbar.jsx";
//import ScheduleForm from "./pages/ScheduleForm.jsx";
//
//function App() {
//  return (
//    <Router>
//      <div className="App">
//        <Navbar />
//        <Routes>    
//          <Route path="/" element={<Homepage />} />
//          <Route path="/scheduleform" element={<ScheduleForm />} />
//        </Routes>
//      </div>
//    </Router>
//  );
//}
//
//export default App;
