import sqlite3 from "sqlite3";

export const classCategories = {
    physics: [
        "SI Physics",
        "Physics: Sound and Light",
        "Physics C: Mechanics",
        "Physics C: Electricity/Magnetism",
        "Planetary Science",
        "Modern Physics",
        "Computational Science",
		"Biophysics",
    ],
    chem: [
        "SI Chemistry",
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
        "MSI",
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
        "AB I",
        "AB II",
        "BC I",
        "BC II",
        "BC III",
        "BC I/II",
        "BC II/III",
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
