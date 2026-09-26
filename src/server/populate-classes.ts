import sqlite3 from "sqlite3";

// Keep this synchronized with the client catalog in src/util.ts.
export const classCategories = {
    physics: [
        "Physics: Algebra-Based Mechanics",
        "Physics: Sound and Light",
        "Physics: Calculus-Based Mechanics",
        "Physics: Calculus-Based Electricity/Magnetism",
        "Planetary Science",
        "Modern Physics",
        "Computational Science",
		"Biophysics",
    ],
    chem: [
        "Chemistry",
        "Advanced Chemistry - Structure and Properties",
        "Advanced Chemistry - Chemical Reactions",
        "The Physical Chemistry of Materials",
        "Organic Chemistry I",
        "Organic Chemistry II",
        "Biochemistry",
        "Environmental Chemistry",
        "Medicinal Chemistry",
        "Biotechnology Techniques in Chemistry",
    ],
    biology: [
        "Biology: Evolution & Environment",
        "Biology: Molecular & Cellular",
        "Evolution, Biodiversity, and Ecology",
        "Cancer Biology",
        "Environmental Microbiology",
        "Human Anatomy & Physiology 1",
        "Human Anatomy & Physiology 2",
        "Pathophysiology",
        "Biology of Behavior",
    ],
    sciother: [
        "MSI",
        "Electronics",
        "Engineering",
        "Global Climate Change",
    ],
    mathother: [
        "Introduction to Proofs",
        "Modern Geometries",
        "Statistics",
        "Advanced Topics in Data Analysis",
        "Number Theory",
        "Problem Solving",
        "Discrete Mathematics",
        "Multi-Variable Calculus",
        "Theory of Analysis",
        "Differential Equations",
        "Linear Algebra",
        "Abstract Algebra",
		"Advanced Topics in Mathematics",
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
        "Survey of Calculus",
    ],
    cs: [
        "CSI",
        "OOP",
        "Web Technologies",
        "Advanced Programming",
        "Microcontroller Applications (CS)",
        "CS Seminar: Android Apps Development",
        "CS Seminar: Linux and Cybersecurity",
        "CS Seminar: Machine Learning",
        "Artificial Intelligence 1",
        "Artificial Intelligence 2",
        "Elements of Computing Systems 1",
        "Elements of Computing Systems 2",
        "Advanced Web Technologies",
        "Introduction to Neural Computation",
        "Robotics and Control Systems",
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
        "Perspectivas en el Mundo Hispano",
    ],
};

export function populateClasses(db: any, classCategories: any, callback: () => void) {
    console.log("Starting insertion of class data...");
    db.run("DELETE FROM classes", [], (err: Error | null) => {
        if (err) {
            console.error("Error deleting existing classes:", err?.message);
            callback();
            return;
        }
        console.log("Cleared existing class data.");
        const insertClassStmt = db.prepare(
            "INSERT INTO classes (class_name, department) VALUES (?, ?)"
        );
        let insertedCount = 0;
        let totalClasses = 0;
        for (const classes of Object.values(classCategories)) {
            totalClasses += (classes as string[]).length;
        }
        if (totalClasses === 0) {
            insertClassStmt.finalize();
            callback();
            return;
        }
        for (const [department, classes] of Object.entries(classCategories)) {
            for (const className of classes as string[]) {
                insertClassStmt.run(
                    className,
                    department,
                    function (err: Error | null) {
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
                        if (insertedCount === totalClasses) {
                            insertClassStmt.finalize();
                            console.log(`Total of ${insertedCount} classes inserted.`);
                            callback();
                        }
                    }
                );
            }
        }
    });
}

// execution block for running this file independently
const isMainModule = process.argv[1] && process.argv[1].endsWith('populate-classes.ts');
if (isMainModule) {
    const db = new sqlite3.Database(
        "./peertutoringdb.sqlite",
        (err: Error | null) => {
            if (err) {
                console.error("Error opening database:", err.message);
                process.exit(1);
            } else {
                console.log("Connected to SQLite database.");
                populateClasses(db, classCategories, () => {
                    db.close((err: Error | null) => {
                        if (err) {
                            console.error("Error closing database:", err.message);
                        } else {
                            console.log("Database population complete and connection closed.");
                        }
                    });
                });
            }
        }
    );
}
