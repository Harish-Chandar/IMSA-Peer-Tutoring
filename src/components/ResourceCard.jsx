import { useState } from "react";
import "../App.css";

function ResourceCard({ course, teacher, department, url, type }) {
	const resourceImage = {
		English: "/ClassImages/english.png",
		Math: "/ClassImages/math.png",
		Science: "/ClassImages/science.png",
		"World Languages": "/ClassImages/worldlanguages.png",
		"Computer Science": "/ClassImages/computerscience.png",
		Wellness: "/ClassImages/wellness.png",
	};

	return (
		<div className="relative w-64 flex flex-col items-center border-4 border-blue-300 hover:border-blue-500 shadow-lg rounded-3xl transition-colors duration-200">
			{/* Image container */}
			<div className="w-full h-64 overflow-hidden rounded-b-none rounded-t-3xl z-0">
				<img
					src={
						resourceImage[department] || "/ClassImages/science.png"
					}
					alt={`${department && department.toString()} resource`}
					className="w-full h-full object-cover object-top"
					style={{ aspectRatio: "600/600" }}
					onError={(e) => {
						e.target.src = "/ClassImages/science.png";
					}}
				/>
			</div>

			<div className="w-full bg-white -mt-12 z-10 rounded-2xl p-4 py-6 shadow-xl text-center flex-grow flex-col justify-center">
				<h3 className="text-lg font-semibold font-sans">
					{course && course.toString()}
				</h3>
				<p className="text-md text-gray-400 font-sans">
					{department && department.toString()}
				</p>
				<div className="text-md text-gray-700 font-sans mt-2 overflow-hidden">
					<span className="font-bold">Teacher: </span>
					<span>{teacher && teacher.toString()}</span>
				</div>
				{url && (
					<a
						href={url}
						className="text-blue-500 font-medium mt-auto pt-2 block"
						target="_blank"
						rel="noopener noreferrer"
					>
						View Resource →
					</a>
				)}
			</div>
		</div>
	);
}

export default ResourceCard;
