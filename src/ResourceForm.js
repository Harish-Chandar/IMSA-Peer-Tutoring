// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("../peertutoringdb.sqlite");
import { handleForm } from "./ResourceFormHandler.js";

export default function ResourceForm() {
  return (
      <div>
        <h2>Submit Resource</h2>
        <form action={handleForm}>
          <label>
            Name:
            <input
              type="text"
              name="name"
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
            Classes:
            <input
              type="text"
              name="classes"
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