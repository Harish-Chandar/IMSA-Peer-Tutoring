import React, { useEffect, useState } from "react";
import TutorCard from "../components/TutorCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, getTokenAccess } from "../util.ts";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;
const baseUrl = `http://${HOST}:${DBPORT}`;

function CheckInTutors() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token || isTokenExpired(token) || getTokenAccess(token) !== 1) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchTutors = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${baseUrl}/api/tutors/search`); 
            const data = await response.json();
            setTutors(data);
        } catch (err) {
            setError("Failed to fetch tutors");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const handleCheckIn = async (id) => {
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}/api/tutors/${id}/checkin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Check-in failed");
            await fetchTutors();
        } catch (err) {
            setError("Check-in failed");
        }
    };

    const handleCheckOut = async (id) => {
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}/api/tutors/${id}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Check-out failed");
            await fetchTutors();
        } catch (err) {
            setError("Check-out failed");
        }
    };

    const activeTutors = tutors.filter((t) => t.is_available === 1);
    const inactiveTutors = tutors.filter((t) => t.is_available === 0);

    const filterTutors = (tutors) => {
        if (!search.trim()) return tutors;
        const s = search.trim().toLowerCase();
        return tutors.filter((t) => {
            const name = `${t.fname} ${t.lname}`.toLowerCase();
            const hall = String(t.hall || "");
            return (
                name.includes(s) ||
                hall.includes(s)
            );
        });
    };

    const filteredActiveTutors = filterTutors(activeTutors);
    const filteredInactiveTutors = filterTutors(inactiveTutors);

    return (
        <div className="bg-gray-100 min-h-screen pt-20">
            <div className="p-4 max-w-6xl mx-auto py-10">
                <h1 className="text-5xl mb-6 text-center font-sans font-bold tracking-wide text-blue-700">
                    Tutor Check-In/Out
                </h1>
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or hall"
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center">
                    <div className="flex-1">
                        <h2 className="text-2xl mb-4 text-center font-sans font-bold text-blue-600">Active Tutors</h2>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="text-center font-sans text-lg text-gray-500">Loading...</div>
                            ) : (
                                filteredActiveTutors.length === 0 ? (
                                    <div className="text-center text-gray-500 font-sans">No active tutors</div>
                                ) : (
                                    filteredActiveTutors.map((tutor) => (
                                        <div key={tutor.id} className="flex items-center justify-between bg-white rounded-xl shadow border border-gray-200 px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-800">{tutor.fname} {tutor.lname}</span>
                                                <span className="text-sm text-blue-600">{tutor.email}</span>
                                                <span className="text-xs text-gray-500">Hall: {tutor.hall} | Wing: {String.fromCharCode(64 + Number(tutor.wing))}</span>
                                                <span className="text-xs text-gray-500">Total Time: {(tutor.totaltime ? (tutor.totaltime / 3600000).toFixed(2) : "0.00")} hours</span>
                                            </div>
                                            <button
                                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 border-2 border-red-400 shadow font-sans font-semibold transition-colors duration-150"
                                                onClick={() => handleCheckOut(tutor.id)}
                                            >
                                                End
                                            </button>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl mb-4 text-center font-sans font-bold text-gray-600">Inactive Tutors</h2>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="text-center font-sans text-lg text-gray-500">Loading...</div>
                            ) : (
                                filteredInactiveTutors.length === 0 ? (
                                    <div className="text-center text-gray-500 font-sans">No inactive tutors</div>
                                ) : (
                                    filteredInactiveTutors.map((tutor) => (
                                        <div key={tutor.id} className="flex items-center justify-between bg-white rounded-xl shadow border border-gray-200 px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-800">{tutor.fname} {tutor.lname}</span>
                                                <span className="text-sm text-blue-600">{tutor.email}</span>
                                                <span className="text-xs text-gray-500">Hall: {tutor.hall} | Wing: {String.fromCharCode(64 + Number(tutor.wing))}</span>
                                                <span className="text-xs text-gray-500">Total Time: {(tutor.totaltime ? (tutor.totaltime / 3600000).toFixed(2) : "0.00")} hours</span>
                                            </div>
                                            <button
                                                className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 border-2 border-green-400 shadow font-sans font-semibold transition-colors duration-150"
                                                onClick={() => handleCheckIn(tutor.id)}
                                            >
                                                Start
                                            </button>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </div>
                {error && <div className="text-center text-red-500 mt-4 font-sans">{error}</div>}
            </div>
            <Footer />
        </div>
    );
}

export default CheckInTutors; 