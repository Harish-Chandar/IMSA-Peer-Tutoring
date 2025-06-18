
import { handleForm } from "./ResourceFormHandler.js";

export default function ResourceForm() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(event.target); // Create a FormData object from the form
    handleForm(formData); // Pass the FormData object to the handler
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Resource</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Teacher:
          <input
            type="text"
            name="teacher"
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
          />
        </label>
        <br />
        <label>
          Course:
          <input
            type="text"
            name="course"
          />
        </label>
        <br />
        <label>
          URL:
          <input
            type="text"
            name="url"
          />
        </label>
        <br />
        <label>
          Department:
          <select name="department">
            <option value="English">English</option>
            <option value="Fine Arts">Fine Arts</option>
            <option value="History & Social Sciences">History & Social Sciences</option>
            <option value="Mathematics & CS">Mathematics & CS</option>
            <option value="Science">Science</option>
            <option value="Wellness">Wellness</option>
            <option value="World Languages">World Languages</option>
          </select>
        </label>
        <br />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
          Submit
        </button>
      </form>
    </div>
  );
}