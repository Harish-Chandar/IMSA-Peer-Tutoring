import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceForm from "./ResourceForm";
// import { Resources } from "./Resources";
import ResourceDetails from "./resources-components/ResourceDetails";
import FindResources from "./FindResources";
import AddResource from "./AddResource";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindResources />} />
        <Route path="/resources/new" element={<AddResource />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
      </Routes>
    </Router>
    // <AddResource></AddResource>
  );
}
