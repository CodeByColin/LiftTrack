CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Workout_Plan (
    plan_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "users"(user_id),
    plan_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Exercise (
    exercise_id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES Workout_Plan(plan_id),
    exercise_name VARCHAR(255) NOT NULL,
    sets INT,
    repetitions INT,
    weight FLOAT,
    notes TEXT
);

CREATE TABLE Exercise_Log (
    log_id SERIAL PRIMARY KEY,
    plan_id INT REFERENCES Workout_Plan(plan_id),
    exercise_id INT REFERENCES Exercise(exercise_id),
    user_id INT REFERENCES "users"(user_id),
    date DATE NOT NULL,
    sets_completed INT,
    reps_completed INT,
    weight_used FLOAT
);
