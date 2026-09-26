import React, { useEffect } from "react";
import { apiFetch } from "../apiFetch.js";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

import { isTokenExpired, getTokenAccess, getTokenEmail } from "../util.ts"

function Dashboard() {
    const navigate = useNavigate();

    const token = localStorage.getItem("session");

    useEffect(() => {
        if (!token || isTokenExpired(token) || getTokenAccess(token) < 1 || getTokenAccess(token) > 3) {
            navigate('/login', { replace: true });
        }

		const manageAccountsButton = document.getElementById("manage-accounts-button");
        const manageTutorsButton = document.getElementById("manage-tutors-button");
        const addCourseButton = document.getElementById("add-course-button");
        const manageCoursesButton = document.getElementById("manage-courses-button");
        const editBulletinButton = document.getElementById("edit-bulletin-button");
        const checkinButton = document.getElementById("checkin-button");

        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = "Welcome to the administrator dashboard! Here you can manage tutors, courses, bulletin posts, and more.";
		// For admins
        if (getTokenAccess(token) === 1) {
            manageAccountsButton.style.display = "block";
            editBulletinButton.style.display = "block";
            addCourseButton.style.display = "block";
            manageCoursesButton.style.display = "block";
            manageTutorsButton.style.display = "block";
            checkinButton.style.display = "block";
            welcomeMessage.textContent = "Welcome to the administrator dashboard! Here you can manage tutors, courses, bulletin posts, and accounts! Your access level is: Administrator.";
		} 
        // For teachers
        else if (getTokenAccess(token) === 2) {
            manageAccountsButton.style.display = "none";
            editBulletinButton.style.display = "block";
            addCourseButton.style.display = "block";
            manageCoursesButton.style.display = "block";
            manageTutorsButton.style.display = "none";
            checkinButton.style.display = "block";
            welcomeMessage.textContent = "Welcome to the administrator dashboard! Here you can manage courses, resources, and check in tutors! Your access level is: Teacher.";
        }
        // For RCs
        else if (getTokenAccess(token) === 3) {
            manageAccountsButton.style.display = "none";
            editBulletinButton.style.display = "none";
            addCourseButton.style.display = "none";
            manageCoursesButton.style.display = "none";
            manageTutorsButton.style.display = "block";
            checkinButton.style.display = "block";
            welcomeMessage.textContent = "Welcome to the administrator dashboard! Here you can manage tutors and check-in/out! Your access level is: Resident Counselor.";
        }
        else {
			manageAccountsButton.style.display = "none";
            manageTutorsButton.style.display = "none";
            addCourseButton.style.display = "none";
            manageCoursesButton.style.display = "none";
            editBulletinButton.style.display = "none";
            checkinButton.style.display = "none";
            welcomeMessage.textContent = "Welcome to the administrator dashboard! Your access level is not recognized. Please contact an administrator for help.";
		}
    }, [token, navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        const protocol = process.env.REACT_APP_DEV_SERVER === 'true' ? 'http' : 'https';
        const baseUrl = `${protocol}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_DBPORT}`;
        try {
            const response = await apiFetch(`${baseUrl}/api/logout`, { method: 'POST' });
            if (!response.ok && response.status !== 401) throw new Error('Logout failed');
            localStorage.removeItem("session");
            navigate('/login', { replace: true });
        } catch (error) {
            window.alert('Could not log out. Please try again.');
        }
    };

	return (
        <div className="p-6 bg-gray-100 pt-14">
			<div className="flex justify-between items-center mb-6 py-10">
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white p-2 lg:px-4 lg:py-2 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
                Logout
            </button>

                <h1 className="text-3xl lg:text-4xl text-center font-bold text-blue-500 ml-16">
					Administrator Dashboard
				</h1>

				<div className="flex gap-2">
					<button
						onClick={() => handleNavigation('/changePassword')}
						className="bg-green-700 hover:bg-green-800 text-white p-2 lg:px-4 lg:py-2 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
					>
						Change Password
					</button>
				</div>
			</div>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3">
                            Logged in as <span className="italic">{getTokenEmail(token)}</span>
                        </h2>
                        <p className="text-gray-600" id="welcome-message">
                            Welcome to the administrator dashboard! Here you can manage tutors, courses, bulletin posts, and more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            id="manage-tutors-button"
                            onClick={() => handleNavigation('/addTutor')}
                            className="bg-blue-500 hover:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Tutors</div>
                            <div className="text-sm opacity-90">Add, remove, or edit tutor info</div>
                        </button>

                        <button
                            type="button"
                            id="checkin-button"
                            onClick={() => handleNavigation('/checkin')}
                            className="bg-red-500 hover:bg-red-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Check-In Tutors</div>
                            <div className="text-sm opacity-90">Check tutors in and out</div>
                        </button>

                        <button
                            type="button"
                            id="add-course-button"
                            onClick={() => handleNavigation('/resources/new')}
                            className="bg-green-500 hover:bg-green-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Add New Course</div>
                            <div className="text-sm opacity-90">Create a page to list class resources</div>
                        </button>

                        <button
                            type="button"
                            id="manage-courses-button"
                            onClick={() => handleNavigation('/resources/modify')}
                            className="bg-orange-500 hover:bg-orange-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Existing Courses</div>
                            <div className="text-sm opacity-90">Edit current course info and resources</div>
                        </button>

                        <button
                            type="button"
                            id="edit-bulletin-button"
                            onClick={() => handleNavigation('/editBulletin')}
                            className="bg-purple-500 hover:bg-purple-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="text-lg mb-1">Manage Bulletin</div>
                            <div className="text-sm opacity-90">Update announcements</div>
                        </button>

						<button
							type="button"
							id="manage-accounts-button"
							onClick={() => handleNavigation('/admin/accounts')}
							className="bg-teal-500 hover:bg-teal-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
						>
							<div className="text-lg mb-1">Manage Accounts</div>
							<div className="text-sm opacity-90">Manage administrator accounts</div>
						</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;
