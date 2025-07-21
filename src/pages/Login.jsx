import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import Footer from "../components/Footer";


export function Login() {
    // environment variables for API configuration
    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const baseUrl = `http://${HOST}:${DBPORT}`;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // navigate("/adminDashboard", { replace: true }); TESTING PURPOSES ONLY
        try {
            const res = await fetch(`${baseUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/adminDashboard", { replace: true });
                console.log("User access level:", data.access);
            } else {
                setError("Login failed.");
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("Login failed due to server error.");
        }
    };

    // example for showing the alert
    const handleTestButtonClick = () => {
        setModalTitle("testing");
        setModalMessage("lehfsgs etg");
        setShowModal(true);
    };

    return (
        <div className="bg-gray-100">
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="bg-white shadow-2xl p-10 w-full max-w-2xl rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-3xl font-bold text-blue-500 text-center">
                            Admin Login
                        </h3>

                        <div>
                            <label className="block text-gray-700 mb-1 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            className="w-full text-lg bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-md font-semibold transition-all duration-200 mb-2"
                            onClick={handleTestButtonClick}
                        >
                            Test Button
                        </button>

                        <button
                            type="submit"
                            className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all duration-200"
                        >
                            Log In
                        </button>
                        {error && (
                            <p className="text-red-600 text-center text-sm font-medium">
                                {error}
                            </p>
                        )}
                    </form>
                </div>
                <AlertModal
                    isOpen={showModal}
                    message={modalMessage}
                    onConfirm={(result) => {
                        if (result) {
                            console.log("Alert OK");
                        } else {
                            console.log("Alert Cancel");
                        }
                        setShowModal(false);
                    }}
                    title={modalTitle}
                />
            </div>
            <Footer />
        </div>
    );
}

export default Login;
