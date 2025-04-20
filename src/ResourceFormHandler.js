import { db } from "./create-db.ts"

export function handleForm(formData) {
    const teacher = formData.get("teacher");
    const email = formData.get("email");
    const course = formData.get("course");
    const url = formData.get("url");
    alert(`Teacher: ${teacher} Email: ${email} Course: ${course} URL: ${url}`);
    const fillData = `
      INSERT INTO resources (teacher, email, course, url) VALUES (?, ?, ?, ?);
    `;
    console.log("Database file path:", db.filename);
    console.log("Executing Query:", fillData, [teacher, email, course, url]);
    db.run(fillData, [teacher, email, course, url], (err) => {
      if (err) {
        console.error("Error inserting data:", err);
      } else {
        console.log("Data inserted successfully");
      }
    });
}