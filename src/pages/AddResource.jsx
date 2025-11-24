import { useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, getTokenAccess, departments } from "../util.ts";
import AlertModal from "../components/AlertModal.jsx";

const DBPORT = process.env.REACT_APP_DBPORT;
const HOST = process.env.REACT_APP_HOST;
const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';
const token = localStorage.getItem("token");

function ResourceForm() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || isTokenExpired(token)) {
			navigate("/login");
		}
		if (
			token &&
			!isTokenExpired(token) &&
			(getTokenAccess(token) < 1 || getTokenAccess(token) > 2)
		) {
			navigate("/adminDashboard");
		}
	}, []);

	const [formData, setFormData] = useState({
		teacher: "",
		email: "",
		course: "",
		department: "",
		url: "",
		type: "",
	});

	const [links, setLinks] = useState([{ label: "", url: "" }]);
	const [linkErrors, setLinkErrors] = useState([{ label: "", url: "" }]);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertTitle, setAlertTitle] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateUrl = (url) => {
		if (!url.trim()) return "URL is required";

		// Basic URL pattern: must have a domain with dot and valid extension
		const urlPattern =
			/^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+([\/\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

		if (!urlPattern.test(url)) {
			return "Please enter a valid URL (e.g., google.com, www.example.com, https://site.com)";
		}

		return "";
	};

	const normalizeUrl = (url) => {
		if (!url.trim()) return url;

		// Add https:// if no protocol is provided
		if (!/^https?:\/\//i.test(url.trim())) {
			return `https://${url.trim()}`;
		}

		return url.trim();
	};

	const validateLinkLabel = (label) => {
		if (!label.trim()) return "Label is required";
		if (label.length > 75) return "Label must be 75 characters or less";
		return "";
	};

	const handleLinkChange = (index, field, value) => {
		const newLinks = [...links];
		const newErrors = [...linkErrors];

		newLinks[index][field] = value;

		// Validate the field being changed
		if (field === "label") {
			newErrors[index].label = validateLinkLabel(value);
		} else if (field === "url") {
			newErrors[index].url = validateUrl(value);
		}

		setLinks(newLinks);
		setLinkErrors(newErrors);

		// Update formData for the first link
		if (index === 0 && field === "url") {
			setFormData({ ...formData, url: normalizeUrl(value) });
		}
	};

	const addLink = () => {
		setLinks([...links, { label: "", url: "" }]);
		setLinkErrors([...linkErrors, { label: "", url: "" }]);
	};

	const removeLink = (index) => {
		if (links.length > 1) {
			const newLinks = [...links];
			const newErrors = [...linkErrors];
			newLinks.splice(index, 1);
			newErrors.splice(index, 1);
			setLinks(newLinks);
			setLinkErrors(newErrors);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate all links before submitting
		let hasErrors = false;
		const newErrors = links.map((link) => {
			const labelError = validateLinkLabel(link.label);
			const urlError = validateUrl(link.url);

			if (labelError || urlError) {
				hasErrors = true;
			}

			return { label: labelError, url: urlError };
		});

		setLinkErrors(newErrors);

		if (hasErrors) {
			setAlertTitle("Validation Error");
			setAlertMessage(
				"Please fix all validation errors before submitting."
			);
			setShowAlert(true);
			return;
		}

		// Normalize URLs before sending
		const normalizedLinks = links.map((link) => ({
			label: link.label.trim(),
			url: normalizeUrl(link.url),
		}));

		const resourceData = {
			...formData,
			url: normalizeUrl(formData.url), // Normalize the main URL too
			links: normalizedLinks,
		};

		const protocol = DEV_SERVER ? 'http' : 'https';
		const baseUrl = `${protocol}://${HOST}:${DBPORT}`;
		try {
			const response = await fetch(`${baseUrl}/api/resources`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(resourceData),
			});

			const data = await response.json();

			if (response.ok) {
				setFormData({
					teacher: "",
					email: "",
					course: "",
					department: "",
					url: "",
					type: "",
				});
				setLinks([{ label: "", url: "" }]);
				setLinkErrors([{ label: "", url: "" }]);
				setAlertTitle("Success");
				setAlertMessage("Resource added successfully!");
				setShowAlert(true);
			} else {
				setAlertTitle("Error");
				setAlertMessage("Error adding resource: " + data.error);
				setShowAlert(true);
			}
		} catch (error) {
			setAlertTitle("Network Error");
			setAlertMessage("Network error: " + error.message);
			setShowAlert(true);
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
					Add New Course
				</h1>
				<div className="w-40"></div>
			</div>

			<div className="flex justify-center">
				<div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Teacher Name */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-bold mb-2">
								Teachers Names
							</label>
							<input
								className="border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
								name="teacher"
								value={formData.teacher}
								onChange={handleChange}
								placeholder="Teachers names"
								required
							/>
						</div>

						{/* Email */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-bold mb-2">
								Email
							</label>
							<input
								type="email"
								className="border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Email"
								required
							/>
						</div>

						{/* Course */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-bold mb-2">
								Course
							</label>
							<input
								className="border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
								name="course"
								value={formData.course}
								onChange={handleChange}
								placeholder="Course name"
								required
							/>
						</div>

						{/* Department */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-bold mb-2">
								Department
							</label>
							<select
								className="border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
								name="department"
								value={formData.department}
								onChange={handleChange}
								required
							>
								<option value="" disabled>
									Select a department
								</option>
								{departments.map((dept) => (
									<option key={dept} value={dept}>
										{dept}
									</option>
								))}
							</select>
						</div>

						{/* Resource Links */}
						<div className="border-t pt-6 mt-6">
							<h3 className="text-xl font-bold mb-4 text-gray-700">
								Resource Links
							</h3>

							{links.map((link, index) => (
								<div
									key={index}
									className="flex flex-col mb-4 p-4 border rounded-lg bg-gray-50"
								>
									<div className="flex justify-between items-center mb-3">
										<span className="font-bold text-gray-700">
											Link #{index + 1}
										</span>
										{links.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeLink(index)
												}
												className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md font-semibold transition-all duration-200"
											>
												Remove
											</button>
										)}
									</div>

									<div className="flex flex-col mb-3">
										<label className="text-gray-700 mb-2">
											Label *
										</label>
										<input
											className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 ${
												linkErrors[index]?.label
													? "border-red-500 focus:ring-red-500"
													: "border-gray-300 focus:ring-blue-500"
											}`}
											value={link.label}
											onChange={(e) =>
												handleLinkChange(
													index,
													"label",
													e.target.value
												)
											}
											placeholder="Link Label (e.g. Syllabus, Worksheet)"
											maxLength={75}
											required
										/>
										{linkErrors[index]?.label && (
											<span className="text-red-500 text-sm mt-1">
												{linkErrors[index].label}
											</span>
										)}
										<span className="text-gray-500 text-xs mt-1">
											{link.label.length}/75 characters
										</span>
									</div>

									<div className="flex flex-col">
										<label className="text-gray-700 mb-2">
											URL *
										</label>
										<input
											className={`border rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 ${
												linkErrors[index]?.url
													? "border-red-500 focus:ring-red-500"
													: "border-gray-300 focus:ring-blue-500"
											}`}
											value={link.url}
											onChange={(e) =>
												handleLinkChange(
													index,
													"url",
													e.target.value
												)
											}
											placeholder="example.com, www.google.com, or https://site.com"
											required
										/>
										{linkErrors[index]?.url && (
											<span className="text-red-500 text-sm mt-1">
												{linkErrors[index].url}
											</span>
										)}
										<span className="text-gray-500 text-xs mt-1">
											{link.url &&
											!link.url.startsWith("http")
												? `Will be saved as: https://${link.url}`
												: ""}
										</span>
									</div>
								</div>
							))}

							<button
								type="button"
								onClick={addLink}
								className="mt-3 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-all duration-200"
							>
								+ Add Another Link
							</button>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
						>
							Add Resource
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
				}}
				title={alertTitle}
			/>
		</div>
	);
}

export default ResourceForm;
