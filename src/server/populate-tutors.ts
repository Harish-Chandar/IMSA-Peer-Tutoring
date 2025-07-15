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
    is_available: 0,
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

export const classCategories = {
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
