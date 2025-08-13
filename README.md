# IMSA Peer Tutoring Web Portal 

**Peer Tutors @ IMSA** was created to help students at [IMSA (The Illinois Mathematics and Science Academy](https://imsa.edu)) find peer tutors, academic resources, and see recent announcements related to the tutoring program. It also gives residence counslors and adinistrators a unified, digital platform to post annoucements and easier manage tutor profiles. 

## Getting Started

1. **Fork the Repository:**  
   Click the "Fork" button on GitHub to create your own copy of this repository.

2. **Clone Your Fork:**  
   Run `git clone https://github.com/<your-username>/IMSA-Peer-Tutoring.git` on your command line, or clone it with GitHub Desktop.

3. **Install Dependencies:**  
   In the root directory, run `npm i` to install all required packages. Follow the steps under "Setting up Your Environment" to set up environment variables and configurations.

4. **No Branches Needed:**  
   Please work directly on your forked repository. Branching is not required since each contributor works on their own fork.

5. **Making Contributions:**  
   - Make your changes and commit them to your fork.
    - Use descriptive, meaningful commit messages to explain your changes.
   - Push your changes: `git push origin main`
   - Ensure your fork is up to date with the main repository by syncing the latest changes from the main branch before making a PR.
   - Submit a Pull Request (PR) from your fork to the main repository.
   - Add a summary of your changes in the PR description.

## Setting up Your Environment
1. **Environment Variables:**  
   Create a `.env` file in the root directory with the following content:
   ```keyvalue
   DBHOST=5000
   REACT_APP_HOST=localhost
   PORT=3000
   REACT_APP_DBPORT=5000

   JWT_SECRET=your_jwt_secret_here

   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

2. **JWT_SECRET:**  
    1. Enter the following command into some UNIX terminal (i.e. WSL, Git Bash, MinGW): `openssl rand -base64 32`
    2. Replace `your_jwt_secret_here` in the `.env` file with the first line of the generated string.

3. **Cloudinary Configuration:**  
    1. Sign up for a [Cloudinary](https://cloudinary.com/) account.
    2. Create a new Cloudinary project and obtain your `CLOUD_NAME`, `API_KEY`, and `API_SECRET`.
    3. Replace the placeholders in the `.env` file with your actual Cloudinary credentials.
---

## Pull Request Guidelines
- **Title:** Use a clear, descriptive title for your PR.
- **Description:** Provide a detailed description of what your PR does, including any relevant issue numbers.
- **Review:** Ensure your code is well-tested and follows the project's coding standards.
- **Conflicts:** Resolve any merge conflicts before submitting your PR. Any conficts that the repository maintainer has to resolve will be rejected.

## Folder Structure

- **root directory**: Contains frontend code, configuration files, and static assets.
- **src/server/**: Contains backend API code, database population scripts, and server logic.
- **public/**: Contains images and static files used by the frontend.
- **peertutoringdb.sqlite**: The SQLite database file (created/populated by scripts in `src/server`).
- **remote image storage**: Contains profile pictures of tutors, stored in a [Cloudinary](https://cloudinary.com/) server.

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

## Core Dependencies 
- Node.js 
- React (frontend)
- SQLite3 (database is created automatically by scripts)
- Express (backend server)
- Cloudinary (for image storage)

## Last Remarks 
- Make sure to run the database setup scripts before starting the backend server for the first time.
- The frontend and backend run separately; both must be started for the app to work.
- If you encounter any issues, check the console for error messages and ensure your environment variables are set correctly.
- If you make any changes to the server code, restart the backend server to apply the changes.
- If you make any changes to the frontend code, the React app will automatically reload to reflect those changes.
- For any questions, contact the project administrators.

### Project Adminstrators
- [Harish Chandar](https://www.linkedin.com/in/harish-chandar) - harishschandar@gmail.com
- [Aarav Shah](https://www.linkedin.com/in/aarav-shah-aba4a631b) - aaravshah820@gmail.com
