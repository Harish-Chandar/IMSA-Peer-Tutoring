import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceForm from "./ResourceForm.js";
import ResourceDetails from "./components/ResourceDetails.js";
import FindResources from "./FindResources.js";
import AddResource from "./AddResource.jsx";
import ModifyResources from "./ModifyResources.jsx";
import EditResource from "./EditResource.jsx";
import EditResourceInfo from "./components/EditResourceInfo.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindResources />} />
        <Route path="/resources/new" element={<AddResource />} />
        <Route path="/resources/modify" element={<ModifyResources />} />{" "}
        <Route path="/resources/:id/edit" element={<EditResource />} />
        <Route path="/resources/:id/edit-info" element={<EditResourceInfo />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
      </Routes>
    </Router>
  );
}
