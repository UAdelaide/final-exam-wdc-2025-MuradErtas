const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all dogs
router.get('/', async (req, res) => {
    try {
        // Fetch all dogs with their details
        const [dogs] = await db.query('SELECT dog_id, name, size, owner_id FROM Dogs');
        res.json(dogs);
    } catch (err) {
        // Handle any errors that occur during the database query
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
