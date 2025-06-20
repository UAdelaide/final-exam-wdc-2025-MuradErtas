var express = require('express');
var router = express.Router();
const db = require('../db');

// GET /api/dogs
router.get('/dogs', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
            FROM Dogs
            JOIN Users ON Dogs.owner_id = Users.user_id
            `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username
            FROM WalkRequests
            JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
            JOIN Users ON Dogs.owner_id = Users.user_id
            WHERE WalkRequests.status = 'open'
            `);
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
            SELECT Users.username AS walker_username,
            COUNT(WalkRequests.request_id) AS total_ratings,
            AVG(WalkRatings.rating) AS average_rating,
            COUNT(DISTINCT WalkRequests.request_id) AS completed_walks
            FROM Users
            LEFT JOIN WalkRatings ON WalkRatings.walker_id = Users.user_id
            LEFT JOIN WalkRequests ON WalkRequests.status = 'completed'
            

        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching walker summary:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
