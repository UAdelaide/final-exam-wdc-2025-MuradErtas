INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123','alice@example.com','hashed123','owner'),
('bobwalker','bob@example.com','hashed456','walker'),
('carol123','carol@example.com''hashed789','owner'),
('frankwalker','frank@example.com','hashed100','walker'),
('eve123','eve@example.com','hashed101','owner');

INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'eve123'), 'Charlie', 'medium'),
((SELECT user_id FROM Users WHERE username = 'eve123'), 'Lucy', 'small'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Levi', 'large');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-07-10 01:30:00', 60, 'Milner Road', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-09-10 21:30:00', 20, 'Windy Point', 'completed'),
((SELECT dog_id FROM Dogs WHERE name = 'Levi'), '2025-09-11 12:30:00', 300, 'Africa', 'cancelled');