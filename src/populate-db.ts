// Use dynamic import for sqlite3 for ES module compatibility
(async () => {
  const sqlite3Module = await import('sqlite3');
  const sqlite3 = sqlite3Module.default.verbose();

  const populateDb = new sqlite3.Database(
    "../peertutoringdb.sqlite",
    (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to SQLite database.");
      }
    }
  );

  // Drop tables if they exist to ensure schema is up to date
  const DROP_RESOURCES = `DROP TABLE IF EXISTS resources;`;
  const DROP_RESOURCE_LINKS = `DROP TABLE IF EXISTS resource_links;`;

  const CRT = `CREATE TABLE IF NOT EXISTS resources (
          resource_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          teacher TEXT NOT NULL,
          email TEXT NOT NULL,
          course TEXT NOT NULL,
          department TEXT NOT NULL,
          url TEXT,
          type TEXT,
          time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          search_field TEXT
          );
      `;

  // Creating a table to store links per each resource
  const CRT2 = `CREATE TABLE IF NOT EXISTS resource_links (
          link_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          resource_id INTEGER NOT NULL,
          label TEXT NOT NULL,
          url TEXT NOT NULL,
          FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
          );    
      `;

  // Sample data to populate the resources table
  const sampleResources = [
    {
      teacher: "Mr. Pranav Gadde",
      email: "pgadde@imsa.edu",
      course: "Object Oriented Programming, MI4",
      department: "Computer Science",
      url: "https://khanacademy.org/",
      type: "WeeklySession"
    },
    {
      teacher: "Atharv Kanchi",
      email: "akanchi2@imsa.edu", 
      course: "Advanced Programming, WebTech",
      department: "Computer Science",
      url: "https://khanacademy.org/",
      type: "Weekly Session"
    },
    {
      teacher: "Krithik",
      email: "ksenthilkumar@imsa.edu",
      course: "SI Physics, Computer Science Inquiry",
      department: "Science",
      url: "https://khanacademy.org/",
      type: "Final Review"
    },
    {
      teacher: "Ian Wang",
      email: "iwang@imsa.edu",
      course: "BC 1, SI Chemistry",
      department: "Math",
      url: "https://khanacademy.org/",
      type: "Drop-In"
    },
    {
      teacher: "Harish Chandar",
      email: "hchandar@imsa.edu",
      course: "Foundations of Healthy Living",
      department: "Wellness",
      url: "https://khanacademy.org/",
      type: "Drop-In"
    },
    {
      teacher: "Vishnu Vijay",
      email: "vvijay@imsa.edu",
      course: "Creative Writing",
      department: "English",
      url: "https://khanacademy.org/",
      type: "Final Review"
    },
    {
      teacher: "Aarav Shah",
      email: "ashah@imsa.edu",
      course: "BC 2, BC 3",
      department: "Math",
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
    const insertResource = `INSERT INTO resources (teacher, email, course, department, url, type, search_field) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    sampleResources.forEach((resource, index) => {
      const searchField = `${resource.teacher.toLowerCase()} ${resource.course.toLowerCase()}`;
      populateDb.run(insertResource, [
        resource.teacher,
        resource.email,
        resource.course,
        resource.department,
        resource.url,
        resource.type,
        searchField
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

  // Drop and recreate tables, then populate
  populateDb.serialize(() => {
    populateDb.run(DROP_RESOURCE_LINKS, (err) => {
      if (err) {
        console.error("Error dropping resource_links table:", err.message);
      } else {
        console.log("Dropped resource_links table (if existed).");
      }
      populateDb.run(DROP_RESOURCES, (err) => {
        if (err) {
          console.error("Error dropping resources table:", err.message);
        } else {
          console.log("Dropped resources table (if existed).");
        }
        populateDb.run(CRT, (err) => {
          if (err) {
            console.error("Error creating resources table:", err.message);
          } else {
            console.log("Successfully created resources table.");
          }
          populateDb.run(CRT2, (err) => {
            if (err) {
              console.error("Error creating resource_links table:", err.message);
            } else {
              console.log("Successfully created resource_links table.");
              // Populating the database
              populateDatabase();
              setTimeout(() => {
                populateDb.close((err) => {
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
      });
    });
  });
})();
