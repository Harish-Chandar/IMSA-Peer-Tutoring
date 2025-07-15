import { useEffect, useRef } from 'react';

const UploadWidget = ({ setImageUrl }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dvhuka1ue',
        uploadPreset: 'peer-tutoring-preset'
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          console.log("Image uploaded:", result.info.secure_url);
          setImageUrl(result.info.secure_url); 
        }
      }
    );
  }, [setImageUrl]);

  return (
    <button
      onClick={() => widgetRef.current.open()}
      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
    >
      Upload
    </button>
  );
};

export default UploadWidget;
