export function base64UrlDecode(str) {
	str = str.replace(/-/g, "+").replace(/_/g, "/");
	while (str.length % 4) {
		str += "=";
	}
	return atob(str);
}

export function isTokenExpired(token) {
	if (!token) return true;
	try {
		const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
		if (!payload.exp) return true;
		return Date.now() >= payload.exp * 1000;
	} catch (e) {
		return true;
	}
}

export function getTokenAccess(token) {
	if (!token) return 0;
	try {
		const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
		return payload.access;
	} catch (e) {
		return 0;
	}
}

export function getTokenEmail(token) {
	if (!token) return null;
	try {
		const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
		return payload.email;
	} catch (e) {
		return null;
	}
}

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
		"Biotechnology Techniques in Chemistry",
	],
	biology: [
		"Biology: Evolution & Environment",
		"Biology: Molecular & Cellular",
		"Cancer Biology",
		"Environmental Microbiology",
		"Pathophysiology",
		"Biology of Behavior",
		"Human Anatomy & Physiology 1",
		"Human Anatomy & Physiology 2",
	],
	sciother: [
		"MSI",
		"Electronics",
		"Engineering",
		"Introduction to Engineering",
		"Global Climate Change",
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
		"Advanced Topics in Mathematics",
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
		"Artificial Intelligence 1",
		"Artificial Intelligence 2",
		"Elements of Computing Systems 1",
		"Elements of Computing Systems 2",
		"Advanced Web Technologies",
		"Introduction to Neural Computation",
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

export const departments = [
	"Computer Science",
	"Math",
	"Science",
	"English",
	"Wellness",
	"World Languages",
	"Fine Arts",
];
