import React, { Component } from "react";
// import "./ResourceHero.css";

class ResourceHero extends Component {
    render() {
        return (
            <div>
                <div className="w-full h-15 mt-8"></div>
                <div className="flex flex-row justify-evenly w-full h-80 bg-slate-100">
                    <div className="self-start flex flex-col text-left h-full justify-center">
                        <h2 className="text-gray-700 text-4xl font-bold">
                            Find resources{" "}
                            <span className="text-blue-500 text-4xl">for IMSA classes</span>
                        </h2>
                        <h2 className="text-gray-400 text-2xl font-normal mb-3">
                            Sort by teacher, subject, and more!
                        </h2>
                    </div>
                    <img src="/resourceHero.png" alt="Resource Hero" />{" "}
                </div>
            </div>
        );
    }
}

export default ResourceHero;
