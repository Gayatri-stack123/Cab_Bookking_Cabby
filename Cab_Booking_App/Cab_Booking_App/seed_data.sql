-- Seed Users
INSERT INTO users (name, email, password, role, phone, created_at) VALUES
('Admin User', 'admin@cabby.com', '$2a$10$xn3LI/AjWicFYJsSrLxerejxgBe9GuS1lJ4ZjK6J6J8C.1.y2W2yK', 'ADMIN', '1234567890', NOW()),
('Rider One', 'rider@example.com', '$2a$10$xn3LI/AjWicFYJsSrLxerejxgBe9GuS1lJ4ZjK6J6J8C.1.y2W2yK', 'RIDER', '9876543210', NOW()),
('Driver One', 'driver@example.com', '$2a$10$xn3LI/AjWicFYJsSrLxerejxgBe9GuS1lJ4ZjK6J6J8C.1.y2W2yK', 'DRIVER', '5555555555', NOW());

-- Seed Drivers
INSERT INTO drivers (user_id, vehicle_type, vehicle_number, license_number, availability_status, rating) 
SELECT id, 'Sedan', 'NY-1234', 'LIC-999', true, 4.8 FROM users WHERE email = 'driver@example.com';
