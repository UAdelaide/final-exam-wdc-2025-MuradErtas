var express = require('express');
var router = express.Router();
const db = require('../db');

// GET /api/dogs
router.get('/dogs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name FROM Dogs');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM WalkRequests WHERE status = "open"');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching open walk requests:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/walkers/summary
router.get('/walkers/summary', async (req, res) => {
    try {
        const [rows] = await db.query(`


        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching walker summary:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
