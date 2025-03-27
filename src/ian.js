const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../peertutoringdb.sqlite");

/* <form>
    <label>
        Name:
        <input type="text" name = "name" />
    </label>
    <input type="submit" value="Submit" />
</form> */

const fillData = `
    INSERT INTO resources (name, email, classes) VALUES ("Ian", "ianwa09@gmail.com", "Biotech");
`;

 readData = 'SELECT * FROM resources;';

let result = db.all(readData, (err, row) => {
    console.log(row);
});

db.close();
