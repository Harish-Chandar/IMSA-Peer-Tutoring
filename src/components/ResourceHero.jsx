import React, { Component } from "react";
// import "./ResourceHero.css";

class ResourceHero extends Component {
    render() {
        return (

            <div className="w-full mt-16">
                <div className="flex flex-col md:flex-row justify-around w-full h-auto md:h-80 bg-slate-100 px-4">
				<div className="flex flex-col md:text-left h-full justify-center py-8">
					<h2 className="text-gray-700 text-3xl md:text-4xl font-bold mb-5 md:mb-0">
						Find resources {" "}
						<span className="text-blue-500"><br className="md:hidden"></br>for IMSA classes</span>
					</h2>
					<h2 className="text-gray-400 text-lg font-bold mb-3">
						Sort by teacher, subject, and more!
					</h2>
				</div>
				<img src="/resourceHero.png" className="w-full md:w-auto"></img>
			</div>
            </div>
        );
    }
}

export default ResourceHero;
