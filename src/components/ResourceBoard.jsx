import { useState } from "react";
import "../App.css";
import ResourceCard from "./ResourceCard.jsx";

function ResourceBoard() {
    return (
        <div className="p-10 pb-25 bg-slate-50 rounded-lg w-250 h-120 display: flex justify-center items-center flex-col font-sans ">
            <div className="flex flex-row">
                <ResourceCard course="Test" department="Test" teachers="Test" />
                <ResourceCard course="Test" department="Test" teachers="Test" />
                <ResourceCard course="Test" department="Test" teachers="Test" />
                <ResourceCard course="Test" department="Test" teachers="Test" />
                <ResourceCard course="Test" department="Test" teachers="Test" />
                <ResourceCard course="Test" department="Test" teachers="Test" />
            </div>
        </div>
    );
}

export default ResourceBoard;
