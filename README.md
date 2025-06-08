# IMSA Peer Tutoring System

A web-based application for peer tutors at the Illinois Mathematics and Science Academy (IMSA).

## Overview

The IMSA Peer Tutoring System is designed to facilitate the scheduling and management of peer tutoring sessions. It provides a user-friendly interface for creating and managing tutoring schedules, making it easier for students to find and participate in tutoring sessions.

## Features

- Schedule creation and management
- Course-specific tutoring sessions
- Date and time scheduling
- Bulletin board for announcements
- Resource management
- Tutor availability tracking

## Technical Stack

- Frontend: React.js, HTML5, CSS3, JavaScript
- Backend: Node.js/Express (API endpoints)
- Database: SQLite3
- State Management: React Hooks

## Project Structure

### Components (`src/Components/`)
- `navbar.jsx`: Navigation bar component
- `tutorBoard.jsx`: Display and management of tutor information
- `scheduleForm.jsx`: Form for scheduling tutoring sessions
- `tutorNote.jsx`: Notes and feedback for tutoring sessions
- `bulletinBoard.jsx`: Announcement board component
- `note.jsx`: Post-it note Component

### Database Structure (`src/create-db.ts`)
The system uses SQLite3 with the following tables:

1. **Tutors Table**
   - Personal information (name, email, IMSA ID)
   - Availability tracking
   - Subject expertise (physics, chemistry, biology, etc.)
   - Time tracking (total and approved hours)

2. **Bulletin Table**
   - Announcements and events
   - Priority levels
   - Creation and expiration dates
   - Author information

3. **Resources Table**
   - Educational resources
   - Contact information
   - Resource types and URLs
   - Timestamps

### Schedule Form (`Server/schedule-form.html`)
The schedule form provides a user-friendly interface for:
- Creating new tutoring sessions
- Specifying course details
- Setting location and time
- Managing multiple teachers
- Real-time submission feedback

## Getting Started

### Prerequisites

- A modern web browser
- Node.js and npm installed (for backend development)
- SQLite3
- Access to the IMSA network (if required)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd IMSA-Peer-Tutoring
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
node Server/create-db.ts
```

4. Start the server:
```bash
npm start
```

5. Access the application through your web browser

## API Endpoints

- `POST /api/schedule`: Create a new tutoring session
  - Request body: JSON object containing session details
  - Response: Success/error message
- `GET /api/tutors`: Retrieve tutor information
- `POST /api/bulletin`: Create new bulletin board entries
- `GET /api/resources`: Access educational resources

## Database Management

The system includes several database management scripts:
- `create-db.ts`: Initial database setup
- `populate-db.ts`: Sample data population
- `view-db.ts`: Database inspection tool



