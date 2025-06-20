const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /dogs
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT dog_id,
            `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
