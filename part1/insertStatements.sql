INSERT INTO Users (username, email, passwword_hash, role) VALUES
('alice123','alice@example.com','hashed123','owner'),
('bobwalker','bob@example.com','hashed456','walker'),
('carol123','carol@example.com''hashed789','owner'),
('frankwalker','frank@example.com','hashed100','walker'),
('eve123','eve@example.com','hashed101','owner')
;

INSERT INTO Dogs (owner_id, name, size) VALUES
(SELECT user_id FROM Users, 'Max', 'medium'),
(2, 'Bella', 'small'),
(3, 'Charlie', 'medium'),
(4, 'Lucy', 'small')
(5, 'Levi', 'large')