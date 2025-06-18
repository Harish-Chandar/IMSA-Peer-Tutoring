import pkg from 'sqlite3';
const { Database, verbose } = pkg;
import express from 'express';

const router = express.Router();
const db = new (verbose().Database)('peertutoringdb.sqlite', (err: Error | null) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to bulletin API database.');
    }
});

// Get all bulletin entries
router.get('/bulletin', (req, res) => {
    console.log('GET /api/bulletin endpoint hit');
    
    const query = 'SELECT * FROM bulletin ORDER BY event_date DESC';
    console.log('Executing query:', query);
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error querying bulletin table:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Found rows:', rows);
        res.json(rows);
    });
});

export default router; 