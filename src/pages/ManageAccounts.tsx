import React, { useState, useEffect } from 'react';
import AlertModal from "../components/AlertModal";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

import { isTokenExpired, getTokenAccess, getTokenEmail } from "../util.ts"


export default function ManageAccounts() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
	    if (!token || isTokenExpired(token)) {
			navigate("/login");
		}
		if ((token && !isTokenExpired(token) && getTokenAccess(token) != 1)) {
			navigate("/dashboard");
		};
	}, [token, navigate]);
		
    const DBPORT = process.env.REACT_APP_DBPORT;
    const HOST = process.env.REACT_APP_HOST;
    const baseUrl = `http://${HOST}:${DBPORT}/api`;

    const [alertModal, setAlertModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: (() => void) | null;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
    });

	const [newAdmin, setNewAdmin] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
	});

	function createAdminAccount() {
		if (!token) {
			setAlertModal({
				isOpen: true,
				title: "Authentication Error",
				message: "No authentication token found. Please log in again.",
				onConfirm: () => {
					setAlertModal({ ...alertModal, isOpen: false });
					navigate("/login");
				},
			});
			return;
		}

		setIsLoading(true);
		fetch(`${baseUrl}/admin/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({
				email: newAdmin.email,
				password: newAdmin.password,
				role: parseInt(newAdmin.role) // Convert role to integer
			}),
		})
		.then((response) => {
			if (!response.ok) {
				return response.json().then(errorData => {
					throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
				});
			}
			return response.json();
		})
		.then((data) => {
			setAlertModal({
				isOpen: true,
				title: "Account for " + newAdmin.firstName + " " + newAdmin.lastName,
				message: "Account with Access Level " + newAdmin.role + " created successfully! \n Please contact " + newAdmin.email + " with their password: " + newAdmin.password + "",
				onConfirm: () => {
					setAlertModal({ ...alertModal, isOpen: false });
					setNewAdmin({
						firstName: "",
						lastName: "",
						email: "",
						password: "",
						role: "",
					});

					// Refresh the list of admins after successful creation
					fetch(`${baseUrl}/admins`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
					})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch admin accounts");
						}
						return response.json();
					})
					.then((data) => {
						setAdmins(data);
					})
					.catch((error) => {
						console.error("Error fetching admin accounts:", error);
					});
				},
			});
		})
		.catch((error) => {
			setAlertModal({
				isOpen: true,
				title: "Account Creation Failed",
				message: error.message || "An unexpected error occurred.",
				onConfirm: () => setAlertModal({ ...alertModal, isOpen: false }),
			});
		})
		.finally(() => {
			setIsLoading(false);
		});
	}

    function handleAddAdmin() {
        if (!newAdmin.email || !newAdmin.password || !newAdmin.role) {
            setAlertModal({
                isOpen: true,
                title: "Account Creation Failure",
                message: "Please fill in email, password, and role fields.",
                onConfirm: () => setAlertModal({ ...alertModal, isOpen: false }),
            });
            return;
        }

        createAdminAccount();
    }

    function deleteAdmin(adminEmail: string) {
        setAlertModal({
            isOpen: true,
            title: "Confirm Deletion",
            message: `Are you sure you want to delete admin account "${adminEmail}"? This action cannot be undone.`,
            onConfirm: () => {
                setAlertModal({ ...alertModal, isOpen: false });

                fetch(`${baseUrl}/admins/${adminEmail}/delete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email: adminEmail }),
                })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    setAlertModal({
                        isOpen: true,
                        title: "Success",
                        message: `Admin account "${adminEmail}" has been deleted successfully.`,
                        onConfirm: () => {
                            setAlertModal({ ...alertModal, isOpen: false });
                            // Refresh the admin list
                            setAdmins(admins.filter(admin => admin.email !== adminEmail));
                        },
                    });
                })
                .catch((error) => {
                    console.error("Error deleting admin account:", error);
                    setAlertModal({
                        isOpen: true,
                        title: "Deletion Failed",
                        message: error.message || "An unexpected error occurred while deleting the admin account.",
                        onConfirm: () => setAlertModal({ ...alertModal, isOpen: false }),
                    });
                });
            },
        });
    }

    const [isLoading, setIsLoading] = useState(false);

    const [admins, setAdmins] = useState<any[]>([]);
    useEffect(() => {
        fetch(`${baseUrl}/admins`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch admin accounts");
            }
            return response.json();
        })
        .then((data) => {
            setAdmins(data);
        })
        .catch((error) => {
            console.error("Error fetching admin accounts:", error);
        });
    }, [token]);

	return (
			<>
            <div className="flex justify-between items-center mb-6 mt-12 py-10">
                <button
                    onClick={() => navigate("/adminDashboard")}
                    className="px-4 py-2 ms-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold text-gray-700">
                    Manage Administrator Accounts 
                </h1>

                <div className="w-40"></div>
            </div>

            <div className="flex justify-center">
                <div className="max-w-2xl md:max-w-4xl lg:max-w-6xl w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left card - Add tutor form */}
                        <div className="rounded-2xl shadow-md p-8 bg-white border h-full">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-700 mb-6">
                                    Add New Account 
                                </h3>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
										value={newAdmin.firstName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                                        placeholder="Enter first name..."
                                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
										value={newAdmin.lastName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                                        placeholder="Enter last name..."
                                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
										value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        placeholder="Enter email..."
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                        required
                                    />
                                </div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										New Password
									</label>
									<input
										type="text"
										placeholder="Enter password..."
										className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
										value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
										required
									/>
								</div>

								<div className="flex flex-col">
                                    <label className="text-gray-700 font-bold mb-2">
                                        Role of Administrator
                                    </label>
                                    <select
									className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
									value={newAdmin.role}
										onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
										required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="1">Top Level Administrator</option>
                                        <option value="2">Teacher</option>
                                        <option value="3">Resident Counselor</option>
                                    </select>
                                </div>

                                
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    onClick={handleAddAdmin}
                                    disabled={isLoading}
                                >
									Add New Account
                                </button>
                            </div>
                        </div>

                        {/* Right card - Manage section */}
                        <div className="rounded-2xl shadow-md p-8 bg-white border h-[4859px] flex flex-none flex-col">
                            <div className="flex flex-col h-full">
                                <h3 className="text-2xl font-bold text-gray-700 mb-6">
                                    Manage Admin Accounts
                                </h3>

								<div className="border rounded-lg p-4 bg-gray-50 flex-none flex flex-col">
                                    <h4 className="font-bold text-gray-700 mb-3">
                                        Administrators List
                                    </h4>
                                    <div className="h-full flex-none overflow-y-scroll space-y-3">
                                        {admins.map((admin) => {
                                            const currentUserEmail = getTokenEmail(token);
                                            const isCurrentUser = admin.email === currentUserEmail;
                                            
                                            return (
                                            <div key={admin.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-blue-600 text-lg mb-1">
                                                            {admin.email}
                                                        </div>
                                                        <div className="text-gray-500 text-xs mt-1">
                                                            {admin.access === 1 ? 'Administrator' : 
                                                             admin.access === 2 ? 'Teacher' : 
                                                             admin.access === 3 ? 'Resident Counselor' : '???'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex items-center space-x-3">
                                                        {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            admin.access === 1 ? 'bg-red-300 text-red-800' :
                                                            admin.access === 2 ? 'bg-purple-200 text-purple-700' :
                                                            admin.access === 3 ? 'bg-blue-200 text-blue-700' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            Level {admin.access}
                                                        </span>
														*/}
                                                        {isCurrentUser ? (
                                                            <div
                                                                className="bg-green-600 text-white p-3 rounded-md flex items-center justify-center cursor-not-allowed opacity-75"
                                                                title="Cannot delete your own account"
                                                            >
                                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-slash-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708"/>
</svg> 
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => deleteAdmin(admin.email)}
                                                                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-md transition-colors duration-200 flex items-center justify-center"
                                                                title="Delete admin account"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            );
                                        })}
                                        {admins.length === 0 && (
                                            <div className="text-center text-gray-500 py-8">
                                                No administrators found
                                            </div>
                                        )}
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <AlertModal
                isOpen={alertModal.isOpen}
                title={alertModal.title}
                message={alertModal.message}
                onConfirm={alertModal.onConfirm}
            />
		</>
    );
}
