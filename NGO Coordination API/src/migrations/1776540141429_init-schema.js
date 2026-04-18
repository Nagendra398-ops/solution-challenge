/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  // 1. Extensions
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // 2. Core Tables
  pgm.sql(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('volunteer', 'field_worker', 'admin')),
        password_hash VARCHAR(255) NOT NULL,
        location geography(POINT, 4326), 
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE TABLE skills (
        id SERIAL PRIMARY KEY,
        skill_name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
    );
  `);

  pgm.sql(`
    CREATE TABLE volunteer_skills (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
        certification_level VARCHAR(50),
        PRIMARY KEY (user_id, skill_id)
    );
  `);

  pgm.sql(`
    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        reported_by INT REFERENCES users(id) ON DELETE SET NULL,
        category VARCHAR(100) NOT NULL,
        urgency_level INT NOT NULL CHECK (urgency_level BETWEEN 1 AND 5),
        status VARCHAR(50) DEFAULT 'pending',
        location geography(POINT, 4326) NOT NULL,
        survey_data JSONB, 
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE TABLE task_requirements (
        task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
        skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
        PRIMARY KEY (task_id, skill_id)
    );
  `);

  // 3. Performance Indexes
  pgm.sql(`CREATE INDEX idx_users_location ON users USING GIST (location);`);
  pgm.sql(`CREATE INDEX idx_tasks_location ON tasks USING GIST (location);`);
  pgm.sql(`CREATE INDEX idx_tasks_survey_data ON tasks USING GIN (survey_data);`);
  pgm.sql(`CREATE INDEX idx_users_role ON users(role);`);
  pgm.sql(`CREATE INDEX idx_tasks_status ON tasks(status);`);
};

exports.down = (pgm) => {
  // Drops everything in reverse order
  pgm.sql(`DROP TABLE IF EXISTS task_requirements, volunteer_skills, tasks, users, skills CASCADE;`);
};