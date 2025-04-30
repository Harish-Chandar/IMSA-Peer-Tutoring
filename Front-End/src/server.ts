import express, { Request, Response } from 'express';
import { Database, verbose } from 'sqlite3';
import path from 'path';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'app.jsx')));

// Database connection
const database = new (verbose().Database)('./peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// API endpoint to handle form submission
app.post('/api/schedule', (req: Request, res: Response) => {
    const { title, course, teachers, location, date, time } = req.body;

    const sql = `INSERT INTO schedule (title, course, teachers, location, date, time) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    database.run(sql, [title, course, teachers, location, date, time], function(this: { lastID: number }, err: Error | null) {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            message: 'Schedule entry added successfully',
            id: this.lastID 
        });
    });
});

// Handle React routing - return index.html for all routes
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 