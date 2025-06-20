var express = require('express');
var router = express.Router();


// GET /api/dogs
router.get('/dogs', async (req, res) => {
    try {
        const [rows] = await req.app.locals.db.execute('SELECT * FROM Dogs');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await req.app.locals.db.execute('SELECT * FROM WalkRequests WHERE status = "open"');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching open walk requests:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
