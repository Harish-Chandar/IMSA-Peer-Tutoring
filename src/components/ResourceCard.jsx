import { useState, useEffect } from "react";
import "../App.css";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;
const baseUrl = `http://${HOST}:${DBPORT}`;


function ResourceCard({ course, teacher, department, resource_id }) {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!resource_id) return;
        setIsLoading(true);

        fetch(`${baseUrl}/api/resources/${resource_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch resource links')
                }
                return response.json();
            })
            .then(data => {
                setLinks(data.links || []);
            })
            .catch(error => {
                console.error('Error fetching links:', error);
                setLinks([]);
            })
            .finally(() => {
                setIsLoading(false);
            })
        
    }, [resource_id, baseUrl])


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
				{/* {url && (
					<a
						href={url}
						className="text-blue-500 font-medium mt-auto pt-2 block"
						target="_blank"
						rel="noopener noreferrer"
					>
						View Resource →
					</a>
				)} */}
{/* 
                <div className="space-y-3">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">
                                Resources
                            </h2>

                            {links.map((link, index) => (
                                <div key={link.link_id || index} className="space-y-2">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow hover:bg-blue-600 hover:text-white transition w-full text-center block text-sm sm:text-base"
                                    >
                                        View {link.label}
                                    </a>
                                </div>
                            ))}

                            {links.length === 0 && isLoading && (
                                <div className="text-center py-2">
                                    <p className="text-gray-400 italic">Loading resources...</p>
                                </div>
                            )}
                            {links.length === 0 && !isLoading && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 italic text-sm sm:text-base">
                                        No resources available
                                    </p>
                                </div>
                            )}
                </div> */}
			</div>
		</div>
	);
}

export default ResourceCard;
