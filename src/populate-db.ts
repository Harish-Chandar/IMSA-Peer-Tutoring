const sqlite3 = require("sqlite3").verbose();

const populateDb = new sqlite3.Database(
  "./peertutoringdb.sqlite",
  (err: Error | null) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

const CRT = `CREATE TABLE IF NOT EXISTS resources (
        resource_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        classes VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        type VARCHAR(255), 
        time_created DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;

// Creating a table to store links per each resource
const CRT2 = `CREATE TABLE IF NOT EXISTS resource_links (
        link_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        resource_id INTEGER NOT NULL,
        label VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
        );    
    `;

// Sample data to populate the resources table
const sampleResources = [
  {
    teacher: "Mr. Pranav Gadde",
    email: "pgadde@imsa.edu",
    classes: "Object Oriented Programming, MI4",
    url: "https://khanacademy.org/",
    type: "WeeklySession"
  },
  {
    teacher: "Atharv Kanchi",
    email: "akanchi2@imsa.edu", 
    classes: "Advanced Programming, WebTech",
    url: "https://khanacademy.org/",
    type: "Weekly Session"
  },
  {
    teacher: "Krithik",
    email: "ksenthilkumar@imsa.edu",
    classes: "SI Physics, Computer Science Inquiry",
    url: "https://khanacademy.org/",
    type: "Final Review"
  },
  {
    teacher: "Ian Wang",
    email: "iwang@imsa.edu",
    classes: "BC 1, SI Chemistry",
    url: "https://khanacademy.org/",
    type: "Drop-In"
  },
  {
    teacher: "Harish Chandar",
    email: "hchandar@imsa.edu",
    classes: "Foundations of Healthy Living",
    url: "https://khanacademy.org/",
    type: "Drop-In"
  },
  {
    teacher: "Vishnu Vijay",
    email: "vvijay@imsa.edu",
    classes: "Creative Writing",
    url: "https://khanacademy.org/",
    type: "Final Review"
  },
  {
    teacher: "Aarav Shah",
    email: "ashah@imsa.edu",
    classes: "BC 2, BC 3",
    url: "https://khanacademy.org/",
    type: "Biweekly Session"
  }
];

// Sample data to populate the resource_links table
const sampleLinks = [
  { resource_id: 1, label: "Integration Techniques", url: "https://khanacademy.org/integration" },
  { resource_id: 2, label: "Differential Equations", url: "https://khanacademy.org/diffeq" },
  { resource_id: 2, label: "Periodic Table", url: "https://chemguide.co.uk/periodictable" },
  { resource_id: 3, label: "Reaction Mechanisms", url: "https://chemguide.co.uk/mechanisms" }
];

// Function to populate the database with sample data
function populateDatabase() {
  console.log("Starting to populate database with sample data...");
  
  // Inserting sample resources
  const insertResource = `INSERT INTO resources (teacher, email, classes, url, type) VALUES (?, ?, ?, ?, ?)`;
  
  sampleResources.forEach((resource, index) => {
    populateDb.run(insertResource, [
      resource.teacher,
      resource.email,
      resource.classes,
      resource.url,
      resource.type
    ], function(err) {
      if (err) {
        console.error(`Error inserting resource ${index + 1}:`, err.message);
      } else {
        console.log(`Successfully inserted resource: ${resource.teacher} - ${resource.type}`);
        
        // Inserting associated links for this resource
        const resourceId = this.lastID;
        const insertLink = `INSERT INTO resource_links (resource_id, label, url) VALUES (?, ?, ?)`;
        
        const linksForThisResource = sampleLinks.filter(link => link.resource_id === index + 1);
        linksForThisResource.forEach(link => {
          populateDb.run(insertLink, [resourceId, link.label, link.url], (err) => {
            if (err) {
              console.error(`Error inserting link for resource ${resourceId}:`, err.message);
            } else {
              console.log(`Successfully inserted link: ${link.label}`);
            }
          });
        });
      }
    });
  });
}

populateDb.run(CRT, (err: Error | null) => {
  if (err) {
    console.error("Error creating schedule table:", err.message);
  } else {
    console.log("Successfully created schedule table.");
  }
  populateDb.run(CRT2, (err: Error | null) => {
    if (err) {
      console.error("Error creating resource_links table:", err.message);
    } else {
      console.log("Successfully created resource_links table.");
      
      // Populating the database
      populateDatabase();
      
      setTimeout(() => {
        populateDb.close((err: Error | null) => {
          if (err) {
            console.error("Error closing database:", err.message);
          } else {
            console.log("Database connection closed.");
          }
        });
      }, 2000); 
    }
  });
});
//cursor.executemany("INSERT INTO schedule (title, course, teachers, location, date, time) VALUES (`df`, `mi`, `d`, `d`, 1, 2)", data)
