var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
const app = require('../app');

router.get('/api', async (req, res) => {
  try {
    // Connect to the database
    const db = await mysql.createConnection({
      host: 'localhost',

module.exports = router;
