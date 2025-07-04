var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up route for api
app.use('/api', require('./routes/api'));

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService' // Use the DogWalkService database
    });

    // Creating tables and inserting initial data
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('owner', 'walker') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS Dogs (
          dog_id INT AUTO_INCREMENT PRIMARY KEY,
          owner_id INT NOT NULL,
          name VARCHAR(50) NOT NULL,
          size ENUM('small', 'medium', 'large') NOT NULL,
          FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRequests (
          request_id INT AUTO_INCREMENT PRIMARY KEY,
          dog_id INT NOT NULL,
          requested_time DATETIME NOT NULL,
          duration_minutes INT NOT NULL,
          location VARCHAR(255) NOT NULL,
          status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkApplications (
          application_id INT AUTO_INCREMENT PRIMARY KEY,
          request_id INT NOT NULL,
          walker_id INT NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
          FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
          FOREIGN KEY (walker_id) REFERENCES Users(user_id),
          CONSTRAINT unique_application UNIQUE (request_id, walker_id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRatings (
          rating_id INT AUTO_INCREMENT PRIMARY KEY,
          request_id INT NOT NULL,
          walker_id INT NOT NULL,
          owner_id INT NOT NULL,
          rating INT CHECK (rating BETWEEN 1 AND 5),
          comments TEXT,
          rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
          FOREIGN KEY (walker_id) REFERENCES Users(user_id),
          FOREIGN KEY (owner_id) REFERENCES Users(user_id),
          CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
      );
    `);

    // Insert initial data if tables are empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (user_id, username, email, password_hash, role) VALUES
        (1, 'alice123', 'alice@example.com', 'hashed123', 'owner'),
        (2, 'bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        (3, 'carol123', 'carol@example.com', 'hashed789', 'owner'),
        (4, 'frankwalker', 'frank@example.com', 'hashed100', 'walker'),
        (5, 'eve123', 'eve@example.com', 'hashed101', 'owner');
      `);

      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'eve123'), 'Charlie', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'eve123'), 'Lucy', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Levi', 'large');
      `);

      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-07-10 01:30:00', 60, 'Milner Road', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-09-10 21:30:00', 20, 'Windy Point', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Levi'), '2025-09-11 12:30:00', 300, 'Africa', 'cancelled'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-10-10 08:00:00', 30, 'Parklands', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-11-10 09:30:00', 45, 'Beachside Ave', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-12-10 01:30:00', 60, 'Milner Road', 'completed');
      `);

      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
        (6, 2, 1, 5, 'Great walk!'),
        (7, 4, 3, 1, 'Bro cant walk lmao'),
        (8, 2, 5, 4, 'Good job!');
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Route to return users as JSON
app.get('/', async (req, res) => {
  try {
    const [Users] = await db.execute('SELECT * FROM Users');
    res.json(Users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Users' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
