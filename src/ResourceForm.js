
import { handleForm } from "./ResourceFormHandler.js";

export default function ResourceForm() {


  return (
      <div>
        <h2>Submit Resource</h2>
        <form onSubmit={handleForm}>
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
          <button type="submit">Submit</button>
        </form>
      </div>
    );
}