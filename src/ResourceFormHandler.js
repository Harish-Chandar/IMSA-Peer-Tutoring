import { db } from "./create-db.ts"

export function handleForm(formData) {
    // const sqlite3 = require("sqlite3").verbose();
    // const db = new sqlite3.Database("../peertutoringdb.sqlite");
    const name = formData.get("name");
    const email = formData.get("email");
    const classes = formData.get("classes");
    const url = formData.get("url");
    alert(`Name: ${name} Email: ${email} Classes: ${classes} URL: ${url}`);
    const fillData = `
      INSERT INTO resources (name, email, classes, url) VALUES (${name}, ${email}, ${classes}, ${url});
    `;
    let result = db.all(fillData, (err, row) => {
      console.log(row);
    });
}