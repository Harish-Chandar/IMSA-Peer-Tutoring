import React, { useEffect, useState } from "react";
import TutorCard from "../components/TutorCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, getTokenAccess } from "../util.ts";
import AlertModal from "../components/AlertModal";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;
const baseUrl = `http://${HOST}:${DBPORT}`;

function CheckInTutors() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	useEffect(() => {
		if (!token || isTokenExpired(token)) {
			navigate("/login", { replace: true });
		}
		if (
			token &&
			!isTokenExpired(token) &&
			(getTokenAccess(token) < 1 ||
				getTokenAccess(token) > 3 ||
				getTokenAccess(token) === 2)
		) {
			navigate("/adminDashboard");
		}
	}, [token, navigate]);

	const [tutors, setTutors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertTitle, setAlertTitle] = useState("");
	const [pendingTutor, setPendingTutor] = useState(null);
	const [pendingElapsed, setPendingElapsed] = useState(0);
	const [pendingHours, setPendingHours] = useState(0);

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
			const response = await fetch(
				`${baseUrl}/api/tutors/${id}/checkin`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) throw new Error("Check-in failed");
			await fetchTutors();
		} catch (err) {
			setError("Check-in failed");
		}
	};

	const handleEndSession = (tutor) => {
		if (!tutor.starttime) {
			setError("No start time for this tutor.");
			return;
		}
		const now = Date.now();
		const elapsedMs = now - tutor.starttime;
		const elapsedHours = elapsedMs / 3600000;
		setPendingTutor(tutor);
		setPendingElapsed(elapsedHours);
		setPendingHours(Number(elapsedHours.toFixed(2)));
		setAlertTitle("RC Override: End Session");
		setAlertMessage(
			`The tutor has been active for ${elapsedHours.toFixed(
				2
			)} hours. Are you sure you want to end the session and approve the following number of hours for the tutor?`
		);
		setShowAlert(true);
	};

	// Called when RC accepts/declines in modal
	const handleAlertConfirm = async (accept) => {
		setShowAlert(false);
		if (!pendingTutor) return;
		if (accept) {
			try {
				const token = localStorage.getItem("token");
				// Convert hours to ms for backend
				const msToAdd = Number(pendingHours) * 3600000;
				await fetch(
					`${baseUrl}/api/tutors/${pendingTutor.id}/approvehours`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							approvedtime: msToAdd,
						}),
					}
				);
				await handleCheckOut(pendingTutor.id, true);
			} catch (err) {
				setError("Failed to approve hours and end session");
			}
		}
		// If accept is false (cancel), do nothing - tutor stays active
		setPendingTutor(null);
		setPendingElapsed(0);
		setPendingHours(0);
	};

	const handleCheckOut = async (id, skipModal = false) => {
		setError("");
		if (!skipModal) {
			const tutor = tutors.find((t) => t.id === id);
			if (tutor) {
				handleEndSession(tutor);
				return;
			}
		}
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${baseUrl}/api/tutors/${id}/checkout`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) throw new Error("Check-out failed");
			await fetchTutors();
		} catch (err) {
			setError("Check-out failed");
		}
	};

	const isActive = (t) =>
		t.is_available === 1 &&
		typeof t.starttime === "number" &&
		t.starttime !== null;
	const activeTutors = tutors.filter(isActive);
	const inactiveTutors = tutors.filter((t) => !isActive(t));

	const filterTutors = (tutors) => {
		if (!search.trim()) return tutors;
		const s = search.trim().toLowerCase();
		return tutors.filter((t) => {
			const name = `${t.fname} ${t.lname}`.toLowerCase();
			const hall = String(t.hall || "");
			return name.includes(s) || hall.includes(s);
		});
	};

	const filteredActiveTutors = filterTutors(activeTutors);
	const filteredInactiveTutors = filterTutors(inactiveTutors);

	return (
		<div className="p-6 bg-gray-100 pt-14 min-h-screen">
			<div className="flex justify-between items-center mb-6 py-10">
				<button
					onClick={() => navigate("/adminDashboard")}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
				>
					Back to Dashboard
				</button>
				<h1 className="text-4xl font-bold text-gray-700">
					Tutor Check-In/Out
				</h1>
				<div className="w-40"></div>
			</div>
			<div className="flex justify-center">
				<div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
					<div className="flex justify-center mb-8">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or hall"
							className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans bg-white text-gray-900"
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-8 justify-center">
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-600 mb-4 text-center">
								Inactive Tutors
							</h2>
							<div className="flex flex-col gap-4">
								{loading ? (
									<div className="text-center font-sans text-lg text-gray-500">
										Loading...
									</div>
								) : filteredInactiveTutors.length === 0 ? (
									<div className="text-center text-gray-500 font-sans">
										No inactive tutors
									</div>
								) : (
									filteredInactiveTutors.map((tutor) => (
										<div
											key={tutor.id}
											className="flex items-center justify-between bg-gray-50 rounded-xl shadow border border-gray-200 px-6 py-4"
										>
											<div className="flex flex-col items-start">
												<span className="text-lg font-bold text-gray-800">
													{tutor.fname} {tutor.lname}
												</span>
												<span className="text-sm text-blue-600">
													{tutor.email}
												</span>
												<span className="text-xs text-gray-500">
													Hall: {tutor.hall} | Wing:{" "}
													{tutor.wing
														? String.fromCharCode(
																64 +
																	Number(
																		tutor.wing
																	)
														  )
														: "-"}
												</span>
												<span className="text-xs text-gray-500">
													Total Time:{" "}
													{tutor.totaltime
														? (
																tutor.totaltime /
																3600000
														  ).toFixed(2)
														: "0.00"}{" "}
													hours
												</span>
											</div>
											<button
												className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md border-2 border-green-400 shadow font-sans font-semibold transition-colors duration-150"
												onClick={() =>
													handleCheckIn(tutor.id)
												}
											>
												Start
											</button>
										</div>
									))
								)}
							</div>
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
								Active Tutors
							</h2>
							<div className="flex flex-col gap-4">
								{loading ? (
									<div className="text-center font-sans text-lg text-gray-500">
										Loading...
									</div>
								) : filteredActiveTutors.length === 0 ? (
									<div className="text-center text-gray-500 font-sans">
										No active tutors
									</div>
								) : (
									filteredActiveTutors.map((tutor) => (
										<div
											key={tutor.id}
											className="flex items-center justify-between bg-gray-50 rounded-xl shadow border border-gray-200 px-6 py-4"
										>
											<div className="flex flex-col items-start">
												<span className="text-lg font-bold text-gray-800">
													{tutor.fname} {tutor.lname}
												</span>
												<span className="text-sm text-blue-600">
													{tutor.email}
												</span>
												<span className="text-xs text-gray-500">
													Hall: {tutor.hall} | Wing:{" "}
													{tutor.wing
														? String.fromCharCode(
																64 +
																	Number(
																		tutor.wing
																	)
														  )
														: "-"}
												</span>
												{typeof tutor.starttime ===
													"number" &&
													tutor.starttime !==
														null && (
														<span className="text-xs text-gray-500">
															Start Time:{" "}
															{new Date(
																tutor.starttime
															).toLocaleTimeString(
																[],
																{
																	hour: "2-digit",
																	minute: "2-digit",
																}
															)}
														</span>
													)}
											</div>
											<button
												className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md border-2 border-red-400 shadow font-sans font-semibold transition-colors duration-150"
												onClick={() =>
													handleCheckOut(tutor.id)
												}
											>
												End
											</button>
										</div>
									))
								)}
							</div>
						</div>
					</div>
					{error && (
						<div className="text-center text-red-500 mt-4 font-sans font-semibold">
							{error}
						</div>
					)}
				</div>
			</div>
			<AlertModal
				isOpen={showAlert}
				message={alertMessage}
				onConfirm={handleAlertConfirm}
				title={alertTitle}
				inputValue={pendingHours}
				onInputChange={(val) => setPendingHours(val)}
				inputLabel={"Hours to approve"}
			/>
			<Footer />
		</div>
	);
}

export default CheckInTutors;
