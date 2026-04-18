# NGO Coordination API

The NGO Coordination API is a backend service designed to facilitate coordination between volunteers, field workers, and administrators in non-governmental organizations (NGOs). It provides essential infrastructure to manage users, track their skills, map out tasks based on geographical locations, and organize operations efficiently.

## Core Technologies
- **Node.js** & **Express.js**: Core server infrastructure.
- **PostgreSQL**: Primary relational database.
- **PostGIS**: PostgreSQL extension used for handling geographical data (`geography(POINT, 4326)`).
- **node-pg-migrate**: Database migration management.

## Project Structure

```text
NGO Coordination API/
├── src/
│   ├── config/
│   │   └── db.js            # PostgreSQL database connection configuration
│   ├── migrations/          # Database migration files (e.g., initial schema)
│   └── server.js            # Express server entry point, routes, and middleware
├── .env                     # Environment variables configuration (ignored by git)
├── package.json             # NPM dependencies and scripts
└── readme.md                # Project documentation
```

## System Architecture & Database Schema

The database relies on several core tables and relationships to model NGO operations:

1. **`users`**
   - Stores users with roles constraints: `volunteer`, `field_worker`, or `admin`.
   - Includes geospatial tracking mapping the user's `location` using PostGIS.

2. **`skills`** & **`volunteer_skills`**
   - Maintains a list of specific skills.
   - Maps users to their certified skills through a junction table.

3. **`tasks`**
   - Tasks reported by users, categorized and ranked by `urgency_level` (1-5).
   - Tracks the `location` of the task (PostGIS) and additional flexible JSON data (`survey_data`).
   - Tracks `status` (e.g., pending).

4. **`task_requirements`**
   - Connects tasks to the specific skills required to complete them.

### Database Indexing Strategy
For performance optimization, especially with geographical queries, we use:
- GiST indexes on `users.location` and `tasks.location`.
- GIN indexes on `tasks.survey_data` to quickly query within JSON fields.
- B-Tree indexes on `status` and `role` filtering.

## API Endpoints

### Health Check
- `GET /api/health`
  - **Description**: Verifies that the Express API is running and tests connectivity to the PostgreSQL database by pulling the current database timestamp.
  - **Response**: JSON specifying status, message, and `database_time`.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed.
- [PostgreSQL](https://www.postgresql.org/) database running.
- **PostGIS** extension installed on your PostgreSQL instance.

### Setup and Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Environment Variables:
   Ensure you configure your `.env` file at the root:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_database
   ```

3. Run Database Migrations:
   This will initialize the schema, install the PostGIS extension, and create the core tables:
   ```bash
   npm run migrate
   ```

### Scripts

- `npm run dev`: Starts the server in development mode using `nodemon`.
- `npm start`: Starts the application via node.
- `npm run migrate`: Runs the database migration to get your tables up to date.
- `npm run migrate:create`: Creates a new migration file.
