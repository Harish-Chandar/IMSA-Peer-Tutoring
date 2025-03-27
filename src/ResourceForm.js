const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../peertutoringdb.sqlite");

export default function ResourceForm() {
  function handleSubmit(formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const classes = formData.get("classes");
    const url = formData.get("url");
    // alert(`Name: ${name} Email: ${email} Classes: ${classes} URL: ${url}`);
    const fillData = `
      INSERT INTO resources (name, email, classes, url) VALUES (${name}, ${email}, ${classes}, ${url});
    `;
    let result = db.all(fillData, (err, row) => {
      console.log(row);
    });
  };

  return (
      <div>
        <h2>Submit Resource</h2>
        <form action={handleSubmit}>
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