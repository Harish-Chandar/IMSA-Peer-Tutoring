import {useEffect, useRef, useState } from 'react';


const UploadWidget = ({ setImageUrl }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [imageUrl, setImageUrls] = useState("");

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        // console.log(cloudinaryRef.current);
        widgetRef.current = cloudinaryRef.current.createUploadWidget({ // move everything after this (inside the parenthesis) into the server into a new route that handles the cloudinary upload, it can send back the URL 
            cloudName: 'dvhuka1ue', // move this to dotenv
            uploadPreset: 'peer-tutoring-preset'
        }, function(error, result) {
            if (!error && result && result.event === "success") {
                console.log("Image uploaded:", result.info.secure_url);
                setImageUrls(result.info.secure_url); 
                setImageUrl(result.info.secure_url);
            }
        }); // so everything before this
    }, [setImageUrl]);

    return(
        <div>
            <button type="button" onClick={() => widgetRef.current.open()} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"> 
                Upload Image
            </button>
        </div>
        
    )
}



export default UploadWidget;
