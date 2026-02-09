import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import AlertModal from "../components/AlertModal";

import { isTokenExpired, getTokenAccess, getTokenEmail } from "../util.ts"

function ChangePassword() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';
    const protocol = DEV_SERVER ? 'http' : 'https';
    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const baseUrl = `${protocol}://${HOST}:${DBPORT}/api`;

    useEffect(() => {
        if (!token || isTokenExpired(token) || getTokenAccess(token) < 1 || getTokenAccess(token) > 3) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = "New password must be different from current password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!token) {
            setAlertTitle("Authentication Error");
            setAlertMessage("No authentication token found. Please log in again.");
            setShowAlert(true);
            return;
        }

        if (isTokenExpired(token)) {
            setAlertTitle("Session Expired");
            setAlertMessage("Your session has expired. Please log in again.");
            setShowAlert(true);
            return;
        }

        setIsLoading(true);

        try {
            const userEmail = getTokenEmail(token);
            
            const encodedEmail = encodeURIComponent(userEmail);
            const response = await fetch(`${baseUrl}/admins/${encodedEmail}/passwordchange`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAlertTitle("Success");
                setAlertMessage("Your password has been updated successfully!");
                setShowAlert(true);
                
                // Clear the form
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setErrors({});
            } else {
                setAlertTitle("Password Change Failed");
                setAlertMessage(data.error || "An error occurred while changing your password.");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Network error:", error);
            setAlertTitle("Network Error");
            setAlertMessage("Unable to connect to the server. Please try again later.");
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

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
                    Change Password
                </h1>
                <div className="w-40"></div>
            </div>

            <div className="flex justify-center">
                <div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3">
                            Update Your Password
                        </h2>
                        <p className="text-gray-600">
                            Logged in as <span className="italic font-medium">{getTokenEmail(token)}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                                    errors.currentPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter your current password"
                                required
                            />
                            {errors.currentPassword && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.currentPassword}
                                </span>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                                    errors.newPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                required
                            />
                            {errors.newPassword && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.newPassword}
                                </span>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-bold mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                                    errors.confirmPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                required
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {isLoading ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
            
            <AlertModal
                isOpen={showAlert}
                message={alertMessage}
                onConfirm={(result) => {
                    setShowAlert(false);
                    // If password change was successful, navigate back to dashboard
                    if (alertTitle === "Success") {
                        navigate('/adminDashboard');
                    }
                }}
                title={alertTitle}
            />
        </div>
    );
}

export default ChangePassword;
