
INSERT INTO users (username, password) VALUES
    ('john_doe', 'hashed_password_1'),
    ('jane_smith', 'hashed_password_2');

INSERT INTO Workout_Plan (user_id, plan_name, description) VALUES
    (1, 'Beginner Plan', 'A plan for beginners'),
    (2, 'Advanced Plan', 'A plan for advanced users');

INSERT INTO Exercise (plan_id, exercise_name, sets, repetitions, notes) VALUES
    (1, 'Push-ups', 3, 10, 'Do push-ups with proper form'),
    (2, 'Deadlifts', 4, 8, 'Use proper deadlift form');

INSERT INTO Exercise_Log (plan_id, exercise_id, user_id, date, sets_completed, reps_completed) VALUES
    (1, 1, 1, '2023-01-15', 3, 10),
    (2, 2, 2, '2023-01-15', 4, 8);

