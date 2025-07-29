import sqlite3 from "sqlite3";

type SQLiteError = Error | null;

export interface Tutor {
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

export const tutors: Tutor[] = [
    {
        id: 0,
        fname: "Aarav",
        lname: "Shah",
        fbname: "Aarav Shah",
        imsaid: 126001,
        email: "ashah2@imsa.edu",
        blurb: "",
        hall: 1505,
        wing: 1,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/aarav_gapvmk.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability:
            "monday,3:30-4:00,4:00-4:30;tuesday,7:00-7:30;wednesday,3:30-4:00",
        courses: "",
        physics: "SI_Physics;Physics_C:_Mechanics",
        chem: "",
        biology: "Biology:_Molecular_&_Cellular",
        sciother: "Computational_Science",
        mathother: "Multi-Variable_Calculus",
        mathcore: "",
        cs: "Advanced_Programming",
        language: "",
    },
    {
        id: 1,
        fname: "Harish",
        lname: "Chandar",
        fbname: "Harish Chandar",
        imsaid: 126002,
        email: "hchandar@imsa.edu",
        blurb: "",
        hall: 1505,
        wing: 1,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/harish_erhukh.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability:
            "monday,4:30 PM - 5:00 PM;thursday,7:00 PM - 8:00 PM;friday,3:30 PM - 4:30 PM",
        courses: "",
        physics: "SI_Physics;Physics_C:_Mechanics;Computational_Science",
        chem: "",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "BC_II",
        cs: "Advanced_Programming",
        language: "",
    },
    {
        id: 2,
        fname: "Vishnu",
        lname: "Vijay",
        fbname: "Vishnu Vijay",
        imsaid: 126003,
        email: "vvijay@imsa.edu",
        blurb: "",
        hall: 1505,
        wing: 3,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998408/vishnu_qbntim.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability: "tuesday,8:00 PM - 9:00 PM;wednesday,4:30 PM - 5:30 PM",
        courses: "",
        physics: "",
        chem: "SI_Chemistry;Environmental_Chemistry",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "BC_III",
        cs: "",
        language: "Spanish_V",
    },
    {
        id: 3,
        fname: "Ian",
        lname: "Wang",
        fbname: "Ian Wang",
        imsaid: 127001,
        email: "iwang@imsa.edu",
        blurb: "",
        hall: 1504,
        wing: 4,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998410/ian_xn7xjo.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability: "monday,8:00 PM - 9:00 PM;thursday,3:30 PM - 4:30 PM",
        courses: "",
        physics: "SI_Physics",
        chem: "SI_Chemistry",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "MI_IV;BC_I/II",
        cs: "",
        language: "",
    },
    {
        id: 4,
        fname: "Krithik",
        lname: "Senthilkumar",
        fbname: "Krithik Senthilkumar",
        imsaid: 127002,
        email: "ksenthilkumar@imsa.edu",
        blurb: "",
        hall: 1504,
        wing: 1,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/krithik_u6cfer.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability: "wednesday,7:00 PM - 8:00 PM;friday,4:30 PM - 5:30 PM",
        courses: "",
        physics: "",
        chem: "SI_Chemistry",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "MI_I/II;MI_II;MI_III",
        cs: "",
        language: "French_I",
    },
    {
        id: 5,
        fname: "Pranav",
        lname: "Gadde",
        fbname: "Pranav Gadde",
        imsaid: 127003,
        email: "pgadde@imsa.edu",
        blurb: "",
        hall: 1504,
        wing: 1,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/pranav_paazrh.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability: "tuesday,3:30 PM - 4:30 PM;thursday,8:00 PM - 9:00 PM",
        courses: "",
        physics: "",
        chem: "",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "MI_III",
        cs: "OOP",
        language: "",
    },
    {
        id: 6,
        fname: "Atharv",
        lname: "Kanchi",
        fbname: "Atharv Kanchi",
        imsaid: 127004,
        email: "akanchi2@imsa.edu",
        blurb: "",
        hall: 1504,
        wing: 3,
        image: "https://res.cloudinary.com/dskx71n2n/image/upload/v1744998409/pranav_paazrh.jpg",
        totaltime: 0,
        approvedtime: 0,
        starttime: null,
        is_available: 0,
        availability: "monday,3:30 PM - 4:30 PM;friday,8:00 PM - 9:00 PM",
        courses: "",
        physics: "",
        chem: "",
        biology: "",
        sciother: "",
        mathother: "",
        mathcore: "MI_III",
        cs: "OOP",
        language: "",
    },
];

export function populateTutors(db: any, tutors: Tutor[], callback: () => void) {
    console.log("Starting insertion of tutor data...");
    db.run("DELETE FROM tutors", [], (err: Error | null) => {
        if (err) {
            console.error("Error deleting existing tutors:", err?.message);
            callback();
            return;
        }
        console.log("Cleared existing tutor data.");
        const insertStmt = db.prepare(`
        INSERT INTO tutors (
            id, fname, lname, fbname, imsaid, email, blurb, hall, wing, image, 
            totaltime, approvedtime, starttime, is_available, availability, courses,
            physics, chem, biology, sciother, mathother, mathcore, cs, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);
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
                function (err: Error | null) {
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
        insertStmt.finalize();
        db.all(
            "SELECT id, fname, lname, hall, wing, image, availability FROM tutors",
            [],
            (err: Error | null, rows: any[]) => {
                if (err) {
                    console.error("Error verifying inserted data:", err?.message);
                } else {
                    console.log("Inserted tutors:");
                    console.table(rows);
                    console.log(`Total of ${rows.length} tutors inserted.`);
                }
                callback();
            }
        );
    });
}
