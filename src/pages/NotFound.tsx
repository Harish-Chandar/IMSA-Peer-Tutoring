import React from "react";
import '../App.css';

export default function NotFound() {
	console.log("USER ERROR 404");
	return (
			<>
			<div className="flex flex-col items-center justify-center h-screen w-screen">
			<p className="font-bold text-red-600 text-5xl mb-6 mx-2"> Error 404:  Page Not Found </p>
			<a href="/" className="text-blue-900 text-2xl mt-2 underline"> Back to Home </a>
			</div>
			</>
		   );
}
