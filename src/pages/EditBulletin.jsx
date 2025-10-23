import React, { useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import { useNavigate } from 'react-router-dom';
import { AlertModal } from '../components/AlertModal.jsx'

import { isTokenExpired, getTokenAccess } from "../util.ts"

function EditBulletin() {
	// environment variables for API configuration
	const DBPORT = process.env.REACT_APP_DBPORT || "5000";
	const HOST = process.env.REACT_APP_HOST || "localhost";
	const baseUrl = `https://${HOST}:${DBPORT}`;

	const token = localStorage.getItem("token");

	const navigate = useNavigate();
	useEffect(() => {
		if (!token || isTokenExpired(token)) {
			navigate('/login');
		}
        if ((token && !isTokenExpired(token) && getTokenAccess(token) != 1)) {
            navigate('/adminDashboard');
        }
	}, [token, navigate]);

	// bulletin board states - updated for backend integration
	const [posts, setPosts] = useState([]);

	// updated form state to match database schema
	const [newPost, setNewPost] = useState({
		title: "",
		content: "",
		event_date: "",
		author: "",
		contact_info: "",
		highpriority: false,
		image: "",
	});

	const availableImages = [
		{ id: 1, src: "/BulletinImages/imsa.jpg" },
		{ id: 2, src: "/BulletinImages/blackboard.jpg"},
		{ id: 3, src: "/BulletinImages/in2.jpg"},
	];

	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertTitle, setAlertTitle] = useState('');

	// fetch posts when page loads
	useEffect(() => {
		fetchPosts();
	}, []);

	// fetch posts from database
	const fetchPosts = async () => {
		try {
			const response = await fetch(`${baseUrl}/api/bulletin`);
			const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                const eventDate = new Date(data[i].event_date);
                eventDate.setDate(eventDate.getDate() + 1);
                
                if(eventDate < new Date()) {
                    const deletePost = await fetch(`${baseUrl}/api/bulletin/${data[i].id}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });
                    if (!deletePost.ok) {
                        console.error(`couldn't delete bulletin post`);
                    }
                    data.splice(i, 1);
                    i--;
                }
            }
			setPosts(data);
		} catch (error) {
			console.error("error fetching posts:", error);
		}
	};

	// handle form input changes for new post by changing a specified field's value
	const handlePostInputChange = (field, value) => {
		setNewPost((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// handle creating a new post - save to database
	const handleCreatePost = async () => {
		if (newPost.title && newPost.event_date) {
			// Check if event_date is before today
			const today = new Date();
			const eventDate = new Date(newPost.event_date);

			// If eventDate is before today, show AlertModal
            if (eventDate < today.setHours(0, 0, 0, 0)) {
				const inputMonth = eventDate.getMonth();
				const inputDate = eventDate.getDate();
				const thisYear = today.getFullYear();
				let newYear = thisYear;
				const todayMonth = (new Date()).getMonth();
				const todayDate = (new Date()).getDate();

				if (
					inputMonth < todayMonth ||
					(inputMonth === todayMonth && inputDate < todayDate)
				) {
					newYear = thisYear + 1;
				}

				setAlertTitle("Date Conflict!");
				setAlertMessage(
					`Clicking "OK" will update your entered year to ${newYear}.`
				);
				setShowAlert(true);

				// Store the new year for use in the modal callback
				setNewPost((prev) => ({
					...prev,
					_pendingYearUpdate: newYear
				}));

				return; // Exit early, wait for modal response
			}

			try {
				const response = await fetch(`${baseUrl}/api/bulletin`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: newPost.title,
						content: newPost.content,
						event_date: newPost.event_date,
						author: newPost.author || "Admin",
						contact_info: newPost.contact_info,
						highpriority: newPost.highpriority,
                        image:  newPost.image,
					}),
				});

				if (response.ok) {
					// refresh posts from database (not needed since I refresh anyway)
					// fetchPosts();

					// clear the form
					setNewPost({
						title: "",
						content: "",
						event_date: "",
						author: "",
						contact_info: "",
						highpriority: false,
						image: "",
					});

					window.location.reload(); // Refresh the page after successful post creation to reset the react state
				} else {
					alert("error creating post. please try again.");
				}
			} catch (error) {
				console.error("error creating post:", error);
				alert("error creating post. please try again.");
			}
		} else {
			alert("please fill in at least the event title and date.");
		}
	};

	// delete a post with confirmation popup - remove from database
	const handleDeletePost = async (postId) => {
        const postToDelete = posts.find((post) => post.id === postId);
		const confirmDelete = window.confirm(
			`Are you sure you want to delete the event "${postToDelete.title}"? This action cannot be undone.`
		);

		if (confirmDelete) {
			try {
				const response = await fetch(`${baseUrl}/api/bulletin/${postId}`, {
					method: "DELETE",
					headers: {
						"Authorization": `Bearer ${token}`,
					},
				});

				if (response.ok) {
					// refresh posts from database
					fetchPosts();
				} else {
					alert("error deleting post. please try again.");
				}
			} catch (error) {
				console.error("error deleting post:", error);
				alert("error deleting post. please try again.");
			}
		}
	};

	return (
		<div className="p-6 bg-gray-100 pt-14 min-h-screen">
			<div className="flex justify-between items-center mb-6 py-10">
				<button
					onClick={() => navigate('/adminDashboard')}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
				>
					Back to Dashboard
				</button>

				<h1 className="text-4xl font-bold text-gray-700">
					Edit Bulletin Board
				</h1>

				<div className="w-40"></div>
			</div>

			<div className="flex justify-center">
				<div className="rounded-2xl shadow-md p-8 bg-white border max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
					{/* Manage Posts Section */}
					<div className="flex flex-col mb-8">
						<label className="text-gray-700 font-bold mb-2 text-xl">Current Posts</label>
						<div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
							{posts.length === 0 ? (
								<p className="text-gray-500">No posts yet.</p>
							) : (
								posts.map((post) => (
									<div
										key={post.id}
										className={`px-3 py-2 rounded-md flex justify-between items-center border ${post.highpriority
												? "bg-blue-700 text-white border-blue-800"
												: "bg-blue-100 text-blue-800 border-blue-200"
											}`}
									>
										<span className="font-medium">
											{post.title} - {post.event_date}
										</span>
										<button
											onClick={() => handleDeletePost(post.id)}
											className="ml-2 text-red-600 hover:text-red-700 bg-transparent focus:outline-none font-bold text-lg"
										>
											×
										</button>
									</div>
								))
							)}
						</div>
					</div>

					{/* Create Post Section */}
					<div className="border-t pt-6 mt-6">
						<h3 className="text-gray-700 font-bold mb-4 text-xl">Create New Post</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							{/* Event Title */}
							<div className="flex flex-col">
								<label className="text-gray-700 font-bold mb-2">Event Title</label>
								<input
									type="text"
									placeholder="Enter event title..."
									value={newPost.title}
									onChange={(e) => handlePostInputChange("title", e.target.value)}
									className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
								/>
							</div>

							{/* Event Date */}
							<div className="flex flex-col">
								<label className="text-gray-700 font-bold mb-2">Event Date</label>
								{/* IDK HOW TO STYLE THIS GOOD LUCK VISHNU!!! @vishnu @vishnu @vishnu @vishnu */}
								<input
									type="date"
									value={newPost.event_date}
									onChange={(e) =>
										handlePostInputChange("event_date", e.target.value)
									}
									className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-500 text-gray-900"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							{/* Author */}
							<div className="flex flex-col">
								<label className="text-gray-700 font-bold mb-2">Author</label>
								<input
									type="text"
									placeholder="Enter author name..."
									value={newPost.author}
									onChange={(e) => handlePostInputChange("author", e.target.value)}
									className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
								/>
							</div>

							{/* Contact Info */}
							<div className="flex flex-col">
								<label className="text-gray-700 font-bold mb-2">Contact Info</label>
								<input
									type="text"
									placeholder="Enter contact information..."
									value={newPost.contact_info}
									onChange={(e) =>
										handlePostInputChange("contact_info", e.target.value)
									}
									className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
								/>
							</div>
						</div>

						{/* Description */}
						<div className="flex flex-col mb-4">
							<label className="text-gray-700 font-bold mb-2">Description</label>
							<textarea
								placeholder="Enter event description..."
								value={newPost.content}
								onChange={(e) => {
									if (e.target.value.length <= 110) {
										handlePostInputChange("content", e.target.value);
									}
								}}
								className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
								maxLength={110}
								rows={3}
							/>
							<div className="text-right text-sm text-gray-500 mt-1">
								{newPost.content.length}/110 characters
							</div>
						</div>

                        {/* Add Image */}
                        <div className="flex flex-col mb-4 items-center">
                            <label className="text-gray-700 font-bold mb-2 self-center">Post Image</label>
                            <div className="grid grid-cols-3 gap-4 max-w-xl">
                                {availableImages.map((image) => (   
                                    <div key={image.id} onClick={() => handlePostInputChange("image", image.src)} className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 hover:shadow-lg ${newPost.image === image.src ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300 hover:border-gray-400"}`}>
                                        <img src={image.src} className="w-full h-28 object-cover"/>
                                 </div>
                                ))}
                            </div>
                        </div>

						{/* High Priority Checkbox */}
						<div className="flex items-center mb-6">
							<input
								type="checkbox"
								checked={newPost.highpriority}
								onChange={(e) =>
									handlePostInputChange("highpriority", e.target.checked)
								}
								className="mr-3 appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<label className="text-gray-700 font-medium">High Priority</label>
						</div>

						{/* Create Post Button */}
						<button
							onClick={handleCreatePost}
							className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
						>
							Create Post
						</button>
					</div>
				</div>
			</div>

			<AlertModal
				isOpen={showAlert}
				message={alertMessage}
				onConfirm={(result) => {
					// true for OK, false for Cancel
					setShowAlert(false);
					if (result && newPost._pendingYearUpdate) {
						// Update the event date with the new year
						const updatedEventDate = new Date(newPost.event_date);
						updatedEventDate.setFullYear(newPost._pendingYearUpdate);
						
						// Update the state with the corrected date
						setNewPost((prev) => ({
							...prev,
							event_date: updatedEventDate.toISOString().slice(0, 10),
							_pendingYearUpdate: undefined // Clear the pending update
						}));
						
						// Call handleCreatePost again with the updated date
						setTimeout(() => handleCreatePost(), 0);
					}
				}}
				title={alertTitle}
			/>

			<Footer />
		</div>
	);
}

export default EditBulletin;
