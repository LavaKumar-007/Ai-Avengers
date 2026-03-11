-- AI Digital Feedback System - Database Setup
-- Run this script in MySQL to create the database and table

CREATE DATABASE IF NOT EXISTS feedback_system;
USE feedback_system;

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO feedback (name, faculty, course, rating, comment, sentiment) VALUES
('Rahul Sharma', 'Dr. Anand Kumar', 'Data Structures', 5, 'Excellent teaching methodology. Very clear explanations and great examples.', 'Positive'),
('Priya Patel', 'Prof. Meera Singh', 'Machine Learning', 4, 'Good course content but sometimes the pace was a bit fast.', 'Positive'),
('Amit Verma', 'Dr. Rajesh Gupta', 'Database Systems', 3, 'Average experience. The labs were helpful but lectures were boring at times.', 'Negative'),
('Sneha Reddy', 'Dr. Anand Kumar', 'Algorithms', 5, 'One of the best professors. Makes complex topics easy to understand. Truly helpful.', 'Positive'),
('Vikram Joshi', 'Prof. Meera Singh', 'Deep Learning', 2, 'Confusing explanations and poor course structure. Needs improvement.', 'Negative'),
('Kavya Nair', 'Dr. Sunita Rao', 'Web Technologies', 4, 'Great hands-on projects. The course was well structured and informative.', 'Positive');
