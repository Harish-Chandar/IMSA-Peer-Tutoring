import { apiFetch as fetch } from "../apiFetch.js";
import {useEffect, useRef, useState } from 'react';
import { AlertModal } from './AlertModal.jsx';

const UploadWidget = ({ setImageUrl }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        

        const formData = new FormData();
        formData.append("image", file);
        const DBPORT = process.env.REACT_APP_DBPORT;
	    const HOST = process.env.REACT_APP_HOST;
	    const DEV_SERVER = process.env.REACT_APP_DEV_SERVER == 'true';
	    const protocol = DEV_SERVER ? 'http' : 'https';
	    const baseUrl = `${protocol}://${HOST}:${DBPORT}`;

        try {
            const res = await fetch(`${baseUrl}/api/upload-image`, {
                method: "POST",
                headers: {
                },
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
            } else {
                setAlertTitle("Upload Failed");
	            setAlertMessage("Upload failed. Please try again. Error: " + (data.error || "Unknown error"));
	            setShowAlert(true);
            }
        } catch (err) {
            setAlertTitle("Upload Failed");
	        setAlertMessage("Upload failed. Please try again. Error: " + err.message);
	        setShowAlert(true);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={showAlert}
                message={alertMessage}
                onConfirm={(result) => {
                    setShowAlert(false);
                }}
                title={alertTitle}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="border p-2"
            />
        </>
    );
};



export default UploadWidget;
