INSERT INTO Users (username, email, passwword_hash, role) VALUES
('alice123','alice@example.com','hashed123','owner'),
('bobwalker','bob@example.com','hashed456','walker'),
('carol123','carol@example.com''hashed789','owner'),
('frankwalker','frank@example.com','hashed100','walker'),
('eve123','eve@example.com','hashed101','owner')
;

INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'eve123'), 'Charlie', 'medium'),
((SELECT user_id FROM Users WHERE username = 'eve123'), 'Lucy', 'small')
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Levi', 'large')