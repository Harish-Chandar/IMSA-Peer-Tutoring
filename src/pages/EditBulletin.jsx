import React, { useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import { useNavigate } from 'react-router-dom';

import { isTokenExpired } from "../util.ts"

function EditBulletin() {
  // environment variables for API configuration
  const DBPORT = process.env.REACT_APP_DBPORT || "5000";
  const HOST = process.env.REACT_APP_HOST || "localhost";
  const baseUrl = `http://${HOST}:${DBPORT}`;

  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      navigate('/login', { replace: true });
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
  });

  // fetch posts when page loads
  useEffect(() => {
    fetchPosts();
  }, []);

  // fetch posts from database
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/bulletin`);
      const data = await response.json();
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
          }),
        });

        if (response.ok) {
          // refresh posts from database
          fetchPosts();

          // clear the form
          setNewPost({
            title: "",
            content: "",
            event_date: "",
            author: "",
            contact_info: "",
            highpriority: false,
          });
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
    <div className="p-6 bg-gray-100 pt-14">
      <h1 className="text-4xl mb-6 text-center font-bold py-10 text-blue-500">
        Edit Bulletin Board
      </h1>
      <div className="flex justify-center">
        <div className="rounded-2xl shadow-md p-4 bg-white border max-w-2xl w-full">
          <h2 className="py-4 text-3xl font-bold mb-2 font-sans text-blue-500">
            Bulletin Board
          </h2>

          <h3 className="font-sans text-xl font-bold text-gray-600 mb-3  mt-2">
            Manage Posts
          </h3>
          <div className="w-full h-40 border rounded-md p-3 overflow-y-auto bg-gray-50 space-y-2">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>
                    {post.title} - {post.event_date}
                    {post.highpriority && (
                      <span className="text-red-600 font-bold">
                        {" "}
                        (HIGH PRIORITY)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="ml-2 text-blue-800 hover:text-blue-900 bg-transparent focus:outline-none"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <h3 className="font-sans text-xl font-bold text-gray-600 mb-2 mt-8">
            Create Post
          </h3>

          <p className="font-sans font-bold text-gray-700 text-left">
            Title of event:
          </p>
          <input
            type="text"
            placeholder="Enter event title..."
            value={newPost.title}
            onChange={(e) => handlePostInputChange("title", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-sans font-bold text-gray-700 text-left py-2">
            Date of event:
          </p>
          {/* IDK HOW TO STYLE THIS GOOD LUCK VISHNU!!! @vishnu @vishnu @vishnu @vishnu */}
          <input
            type="date"
            value={newPost.event_date}
            onChange={(e) =>
              handlePostInputChange("event_date", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white placeholder:text-gray-500 text-black"
          />

          <p className="font-bold py-2 font-sans text-gray-700 text-left">
            Author:
          </p>
          <input
            type="text"
            placeholder="Enter author name..."
            value={newPost.author}
            onChange={(e) => handlePostInputChange("author", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className=" font-bold py-2 font-sans text-gray-700 text-left">
            Contact Info:
          </p>
          <input
            type="text"
            placeholder="Enter contact information..."
            value={newPost.contact_info}
            onChange={(e) =>
              handlePostInputChange("contact_info", e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
          />

          <p className="font-bold py-2 font-sans text-gray-700 text-left">
            Description:
          </p>
          <textarea
            placeholder="Enter event description..."
            value={newPost.content}
            onChange={(e) => {
              if (e.target.value.length <= 110) {
                handlePostInputChange("content", e.target.value);
              }
            }}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white text-black"
            maxLength={110}
          />
          <div className="text-right text-sm text-gray-500 mb-2">
            {newPost.content.length}/110 characters
          </div>

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={newPost.highpriority}
              onChange={(e) =>
                handlePostInputChange("highpriority", e.target.checked)
              }
              className="mr-2 appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 accent-white"
            />
            <span className="font-sans text-gray-700">High Priority</span>
          </label>

          <button
            onClick={handleCreatePost}
            className="w-1/3 text-lg bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all duration-200"
          >
            Post
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditBulletin;