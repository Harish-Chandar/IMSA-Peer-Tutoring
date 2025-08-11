# IMSA Peer Tutoring Platform

## Getting Started

1. **Fork the Repository:**  
   Click the "Fork" button on GitHub to create your own copy of this repository.

2. **Clone Your Fork:**  
   Run `git clone https://github.com/<your-username>/IMSA-Peer-Tutoring.git` to clone your fork locally.

3. **Install Dependencies:**  
   In the root directory, run `npm install` to install all required packages.

4. **No Branches Needed:**  
   Please work directly on your forked repository. Branching is not required since each contributor works on their own fork.

5. **Making Contributions:**  
   - Make your changes and commit them to your fork.
   - Push your changes: `git push origin main`
   - Submit a Pull Request (PR) from your fork to the main repository.
   - Add a summary of your changes in the PR description.

---

## Folder Structure

- **root directory**: Contains frontend code, configuration files, and static assets.
- **src/server/**: Contains backend API code, database population scripts, and server logic.
- **public/**: Contains images and static files used by the frontend.
- **peertutoringdb.sqlite**: The SQLite database file (created/populated by scripts in `src/server`).

## How to Start the Website

1. **Terminal 1 (Frontend):**
   - Run `npm start` in the root directory to start the React frontend.

2. **Terminal 2 (Backend):**
   - Run `cd src/server` then `npm start` to start the Express backend server.

## How to Create and Populate the Database

3. **Terminal 3 (Database Setup):**
   - Run `cd src/server`.
   - Run `npx tsx create-db.ts` to create the database and tables.
   - Run `npx tsx populate-all.ts` to populate the database with sample data.

## Main Features

- **Tutors:** Add, edit, search, and manage tutor profiles and availability.
- **Resources:** Add and search for academic resources, with support for resource links.
- **Bulletin Board:** Post and manage announcements/events for students and tutors.
- **Classes:** Manage class and department information for matching tutors and resources.
- **Admin Panel:** Admin authentication and account management.

## Scripts in `src/server/`
- `create-db.ts`: Creates the SQLite database and all required tables.
- `populate-all.ts`: Populates all tables with sample data.
- `populate-admin.ts`, `populate-bulletin.ts`, `populate-classes.ts`, `populate-resource.ts`, `populate-tutors.ts`: Populate individual tables.
- `tutorsAPI.ts`: Main Express API for tutors, resources, bulletins, and admin endpoints.

## Requirements
- Node.js and npm
- SQLite (database is created automatically by scripts)

## Notes
- Make sure to run the database setup scripts before starting the backend server for the first time.
- The frontend and backend run separately; both must be started for the app to work.

