import { useState } from "react";
import "../App.css";
import testimage from "../resourceImages/gateway-arch.png";

function ResourceCard({ course, teacher, department, url, type }) {
	// All the colors needed for the background of notes
	// const colorClasses = {
	//   yellow: "bg-yellow-100",
	//   red: "bg-red-100",
	//   green: "bg-green-100",
	//   blue: "bg-blue-100",
	// };

	return (
		<div
			className={`w-60 h-60 shadow-2xl rounded-lg m-5 relative hover:scale-105 duration-300`}
		>
			<img
				className="self-end h-full w-full object-cover rounded-lg "
				src={(url && url.toString()) || testimage}
				alt="Resource preview"
				onError={(e) => {
					e.target.src = testimage;
				}}
			/>
			<div
				className={`bg-slate-50 shadow-2xl rounded-lg p-1 w-50 h-30 mx-auto relative bottom-10`}
			>
				<h3 className="font-sans text-neutral-600">
					<b>{course && course.toString()}</b>
				</h3>
				<h3 className="font-sans text-neutral-600">
					{department && department.toString()}
				</h3>
				<h3 className="font-sans text-neutral-600">
					<b>Teacher:</b> {teacher && teacher.toString()}
				</h3>
			</div>
		</div>
	);
}

export default ResourceCard;
