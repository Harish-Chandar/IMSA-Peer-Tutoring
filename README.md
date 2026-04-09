# IMSA Peer Tutoring Web Portal 

**Peer Tutors @ IMSA** was created to help students at [IMSA (The Illinois Mathematics and Science Academy)](https://imsa.edu) find peer tutors, academic resources, and see recent announcements related to the tutoring program. It also gives residence counslors, teachers, and adinistrators a unified, digital platform to post annoucements, create course resources, and manage tutors. 

## Getting Started

1. **Fork the Repository:**  
   Click the "Fork" button on GitHub to create your own copy of this repository.

2. **Clone Your Fork:**  
   Run `git clone https://github.com/<your-username>/IMSA-Peer-Tutoring.git` on your command line (assumes installation of Git), or clone it with GitHub Desktop.

3. **Install Dependencies:**  
   In the root directory, run `npm i` to install all required packages (assumes installation of Node JS). Follow the steps under "Setting up Your Environment" to set up environment variables and configurations.

4. **No Branches Needed:**  
   Please work directly on your forked repository, as any pull requests (PRs) will be merged into main.

5. **Making Contributions:**  
   - Make your changes and commit them to your fork.
    - Use descriptive, meaningful commit messages to explain your changes.
   - Push your changes to GitHub.
   - Ensure your fork is up to date with the main repository by syncing the latest changes from the main branch before making a Pull Request (PR).
   - Submit a PR from your fork to the main repository.
   - Add a list of your changes in the PR description. Be sure to mention any dependencies, updates, or configurations that need to be set up for your changes to work.
      - If changes not mentioned in the PR description are made to the code, the PR will be rejected.

## Setting up Your Environment
1. **Environment Variables:**  
   Create a `.env` file in the root directory and the `src/server/` directory with the following content:
   ```keyvalue
   DBHOST=5000
   REACT_APP_HOST=localhost
   PORT=3000
   REACT_APP_DBPORT=5000

   JWT_SECRET=your_jwt_secret_here

   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here

   # Ubuntu-specific settings to fix React Refresh issues
   # FAST_REFRESH=false
   # WDS_SOCKET_HOST=localhost
   # CHOKIDAR_USEPOLLING=true
   ```

2. **Hosts and Ports:**
    Customize the different ports and hosts specific to your computer. You can find out which values to use by running `npm start` (see **How to Start the Website**).

3. **JWT_SECRET:**  
    1. Enter the following command into some UNIX terminal (i.e. WSL, Git Bash, MinGW, a normal Mac/Linux terminal, etc): `openssl rand -base64 32`
    2. Replace `your_jwt_secret_here` in the `.env` file with the first line of the generated string.

4. **Cloudinary Configuration:**  
    1. Sign up for a [Cloudinary](https://cloudinary.com/) account.
    2. Create a new Cloudinary project and obtain your `CLOUD_NAME`, `API_KEY`, and `API_SECRET`.
    3. Replace the placeholders in the `.env` file with your actual Cloudinary credentials.

5. **Finishing Setup**
   * Copy this `.env` file to `src/server/.env` 

## Folder Structure

- **root directory**: Contains frontend code, configuration files, and static assets.
- **src/server/**: Contains backend API code, database population scripts, and server logic.
- **public/**: Contains images and static files used by the frontend.
- **peertutoringdb.sqlite**: The SQLite database file (created/populated by scripts in `src/server`).
- **remote image storage**: Contains profile pictures of tutors, stored in a [Cloudinary](https://cloudinary.com/) server.

## How to Start the Website

1. **Terminal 1 (ReactJS Client):**
   - Run `npm start` in the root directory to start the React frontend.

2. **Terminal 2 (ExpressJS Server):**
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
- **Admin Dashboard:** Admin authentication and account management.

## Scripts in `src/server/`
- `create-db.ts`: Creates the SQLite database and all required tables.
- `populate-all.ts`: Populates all tables with sample data.
- `populate-admin.ts`, `populate-bulletin.ts`, `populate-classes.ts`, `populate-resource.ts`, `populate-tutors.ts`: Populate individual tables.
- `tutorsAPI.ts`: Main Express API for tutors, resources, bulletins, and admin endpoints.

## Core Dependencies 
- Node.js 
- React JS (frontend)
- SQLite3 (database is created automatically by scripts)
- Express JS (backend server)
- Cloudinary (for image storage)

## Pull Request Guidelines
- **Title:** Use a clear, descriptive title for your PR.
- **Description:** Provide a detailed (technical) description of what your PR does, including any relevant issues fixed. In the description, attach your full name as shown on Powerschool and IMSA email address.
- **Review:** Ensure your code is well-tested and follows the project's coding standards (4-space tabs, etc).
- **Conflicts:** Resolve any merge conflicts before submitting your PR. Any conficts that the repository maintainer has to resolve will be rejected.
- **Style:** Follow the project's coding style and conventions. 4-space tabs, indentation convention, etc.
- **Communication:** Email IMSA's Peer Tutor Coordinator (Amy Keck, akeck@imsa.edu at time of writing) and inform them of the pending changes in a clear, non-technical, outcome-driven manner. 

## Grounds for Pull Request Rejection
- **Incomplete Features:** PRs that do not fully implement the intended feature or fix.
- **Poor Code Quality:** Code that does not adhere to the project's coding standards or is poorly documented.
- **Unclear Use Cases:** PRs that do not clearly explain the use case or functionality being added. Inclusive of this is PRs that changes, especially to core systems, that are not well explained.
- **Unnecessary Changes:** Changes that do not contribute to the project or are not relevant to the current scope.
- **Maintainer Discretion:** Final rights to approve new changes lie solely with the maintainer(s) of the repository.

## Last Remarks 
- Make sure to run the database setup scripts before starting the backend server for the first time.
- The frontend and backend run separately; both must be started for the app to work.
- If you encounter any issues, check the console for error messages and ensure your environment variables are set correctly.
- If you make any changes to the server code, restart the backend server to apply the changes.
- If you make any changes to the frontend code, the React app will automatically reload to reflect those changes.
- If your pull request gets approved, they will usually be reflected on the website before the end of a semester. 
- For any questions, contact the project developers.

### For any inquiries, contact:
- [Harish Chandar](https://harish-chandar.github.io/) - *harishschandar@gmail.com*
- [Aarav Shah](https://www.linkedin.com/in/aarav-shah-aba4a631b) - *aaravshah820@gmail.com*

## License
This project is licensed under the GNU Affero General Public License v3.0.
See the LICENSE file for details.
### tl;dr
This project is licensed under AGPL-3.0, which means you can personally use, modify, and even sell it.   
If you share it or run it publicly (like SaaS or a website), you must release your source code under this same license and give credit to this repository. 
Distributing closed-source derivatives of this project are NOT permitted.
