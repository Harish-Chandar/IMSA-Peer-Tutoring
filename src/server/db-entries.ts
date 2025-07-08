import sqlite3 from "sqlite3";

// Define error type for SQLite
type SQLiteError = Error | null;

const db = new sqlite3.Database(
  "./peertutoringdb.sqlite",
  (err: SQLiteError) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

// Define tutor type
interface Tutor {
  id: number;
  fname: string;
  lname: string;
  fbname: string;
  imsaid: number;
  email: string;
  blurb: string;
  hall: number;
  wing: number;
  image: string;
  totaltime: number;
  approvedtime: number;
  starttime: number | null;
  is_available: number;
  availability: string;
  courses: string;
  physics: string;
  chem: string;
  biology: string;
  sciother: string;
  mathother: string;
  mathcore: string;
  cs: string;
  language: string;
}

// Define the tutor data to insert
const tutors: Tutor[] = [
  {
    id: 126001,
    fname: "Aarav",
    lname: "Shah",
    fbname: "Aarav Shah",
    imsaid: 126001,
    email: "ashah2@imsa.edu",
    blurb: "",
    hall: 1505,
    wing: 1,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/aarav_gapvmk.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability:
      "monday,3:30-4:00,4:00-4:30;tuesday,7:00-7:30;wednesday,3:30-4:00",
    courses: "",
    physics: "SI_Phys;Physics_C:_Mechanics",
    chem: "",
    biology: "Biology:_Molecular_&_Cellular",
    sciother: "Computational_Science",
    mathother: "",
    mathcore: "Multivariable_Calculus",
    cs: "Advanced_Programming",
    language: "",
  },
  {
    id: 126002,
    fname: "Harish",
    lname: "Chandar",
    fbname: "Harish Chandar",
    imsaid: 126002,
    email: "hchandar@imsa.edu",
    blurb: "",
    hall: 1505,
    wing: 1,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/harish_erhukh.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability:
      "monday,4:30 PM - 5:00 PM;thursday,7:00 PM - 8:00 PM;friday,3:30 PM - 4:30 PM",
    courses: "",
    physics: "SI_Phys;Physics_C:_Mechanics",
    chem: "",
    biology: "",
    sciother: "Computational_Science",
    mathother: "",
    mathcore: "BC_II",
    cs: "Advanced_Programming",
    language: "",
  },
  {
    id: 126003,
    fname: "Vishnu",
    lname: "Vijay",
    fbname: "Vishnu Vijay",
    imsaid: 126003,
    email: "vvijay@imsa.edu",
    blurb: "",
    hall: 1505,
    wing: 3,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998408/vishnu_qbntim.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability: "tuesday,8:00 PM - 9:00 PM;wednesday,4:30 PM - 5:30 PM",
    courses: "",
    physics: "",
    chem: "SI_Chem;Environmental_Chem",
    biology: "",
    sciother: "",
    mathother: "",
    mathcore: "BC_III",
    cs: "",
    language: "Spanish_V",
  },
  {
    id: 127001,
    fname: "Ian",
    lname: "Wang",
    fbname: "Ian Wang",
    imsaid: 127001,
    email: "iwang@imsa.edu",
    blurb: "",
    hall: 1504,
    wing: 4,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998410/ian_xn7xjo.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability: "monday,8:00 PM - 9:00 PM;thursday,3:30 PM - 4:30 PM",
    courses: "",
    physics: "SI_Phys",
    chem: "SI_Chem",
    biology: "",
    sciother: "",
    mathother: "",
    mathcore: "MI_IV;BC_I/II",
    cs: "",
    language: "",
  },
  {
    id: 127002,
    fname: "Krithik",
    lname: "Senthilkumar",
    fbname: "Krithik Senthilkumar",
    imsaid: 127002,
    email: "ksenthilkumar@imsa.edu",
    blurb: "",
    hall: 1503,
    wing: 3,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/krithik_u6cfer.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability: "wednesday,7:00 PM - 8:00 PM;friday,4:30 PM - 5:30 PM",
    courses: "",
    physics: "",
    chem: "SI_Chem",
    biology: "",
    sciother: "",
    mathother: "",
    mathcore: "MI_I/II;MI_II;MI_III",
    cs: "",
    language: "French_I",
  },
  {
    id: 127003,
    fname: "Pranav",
    lname: "Gadde",
    fbname: "Pranav Gadde",
    imsaid: 127003,
    email: "pgadde@imsa.edu",
    blurb: "",
    hall: 1504,
    wing: 2,
    image:
      "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/pranav_paazrh.jpg",
    totaltime: 0,
    approvedtime: 0,
    starttime: null,
    is_available: 1,
    availability: "tuesday,3:30 PM - 4:30 PM;thursday,8:00 PM - 9:00 PM",
    courses: "",
    physics: "",
    chem: "",
    biology: "SI_Phys",
    sciother: "",
    mathother: "",
    mathcore: "MI_III",
    cs: "OOP",
    language: "",
  },
];

// Define the class categories
const classCategories = {
  physics: [
    "Scientific Inquiries - Physics",
    "Physics: Sound and Light",
    "Physics C: Mechanics",
    "Physics C: Electricity & Magnetism",
    "Planetary Science",
    "Modern Physics",
    "Computational Science",
  ],
  chem: [
    "Scientific Inquiries - Chemistry",
    "Advanced Chemistry - Structure and Properties",
    "Advanced Chemistry - Chemical Reactions",
    "The Physical Chemistry of Materials",
    "Organic Chemistry I",
    "Organic Chemistry II",
    "Biochemistry",
    "Environmental Chemistry",
    "Medicinal Chemistry",
  ],
  biology: [
    "Biology: Evolution & Environment",
    "Biology: Molecular & Cellular",
    "Evolution, Biodiversity, and Ecology",
    "Cancer Biology",
    "Environmental Microbiology",
    "Pathophysiology",
    "Biology of Behavior",
  ],
  sciother: [
    "Methods of Scientific Inquiries",
    "Electronics",
    "Engineering",
    "Engineering: Statics & Dynamics",
  ],
  mathother: [
    "Introduction to Proofs",
    "Modern Geometries",
    "Statistical Exploration and Description",
    "Statistical Experimentation and Inference",
    "Number Theory",
    "Discrete Mathematics",
    "Multi-Variable Calculus",
    "Theory of Analysis",
    "Differential Equations",
    "Linear Algebra",
    "Abstract Algebra",
  ],
  mathcore: [
    "Geometry",
    "MI I/II",
    "MI II",
    "MI III",
    "MI IV",
    "AB Calculus I",
    "AB Calculus II",
    "BC Calculus I",
    "BC Calculus II",
    "BC Calculus III",
    "BC Calculus I/II",
    "BC Calculus II/III",
  ],
  cs: [
    "Computer Science Inquiry",
    "Object Oriented Programming",
    "Web Technologies",
    "Advanced Programming",
    "Microcontroller Applications (CS)",
    "CS Seminar: Android Apps Development",
    "CS Seminar: Linux and Cybersecurity",
    "CS Seminar: Machine Learning",
  ],
  language: [
    "French I",
    "French II",
    "French III",
    "French IV",
    "French V",
    "Spanish II",
    "Spanish III",
    "Spanish IV",
    "Spanish V",
    "German I",
    "German II",
    "German III",
    "Mandarin Chinese I",
    "Mandarin Chinese II",
    "Mandarin Chinese III",
  ],
};

// Function to insert classes
function insertClasses(callback: () => void) {
  console.log("Starting insertion of class data...");

  // Delete existing classes to avoid duplicates
  db.run("DELETE FROM classes", [], (err: SQLiteError) => {
    if (err) {
      console.error("Error deleting existing classes:", err?.message);
      return;
    }
    console.log("Cleared existing class data.");

    // Prepare statement for inserting classes
    const insertClassStmt = db.prepare(
      "INSERT INTO classes (class_name, department) VALUES (?, ?)"
    );

    let insertedCount = 0;
    let totalClasses = 0;

    // Count total classes
    for (const classes of Object.values(classCategories)) {
      totalClasses += classes.length;
    }

    // Insert all classes
    for (const [department, classes] of Object.entries(classCategories)) {
      for (const className of classes) {
        insertClassStmt.run(className, department, function (err: SQLiteError) {
          if (err) {
            console.error(
              `Error inserting class "${className}":`,
              err?.message
            );
          } else {
            insertedCount++;
            console.log(
              `Successfully inserted class: ${className} (Department: ${department})`
            );
          }

          // Check if all classes have been processed
          if (insertedCount === totalClasses) {
            insertClassStmt.finalize();
            console.log(`Total of ${insertedCount} classes inserted.`);
            callback(); // Call the callback to proceed with tutors
          }
        });
      }
    }
  });
}

// Function to insert tutors
function insertTutors() {
  console.log("Starting insertion of tutor data...");

  // First delete any existing tutors to avoid duplicates
  db.run("DELETE FROM tutors", [], (err: SQLiteError) => {
    if (err) {
      console.error("Error deleting existing tutors:", err?.message);
      return;
    }
    console.log("Cleared existing tutor data.");

    // Use a prepared statement for better performance
    const insertStmt = db.prepare(`
      INSERT INTO tutors (
          id, fname, lname, fbname, imsaid, email, blurb, hall, wing, image, 
          totaltime, approvedtime, starttime, is_available, availability, courses,
          physics, chem, biology, sciother, mathother, mathcore, cs, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    // Insert each tutor
    tutors.forEach((tutor) => {
      insertStmt.run(
        tutor.id,
        tutor.fname,
        tutor.lname,
        tutor.fbname,
        tutor.imsaid,
        tutor.email,
        tutor.blurb,
        tutor.hall,
        tutor.wing,
        tutor.image,
        tutor.totaltime,
        tutor.approvedtime,
        tutor.starttime,
        tutor.is_available,
        tutor.availability,
        tutor.courses,
        tutor.physics,
        tutor.chem,
        tutor.biology,
        tutor.sciother,
        tutor.mathother,
        tutor.mathcore,
        tutor.cs,
        tutor.language,
        function (err: SQLiteError) {
          if (err) {
            console.error(`Error inserting tutor ${tutor.id}:`, err?.message);
          } else {
            console.log(
              `Successfully inserted tutor: ${tutor.fname} ${tutor.lname} (ID: ${tutor.id})`
            );
          }
        }
      );
    });

    // Finalize the prepared statement
    insertStmt.finalize();

    // Define a type for database rows
    type TutorRow = {
      id: number;
      fname: string;
      lname: string;
      hall: number;
      wing: number;
      image: string;
      availability: string;
    };

    // Verify the data was inserted
    db.all(
      "SELECT id, fname, lname, hall, wing, image, availability FROM tutors",
      [],
      (err: SQLiteError, rows: TutorRow[]) => {
        if (err) {
          console.error("Error verifying inserted data:", err?.message);
        } else {
          console.log("Inserted tutors:");
          console.table(rows);
          console.log(`Total of ${rows.length} tutors inserted.`);
        }

        // Close the database connection
        db.close((err: SQLiteError) => {
          if (err) {
            console.error("Error closing database:", err?.message);
          } else {
            console.log("Database connection closed.");
          }
        });
      }
    );
  });
}

// Start the insertion process: classes first, then tutors
insertClasses(() => {
  insertTutors();
});
