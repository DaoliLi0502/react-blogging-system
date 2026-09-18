# React Blogging System

A full-stack blogging system built with React, Node.js, Express, and SQLite.

## Overview

This project is a web-based blogging system that allows users to create and manage articles, interact with other users, and receive notifications.

The system includes user authentication, article management, comments, likes, subscriptions, tags, search, pagination, image uploads, and rich text editing.

## Features

- User registration and login
- JWT-based authentication with HTTP cookies
- Create, edit, and delete articles
- Rich text editing with TinyMCE
- Upload images for articles
- Add and remove multiple tags
- Search articles
- Article pagination
- Like and unlike articles
- Comment on articles
- Delete comments
- Subscribe to other users
- View notifications
- User profiles and avatars
- Tag-based article browsing
- Responsive navigation

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- TinyMCE

### Backend

- Node.js
- Express
- SQLite
- JWT
- bcrypt
- Multer

## Project Structure

```text
react-blogging-system/
├── backend/
│   ├── middleware/
│   ├── uploads/
│   ├── avatars/
│   ├── db.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
└── database/
    └── schema.sql
Getting Started
1. Clone the repository
git clone https://github.com/DaoliLi0502/react-blogging-system.git
cd react-blogging-system
2. Install backend dependencies
cd backend
npm install
3. Install frontend dependencies

Open another terminal:

cd frontend
npm install
4. Configure environment variables

Create a .env file in the backend directory and configure the required environment variables.

For the frontend, create a .env file and add your TinyMCE API key:

VITE_TINYMCE_API_KEY=your_api_key
5. Start the backend
cd backend
node server.js

The backend runs on:

http://localhost:3000
6. Start the frontend
cd frontend
npm run dev

The frontend runs on:

http://localhost:5173
Database

The project uses SQLite as its database.

The database schema includes tables for:

Users
Avatars
Articles
Comments
Tags
Article likes
Article tags
User subscriptions
Comment notifications
Subscription notifications
Authentication

Authentication uses JSON Web Tokens (JWT).

After a successful login, the JWT is stored in an HTTP cookie. Protected requests use the cookie to authenticate the user.

Future Improvements
Improve UI and accessibility
Add automated tests
Deploy the application to a production environment