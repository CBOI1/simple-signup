# Blog Web Application

A full-stack web application built with **Node.js**, **Express**, and **PostgreSQL** that allows users to read blog posts, create accounts, and unlock additional features through authentication and membership.

## Features

### Public Access
- Anyone (including non-logged-in users) can:
  - View all blog posts
  - Read post content

### Authentication & Sessions
- User authentication implemented with:
  - `passport`
  - `passport-local`
  - `express-session`
- Secure login and signup flows
- Session-based authentication to persist login state

### User Roles
- **Non-authenticated users**
  - Can browse and read blog posts
- **Authenticated users**
  - Can create blog posts
  - Can choose to become a **member**
- **Members**
  - Can see additional post metadata, including:
    - Author name
    - Date the blog post was written

### Blog Functionality
- Create and display blog posts
- Conditional rendering of UI elements based on:
  - Login status
  - Membership status

### Data Validation
- User input is validated and sanitized using:
  - `express-validator`
- Prevents invalid or malformed data from being stored in the database

## Tech Stack

### Backend
- **Node.js**
- **Express**
- **PostgreSQL**
- **Passport.js** (Local Strategy)
- **Express Sessions**
- **EJS** (Templating)

### Frontend
- Server-side rendering
- Dynamic navigation based on authentication state

### Tooling
- **npm** for dependency management
- Environment variables for configuration (database configuration, secrets)

### Database
- PostgreSQL used for persistent storage
- Stores:
  - Users
  - Blog posts
  - Membership status
  - Authentication-related data
  
## Getting Started

### Prerequisites
- Node.js
- npm
- PostgreSQL

### Installation
1. Clone the repository
   ```
   git clone git@github.com:CBOI1/simple-signup.git
   cd simple-signup
2. Install dependencies
    ```
    npm install
3. Setup environment variables
    ```
    PGUSER=
    PGPASSWORD=''
    PGHOST=localhost
    PGPORT=5432
    PGDATABASE=signup
    MEMBER_PASSWORD=oobi
4. Create database
    ```
    homeuser@firstname-MacBook-Air simple-signup % psql
    homeuser=# CREATE DATABASE
5. Start the application
    ```
    node app.js
6. Open browser and visit the URL: http://localhost:3000/