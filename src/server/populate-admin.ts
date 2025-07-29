import bcrypt from "bcrypt";

export const sampleAdmins = [
  { email: "ksenthilkumar@imsa.edu", password: "ks1", access: 1 },
  { email: "vvijay@imsa.edu", password: "vv2", access: 1 },
  { email: "hchandar@imsa.edu", password: "hc3", access: 1 },
  { email: "akanchi2@imsa.edu", password: "ak4", access: 1 },
  { email: "ashah@imsa.edu", password: "as5", access: 1 },
  { email: "pgadde@imsa.edu", password: "pg6", access: 1 },
  { email: "admin@imsa.edu", password: "admin", access: 1 },
  { email: "admin2@imsa.edu", password: "admin2", access: 2 },
  { email: "admin3@imsa.edu", password: "admin3", access: 3 }
];

export function populateAdmins(db: any, callback: () => void) {
    db.run("DELETE FROM admins", (err: Error | null) => {
        if (err) {
            console.error("Error clearing admins table:", err && err.message);
            callback();
            return;
        }
        let completed = 0;
        sampleAdmins.forEach((admin) => {
            bcrypt.hash(admin.password, 10, (err: Error | undefined, hash: string) => {
                if (err) {
                    console.error(`Error hashing password for ${admin.email}:`, err.message);
                } else {
                    db.run(
                        `INSERT INTO admins (email, pwd, access) VALUES (?, ?, ?)`,
                        [admin.email, hash, admin.access],
                        (err: Error | null) => {
                            if (err) {
                                console.error(`Error inserting admin ${admin.email}:`, err.message);
                            } else {
                                console.log(`Successfully inserted admin: ${admin.email}`);
                            }
                            completed++;
                            if (completed === sampleAdmins.length) {
                                db.all("SELECT id, email, access FROM admins", [], (err: Error | null, rows: any[]) => {
                                    if (err) {
                                        console.error("Error verifying admins data:", err.message);
                                    } else {
                                        console.log("Inserted admins:");
                                        console.table(rows);
                                    }
                                    callback();
                                });
                            }
                        }
                    );
                }
            });
        });
    });
} 