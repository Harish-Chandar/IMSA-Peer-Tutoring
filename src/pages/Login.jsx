import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';

export function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		// navigate("/adminDashboard", { replace: true }); TESTING PURPOSES ONLY
		try {
			const res = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (res.ok) {
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

	return (
		<div className="flex flex-col md:flex-row py-20 gap-6 items-start w-full">
			
			<div className="bg-white shadow-xl p-6 w-full md:w-1/2 rounded-2xl max-w-full mx-auto">
				<form onSubmit={handleSubmit} className="space-y-4">
					<h3 className="text-2xl font-semibold text-gray-800 mb-2 font-sans">Administrator Login</h3>
					<div>
						<label className="block text-gray-600 mb-1 font-sans">Email:</label>
						<input 
							type="email" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							required
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
					<div>
						<label className="block text-gray-600 mb-1 font-sans">Password:</label>
						<input 
							type="password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)} 
							required
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
					<button 
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-sans"
					>
						Log In!
					</button>
				</form>
			<p className="py-4 text-3xl text-red-600 font-sans">{error}</p>
			</div>
		</div>
	);
}

export default Login;