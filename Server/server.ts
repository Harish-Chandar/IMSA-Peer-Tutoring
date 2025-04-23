import express, { Request, Response } from 'express';
import pkg from 'sqlite3';
const { verbose } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import bulletinRouter from './bulletinAPI.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from the src directory
app.use(express.static(path.join(__dirname)));

// Use the bulletin API router
app.use('/api', bulletinRouter);

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Route to serve the schedule form
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'schedule-form.html'));
});

// Database connection
const database = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 