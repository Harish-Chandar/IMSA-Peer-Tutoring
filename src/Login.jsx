import React, { useState } from 'react';

export function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (res.ok) {
				alert("Login successful!");
				console.log("User access level:", data.access);
			} else {
				alert(data.error || "Login failed.");
			}
		} catch (err) {
			console.error("Error during login:", err);
			alert("Login failed due to server error.");
		}
	};

	return (
		<div >
		<form onSubmit={handleSubmit} >
		<div >
		<label>Email:</label>
		<input 
		type="email" 
		value={email} 
		onChange={(e) => setEmail(e.target.value)} 
		required
		/>
		</div>
		<div >
		<label>Password:</label>
		<input 
		type="password" 
		value={password} 
		onChange={(e) => setPassword(e.target.value)} 
		required
		/>
		</div>
		<button type="submit" >Log In</button>
		</form>
		</div>
	);
}

