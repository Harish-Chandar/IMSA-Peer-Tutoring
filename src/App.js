import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceForm from "./ResourceForm";
import ResourceDetails from "./resources-components/ResourceDetails";
import FindResources from "./FindResources";
import AddResource from "./AddResource";
import ModifyResources from "./ModifyResources"; // Add this import
import EditResource from "./EditResource";
import EditResourceInfo from "./resources-components/EditResourceInfo";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindResources />} />
        <Route path="/resources/new" element={<AddResource />} />
        <Route path="/resources/modify" element={<ModifyResources />} />{" "}
        {/* Add this route */}
        <Route path="/resources/:id/edit" element={<EditResource />} />
        <Route path="/resources/:id/edit-info" element={<EditResourceInfo />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
      </Routes>
    </Router>
  );
}
