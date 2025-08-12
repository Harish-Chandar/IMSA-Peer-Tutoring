import {useEffect, useRef, useState } from 'react';


const UploadWidget = ({ setImageUrl }) => {
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        const DBPORT = process.env.REACT_APP_DBPORT;
	    const HOST = process.env.REACT_APP_HOST;
	    const baseUrl = `http://${HOST}:${DBPORT}`;

        const token = localStorage.getItem("adminToken"); // whatever you store after login

        try {
            const res = await fetch(`${baseUrl}/api/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
            } else {
                console.error("Upload failed", data.error);
            }
        } catch (err) {
            console.error("Error uploading:", err);
        }
    };

    return (
        <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border p-2"
        />
    );
};



export default UploadWidget;
