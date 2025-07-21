import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

import { isTokenExpired, getTokenAccess } from "../util.ts"

function Dashboard() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || isTokenExpired(token) || getTokenAccess(token) !== 1) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="p-6 bg-gray-100 pt-14">
            <h1 className="text-4xl mb-6 text-center font-bold py-10 text-blue-500">
                Administrator Dashboard
            </h1>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Welcome to Your Dashboard
                        </h2>
                        <p className="text-gray-600">
                            Manage tutors, courses, resources, and bulletin posts from here!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleNavigation('/addTutor')}
                            className="bg-blue-500 hover:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Tutors</div>
                            <div className="text-sm opacity-90">Add or remove tutors</div>
                        </button>

                        <button
                            onClick={() => handleNavigation('/resources/new')}
                            className="bg-green-500 hover:bg-green-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Add New Course</div>
                            <div className="text-sm opacity-90">Create a page to list class resources</div>
                        </button>

                        <button
                            onClick={() => handleNavigation('/resources/modify')}
                            className="bg-orange-500 hover:bg-orange-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Existing Courses</div>
                            <div className="text-sm opacity-90">Edit current course info and resources</div>
                        </button>

                        <button
                            onClick={() => handleNavigation('/editBulletin')}
                            className="bg-purple-500 hover:bg-purple-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Bulletin</div>
                            <div className="text-sm opacity-90">Update announcements</div>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;








// import React, { useState, useEffect } from "react";
// import Footer from "../components/Footer";
// import { useNavigate } from 'react-router-dom';

// import { isTokenExpired } from "../util.ts"

// function Dashboard() {
//   // environment variables for API configuration
//   const DBPORT = process.env.REACT_APP_DBPORT || "5000";
//   const HOST = process.env.REACT_APP_HOST || "localhost";
//   const baseUrl = `http://${HOST}:${DBPORT}`;

//   // state variables for class search
//   const [classes, setClasses] = useState([]);
//   const [isLoadingClasses, setIsLoadingClasses] = useState(true);

// 	const token = localStorage.getItem("token");

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!token || isTokenExpired(token)) {
//       navigate('/login', { replace: true });
// 	}
//   }, [token, navigate]);
// 	// we actually don't have a field in the database for all the classes so i hardcoded it
// 	const classesList = [
// 		"SI Physics",
// 		"Physics: Sound and Light",
// 		"Physics C: Mechanics",
// 		"Physics C: Electricity/Magnetism",
// 		"Planetary Science",
// 		"Modern Physics",
// 		"Computational Science",
// 		"SI Chemistry",
// 		"Advanced Chemistry - Structure and Properties",
// 		"Advanced Chemistry - Chemical Reactions",
// 		"The Physical Chemistry of Materials",
// 		"Organic Chemistry I",
// 		"Organic Chemistry II",
// 		"Biochemistry",
// 		"Environmental Chemistry",
// 		"Medicinal Chemistry",
// 		"Biology: Evolution & Environment",
// 		"Biology: Molecular & Cellular",
// 		"Evolution, Biodiversity, and Ecology",
// 		"Cancer Biology",
// 		"Environmental Microbiology",
// 		"Pathophysiology",
// 		"Biology of Behavior",
// 		"Methods of Scientific Inquiries",
// 		"Electronics",
// 		"Engineering",
// 		"Engineering: Statics & Dynamics",
// 		"Introduction to Proofs",
// 		"Modern Geometries",
// 		"Statistical Exploration and Description",
// 		"Statistical Experimentation and Inference",
// 		"Number Theory",
// 		"Discrete Mathematics",
// 		"Multi-Variable Calculus",
// 		"Theory of Analysis",
// 		"Differential Equations",
// 		"Linear Algebra",
// 		"Abstract Algebra",
// 		"Geometry",
// 		"MI I/II",
// 		"MI II",
// 		"MI III",
// 		"MI IV",
// 		"AB Calculus I",
// 		"AB Calculus II",
// 		"BC I",
// 		"BC II",
// 		"BC III",
// 		"BC I/II",
// 		"BC II/III",
// 		"CSI",
// 		"OOP",
// 		"Web Technologies",
// 		"Advanced Programming",
// 		"Microcontroller Applications (CS)",
// 		"CS Seminar: Android Apps Development",
// 		"CS Seminar: Linux and Cybersecurity",
// 		"CS Seminar: Machine Learning",
// 		"French I",
// 		"French II",
// 		"French III",
// 		"French IV",
// 		"French V",
// 		"Spanish II",
// 		"Spanish III",
// 		"Spanish IV",
// 		"Spanish V",
// 		"German I",
// 		"German II",
// 		"German III",
// 		"Mandarin Chinese I",
// 		"Mandarin Chinese II",
// 		"Mandarin Chinese III",
// 	];

// 	// state variables for class search
// 	const [searchTerm, setSearchTerm] = useState("");
// 	const [selectedClass, setSelectedClass] = useState(null);

// 	const filteredClasses = classesList.filter((c) =>
// 		c.toLowerCase().includes(searchTerm.toLowerCase())
// 	);

// 	const handleSelectClass = (className) => {
// 		setSelectedClass(className);
// 		setSearchTerm("");
// 	};

//   // resources states for class management
//   const [resources, setResources] = useState([]);
//   const [resourceLink, setResourceLink] = useState("");
//   const [resourceSearchQuery, setResourceSearchQuery] = useState("");
//   const [filteredResources, setFilteredResources] = useState([]);

//   // fetch resources when page loads
//   useEffect(() => {
//     fetchResources();
//     fetchClasses();
//   }, []);

//   // filter resources when search query updates WITH UPDATED RESOURCES TABLE STUFF
//   useEffect(() => {
//     if (resources.length > 0) {
//       const filtered = resources.filter((resource) => {
//         return (
//           (resource.teacher &&
//             resource.teacher
//               .toLowerCase()
//               .includes(resourceSearchQuery.toLowerCase())) ||
//           (resource.course &&
//             resource.course
//               .toLowerCase()
//               .includes(resourceSearchQuery.toLowerCase())) ||
//           (resource.department &&
//             resource.department
//               .toLowerCase()
//               .includes(resourceSearchQuery.toLowerCase()))
//         );
//       });
//       setFilteredResources(filtered);
//     }
//   }, [resourceSearchQuery, resources]);

//   // updated fetchResources to have the new structure of the resources table
//   const fetchResources = async () => {
//     try {
//       const response = await fetch(`${baseUrl}/api/resources`);
//       const data = await response.json();
//       setResources(data);
//       setFilteredResources(data);
//     } catch (error) {
//       console.error("error fetching resources:", error);
//     }
//   };

//   // fetch classes from database
//   const fetchClasses = async () => {
//     try {
//       setIsLoadingClasses(true);
//       const response = await fetch(`${baseUrl}/api/classes`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const classData = await response.json();

//       // extract just the class names from the response
//       const classNames = classData.map((classItem) => classItem.class_name);
//       setClasses(classNames);

//       console.log("Fetched classes from database:", classNames);
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//       // fallback to empty array if API fails
//       setClasses([]);
//     } finally {
//       setIsLoadingClasses(false);
//     }
//   };

//   // handle resource creation
//   const handleResourceUpload = async () => {
//     if (!resourceLink || !selectedClass) {
//       alert("please enter a resource link and select a class.");
//       return;
//     }

//     try {
//       const response = await fetch(`${baseUrl}/api/resources`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           teacher: "Admin",
//           email: "admin@imsa.edu",
//           course: selectedClass,
//           department: "General",
//           url: resourceLink,
//           type: "link",
//         }),
//       });

//       if (response.ok) {
//         // refresh resources from database
//         fetchResources();

//         // clear form
//         setResourceLink("");
//         setSelectedClass(null);
//         setSearchTerm("");

//         alert("resource created successfully!");
//       } else {
//         alert("error creating resource. please try again.");
//       }
//     } catch (error) {
//       console.error("error creating resource:", error);
//       alert("error creating resource. please try again.");
//     }
//   };

//   // handle deleting a resource
//   const handleDeleteResource = async (resourceId) => {
//     const resourceToDelete = resources.find(
//       (resource) => resource.resource_id === resourceId
//     );
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete the resource for "${resourceToDelete.course}"? This action cannot be undone.`
//     );

//     if (confirmDelete) {
//       try {
//         const response = await fetch(`${baseUrl}/api/resources/${resourceId}`, {
//           method: "DELETE",
//         });

//         if (response.ok) {
//           // refresh resources from database
//           fetchResources();
//         } else {
//           alert("error deleting resource. please try again.");
//         }
//       } catch (error) {
//         console.error("error deleting resource:", error);
//         alert("error deleting resource. please try again.");
//       }
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 pt-14">
//       <h1 className="text-4xl mb-6 text-center font-bold py-10 text-blue-500">
//         Administrator Dashboard
//       </h1>
//       <div className="flex justify-center">
//         <div className="rounded-2xl shadow-md p-4 bg-white border max-w-2xl w-full">
//           <h2 className="py-4 text-3xl font-bold mb-2 font-sans text-blue-500">
//             Resource Management
//           </h2>
//           <h3 className="font-sans text-lg font-bold text-gray-600 mb-3">
//             Add Resource
//           </h3>

//           <p className="font-sans mb-2 text-left text-gray-700 font-bold">
//             Select a class:
//           </p>
//           <input
//             type="text"
//             placeholder={
//               isLoadingClasses ? "Loading classes..." : "Search for a class..."
//             }
//             className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             disabled={selectedClass !== null || isLoadingClasses}
//           />

//           {searchTerm && !selectedClass && (
//             <ul className="border rounded-md bg-white shadow-md mt-1 max-h-40 overflow-y-auto mb-2">
//               {filteredClasses.length > 0 ? (
//                 filteredClasses.map((className, idx) => (
//                   <li
//                     key={idx}
//                     onClick={() => handleSelectClass(className)}
//                     className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
//                   >
//                     {className}
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-3 py-2 text-gray-500">No results found</li>
//               )}
//             </ul>
//           )}

//           {selectedClass && (
//             <div className="mt-3 mb-3 bg-blue-200 text-blue-800 px-3 py-2 rounded flex justify-between items-center w-fit">
//               <span>{selectedClass}</span>
//               <button
//                 className="ml-2 text-blue-800 hover:text-blue-900 font-bold"
//                 onClick={() => setSelectedClass(null)}
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <p className="font-sans text-left text-gray-700 py-2  font-bold">
//             Link(s) of resources:
//           </p>
//           <input
//             type="text"
//             placeholder="Enter resource link (URL)..."
//             value={resourceLink}
//             onChange={(e) => setResourceLink(e.target.value)}
//             className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
//           />
//           <div className="py-2"></div>
//           <button
//             onClick={handleResourceUpload}
//             className="w-1/3 text-lg bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all duration-200"
//           >
//             Create Resource
//           </button>

//           <p className="font-sans mt-4 text-left text-gray-700 font-bold py-2">
//             Search Supporting Materials:
//           </p>
//           <input
//             type="text"
//             placeholder="Search by teacher, course, or department..."
//             value={resourceSearchQuery}
//             onChange={(e) => setResourceSearchQuery(e.target.value)}
//             className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
//           />

//           <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
//             {filteredResources.length === 0 ? (
//               <p className="text-gray-500">No resources yet.</p>
//             ) : (
//               filteredResources.map((resource) => (
//                 <div
//                   key={resource.resource_id}
//                   className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
//                 >
//                   <span>
//                     {resource.teacher} - {resource.course} (
//                     {resource.department})
//                   </span>
//                   <button
//                     onClick={() => handleDeleteResource(resource.resource_id)}
//                     className="ml-2 text-blue-800 hover:text-blue-900 bg-transparent focus:outline-none"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Dashboard;
