import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

// Open database connection
const dbPromise = open({
  filename: 'peertutoringdb.sqlite',
  driver: sqlite3.Database
});

// Get all tutors
app.get('/api/tutors', async (req, res) => {
  try {
    const db = await dbPromise;
    const tutors = await db.all('SELECT * FROM tutors WHERE is_available = 1');
    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Error fetching tutors' });
  }
});

// ... existing code ...

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 