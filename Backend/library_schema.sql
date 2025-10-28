-- Personal Library Management System Database Schema

CREATE DATABASE IF NOT EXISTS librarydb;
USE librarydb;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Insert sample data (optional)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe5ldjoiKDpjIsIQaQMQZ2', 'admin@library.com'),
('user1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe5ldjoiKDpjIsIQaQMQZ2', 'user1@library.com');

INSERT INTO books (title, author, description, user_id) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel', 1),
('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice', 1),
('1984', 'George Orwell', 'A dystopian social science fiction novel', 2);