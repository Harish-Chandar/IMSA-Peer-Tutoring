import React, { useState, useEffect } from "react";
import AlertModal from "../components/AlertModal";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import { isTokenExpired, getTokenAccess, getTokenEmail } from "../util.ts";

export default function ManageAccounts() {
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token || isTokenExpired(token)) {
			navigate("/login");
		}
		if (token && !isTokenExpired(token) && getTokenAccess(token) != 1) {
			navigate("/adminDashboard");
		}
	}, [token, navigate]);

	const DBPORT = process.env.REACT_APP_DBPORT;
	const HOST = process.env.REACT_APP_HOST;
	const baseUrl = `http://${HOST}:${DBPORT}/api`;

	const [alertModal, setAlertModal] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: ((result: boolean) => void) | null;
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

	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
	});

	const validateEmail = (email: string) => {
		if (!email.trim()) return "Email is required";

		// Email regex pattern
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailPattern.test(email)) {
			return "Please enter a valid email address (e.g., user@example.com)";
		}

		return "";
	};

	const validatePassword = (password: string) => {
		if (!password.trim()) return "Password is required";
		if (password.length < 6)
			return "Password must be at least 6 characters long";
		return "";
	};

	const validateName = (name: string, fieldName: string) => {
		if (!name.trim()) return `${fieldName} is required`;
		if (name.length > 50)
			return `${fieldName} must be 50 characters or less`;
		return "";
	};

	const handleInputChange = (field: string, value: string) => {
		setNewAdmin({ ...newAdmin, [field]: value });

		// Validate the field being changed
		let error = "";
		switch (field) {
			case "firstName":
				error = validateName(value, "First name");
				break;
			case "lastName":
				error = validateName(value, "Last name");
				break;
			case "email":
				error = validateEmail(value);
				break;
			case "password":
				error = validatePassword(value);
				break;
			default:
				break;
		}

		setFormErrors({ ...formErrors, [field]: error });
	};

	function createAdminAccount() {
		if (!token) {
			setAlertModal({
				isOpen: true,
				title: "Authentication Error",
				message: "No authentication token found. Please log in again.",
				onConfirm: (confirmed) => {
					if (confirmed) {
						setAlertModal({ ...alertModal, isOpen: false });
						navigate("/login");
					} else {
						setAlertModal({ ...alertModal, isOpen: false });
					}
				},
			});
			return;
		}

		setIsLoading(true);
		fetch(`${baseUrl}/admin/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				email: newAdmin.email,
				password: newAdmin.password,
				role: parseInt(newAdmin.role), // Convert role to integer
			}),
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((errorData) => {
						throw new Error(
							errorData.error ||
								`HTTP ${response.status}: ${response.statusText}`
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				setAlertModal({
					isOpen: true,
					title:
						"Account for " +
						newAdmin.firstName +
						" " +
						newAdmin.lastName,
					message:
						"Account with Access Level " +
						newAdmin.role +
						" created successfully! \n Please contact " +
						newAdmin.email +
						" with their password: " +
						newAdmin.password +
						"",
					onConfirm: (confirmed) => {
						if (confirmed) {
							setAlertModal({ ...alertModal, isOpen: false });
							setNewAdmin({
								firstName: "",
								lastName: "",
								email: "",
								password: "",
								role: "",
							});
							setFormErrors({
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
									Authorization: `Bearer ${token}`,
								},
							})
								.then((response) => {
									if (!response.ok) {
										throw new Error(
											"Failed to fetch admin accounts"
										);
									}
									return response.json();
								})
								.then((data) => {
									setAdmins(data);
								})
								.catch((error) => {
									console.error(
										"Error fetching admin accounts:",
										error
									);
								});
						} else {
							setAlertModal({ ...alertModal, isOpen: false });
						}
					},
				});
			})
			.catch((error) => {
				setAlertModal({
					isOpen: true,
					title: "Account Creation Failed",
					message: error.message || "An unexpected error occurred.",
					onConfirm: (confirmed) => {
						setAlertModal({ ...alertModal, isOpen: false });
					},
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function handleAddAdmin() {
		// Validate all fields before submitting
		const firstNameError = validateName(newAdmin.firstName, "First name");
		const lastNameError = validateName(newAdmin.lastName, "Last name");
		const emailError = validateEmail(newAdmin.email);
		const passwordError = validatePassword(newAdmin.password);
		const roleError = !newAdmin.role ? "Role is required" : "";

		const newErrors = {
			firstName: firstNameError,
			lastName: lastNameError,
			email: emailError,
			password: passwordError,
			role: roleError,
		};

		setFormErrors(newErrors);

		// Check if there are any validation errors
		if (
			firstNameError ||
			lastNameError ||
			emailError ||
			passwordError ||
			roleError
		) {
			setAlertModal({
				isOpen: true,
				title: "Validation Error",
				message: "Please fix all validation errors before submitting.",
				onConfirm: (confirmed) => {
					setAlertModal({ ...alertModal, isOpen: false });
				},
			});
			return;
		}

		if (!newAdmin.email || !newAdmin.password || !newAdmin.role) {
			setAlertModal({
				isOpen: true,
				title: "Account Creation Failure",
				message: "Please fill in email, password, and role fields.",
				onConfirm: (confirmed) => {
					setAlertModal({ ...alertModal, isOpen: false });
				},
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
			onConfirm: (confirmed) => {
				setAlertModal({ ...alertModal, isOpen: false });

				if (!confirmed) {
					// User clicked Cancel, do nothing
					return;
				}

				// User clicked OK, proceed with deletion
				fetch(`${baseUrl}/admins/${adminEmail}/delete`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ email: adminEmail }),
				})
					.then((response) => {
						if (!response.ok) {
							return response.json().then((errorData) => {
								throw new Error(
									errorData.error ||
										`HTTP ${response.status}: ${response.statusText}`
								);
							});
						}
						return response.json();
					})
					.then((data) => {
						setAlertModal({
							isOpen: true,
							title: "Success",
							message: `Admin account "${adminEmail}" has been deleted successfully.`,
							onConfirm: (confirmed) => {
								if (confirmed) {
									setAlertModal({
										...alertModal,
										isOpen: false,
									});
									// Refresh the admin list
									setAdmins(
										admins.filter(
											(admin) =>
												admin.email !== adminEmail
										)
									);
								} else {
									setAlertModal({
										...alertModal,
										isOpen: false,
									});
								}
							},
						});
					})
					.catch((error) => {
						console.error("Error deleting admin account:", error);
						setAlertModal({
							isOpen: true,
							title: "Deletion Failed",
							message:
								error.message ||
								"An unexpected error occurred while deleting the admin account.",
							onConfirm: (confirmed) => {
								setAlertModal({ ...alertModal, isOpen: false });
							},
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
				Authorization: `Bearer ${token}`,
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
										First Name *
									</label>
									<input
										type="text"
										value={newAdmin.firstName}
										onChange={(e) =>
											handleInputChange(
												"firstName",
												e.target.value
											)
										}
										placeholder="Enter first name..."
										className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white text-gray-900 ${
											formErrors.firstName
												? "border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										}`}
										maxLength={50}
										required
									/>
									{formErrors.firstName && (
										<span className="text-red-500 text-sm mt-1">
											{formErrors.firstName}
										</span>
									)}
									<span className="text-gray-500 text-xs mt-1">
										{newAdmin.firstName.length}/50
										characters
									</span>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Last Name *
									</label>
									<input
										type="text"
										value={newAdmin.lastName}
										onChange={(e) =>
											handleInputChange(
												"lastName",
												e.target.value
											)
										}
										placeholder="Enter last name..."
										className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white text-gray-900 ${
											formErrors.lastName
												? "border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										}`}
										maxLength={50}
										required
									/>
									{formErrors.lastName && (
										<span className="text-red-500 text-sm mt-1">
											{formErrors.lastName}
										</span>
									)}
									<span className="text-gray-500 text-xs mt-1">
										{newAdmin.lastName.length}/50 characters
									</span>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Email *
									</label>
									<input
										type="email"
										value={newAdmin.email}
										onChange={(e) =>
											handleInputChange(
												"email",
												e.target.value
											)
										}
										placeholder="Enter email..."
										className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white text-gray-900 ${
											formErrors.email
												? "border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										}`}
										required
									/>
									{formErrors.email && (
										<span className="text-red-500 text-sm mt-1">
											{formErrors.email}
										</span>
									)}
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Password *
									</label>
									<input
										type="text"
										placeholder="Enter password..."
										className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white text-gray-900 ${
											formErrors.password
												? "border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										}`}
										value={newAdmin.password}
										onChange={(e) =>
											handleInputChange(
												"password",
												e.target.value
											)
										}
										required
									/>
									{formErrors.password && (
										<span className="text-red-500 text-sm mt-1">
											{formErrors.password}
										</span>
									)}
									<span className="text-gray-500 text-xs mt-1">
										Minimum 6 characters required
									</span>
								</div>

								<div className="flex flex-col">
									<label className="text-gray-700 font-bold mb-2">
										Role of Administrator *
									</label>
									<select
										className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white text-gray-900 ${
											formErrors.role
												? "border-red-500 focus:ring-red-500"
												: "border-gray-300 focus:ring-blue-500"
										}`}
										value={newAdmin.role}
										onChange={(e) => {
											setNewAdmin({
												...newAdmin,
												role: e.target.value,
											});
											setFormErrors({
												...formErrors,
												role: "",
											});
										}}
										required
									>
										<option value="">Select Role</option>
										<option value="1">
											Top Level Administrator
										</option>
										<option value="2">Teacher</option>
										<option value="3">
											Resident Counselor
										</option>
									</select>
									{formErrors.role && (
										<span className="text-red-500 text-sm mt-1">
											{formErrors.role}
										</span>
									)}
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
						<div className="rounded-2xl shadow-md p-6 bg-white border h-full flex flex-col">
							<div className="flex flex-col h-full">
								<h3 className="text-xl font-bold text-gray-700 mb-4">
									Manage Admin Accounts
								</h3>

								<div className="border rounded-lg p-3 bg-gray-50 flex-1 flex flex-col">
									<h4 className="font-bold text-gray-700 mb-2">
										Administrators List
									</h4>
									<div className="flex-1 overflow-y-auto space-y-2">
										{admins.map((admin) => {
											const currentUserEmail =
												getTokenEmail(token);
											const isCurrentUser =
												admin.email ===
												currentUserEmail;

											return (
												<div
													key={admin.id}
													className="bg-white rounded border p-2 hover:shadow-sm transition-shadow duration-200"
												>
													<div className="flex justify-between items-center">
														<div className="flex-1">
															<div className="font-medium text-blue-600 text-xs mb-0.5">
																{admin.email}
															</div>
															<div className="text-gray-500 text-xs">
																{admin.access ===
																1
																	? "Administrator"
																	: admin.access ===
																	  2
																	? "Teacher"
																	: admin.access ===
																	  3
																	? "Resident Counselor"
																	: "???"}
															</div>
														</div>
														<div className="ml-2 flex items-center">
															{isCurrentUser ? (
																<div
																	className="bg-green-600 text-white p-1.5 rounded flex items-center justify-center cursor-not-allowed opacity-75"
																	title="Cannot delete your own account"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="12"
																		height="12"
																		fill="currentColor"
																		className="bi bi-slash-circle"
																		viewBox="0 0 16 16"
																	>
																		<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
																		<path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
																	</svg>
																</div>
															) : (
																<button
																	onClick={() =>
																		deleteAdmin(
																			admin.email
																		)
																	}
																	className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors duration-200 flex items-center justify-center"
																	title="Delete admin account"
																>
																	<svg
																		className="w-3 h-3"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={
																				2
																			}
																			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																		/>
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
				inputValue={undefined}
				onInputChange={undefined}
				inputLabel={undefined}
			/>
		</>
	);
}
