import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';

dotenv.config()

const app = express();
app.use(cors());
app.use(express.static('public'));


const {Pool} = pg;
const dbString = process.env.DATABASE_URL;
const PORT = process.env.PORT;

const pool = new Pool({
    user: "colin",
    host: "localhost",
    database: "lifttracker",
    password: '',
    port: 5432
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Lift Track API!');
});

app.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insert user data into the database
        const result = await pool.query(
            'INSERT INTO "users" (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        const newUser = result.rows[0];
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



app.get('/api/users', async (req, res)  => {
    try {
        const result = await pool.query('SELECT * FROM users')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Bad Request')
    }
});

app.get('/api/users/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    try {
      const result = await pool.query('SELECT * FROM "users" WHERE user_id = $1', [userId]);
      const user = result.rows[0];
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(404).send('User not found');
    }
  });

app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "users" (username, password) VALUES ($1, $2) RETURNING *',
        [username, password]
      );
      const newUser = result.rows[0];
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.put('/api/users/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "users" SET username = $1,password = $2 WHERE user_id = $3 RETURNING *',
        [username, password, userId]
      );
      const updatedUser = result.rows[0];
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(404).send('User not found');
    }
  });
  
app.delete('/api/users/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    try {
      await pool.query('DELETE FROM "users" WHERE user_id = $1', [userId]);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(404).send('User not found');
    }
  });

app.get('/api/workout_plan', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM workout_plan');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Bad Request');
    }
  });
  
app.get('/api/workout_plan/:plan_id', async (req, res) => {
    const planId = req.params.plan_id;
    try {
      const result = await pool.query('SELECT * FROM "workout_plan" WHERE plan_id = $1', [planId]);
      const workoutPlan = result.rows[0];
      res.json(workoutPlan);
    } catch (error) {
      console.error(error);
      res.status(404).send('Workout Plan not found');
    }
  });
  
app.post('/api/workout_plan', async (req, res) => {
    const { user_id, plan_name, description } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "workout_plan" (user_id, plan_name, description) VALUES ($1, $2, $3) RETURNING *',
        [user_id, plan_name, description]
      );
      const newWorkoutPlan = result.rows[0];
      res.status(201).json(newWorkoutPlan);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.put('/api/workout_plan/:plan_id', async (req, res) => {
    const planId = req.params.plan_id;
    const { user_id, plan_name, description } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "workout_plan" SET user_id = $1, plan_name = $2, description = $3 WHERE plan_id = $4 RETURNING *',
        [user_id, plan_name, description, planId]
      );
      const updatedWorkoutPlan = result.rows[0];
      res.json(updatedWorkoutPlan);
    } catch (error) {
      console.error(error);
      res.status(404).send('Workout Plan not found');
    }
  });
  
  app.delete('/api/workout_plan/:plan_id', async (req, res) => {
    const planId = req.params.plan_id;
    try {
      await pool.query('DELETE FROM "workout_plan" WHERE plan_id = $1', [planId]);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(404).send('Workout Plan not found');
    }
  });
  
app.get('/api/exercise', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM exercise');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Bad Request');
    }
  });
  
app.get('/api/exercise/:exercise_id', async (req, res) => {
    const exerciseId = req.params.exercise_id;
    try {
      const result = await pool.query('SELECT * FROM "exercise" WHERE exercise_id = $1', [exerciseId]);
      const exercise = result.rows[0];
      res.json(exercise);
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise not found');
    }
  });
  
app.post('/api/exercise', async (req, res) => {
    const { plan_id, exercise_name, sets, repetitions, notes } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "exercise" (plan_id, exercise_name, sets, repetitions, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [plan_id, exercise_name, sets, repetitions, notes]
      );
      const newExercise = result.rows[0];
      res.status(201).json(newExercise);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.put('/api/exercise/:exercise_id', async (req, res) => {
    const exerciseId = req.params.exercise_id;
    const { plan_id, exercise_name, sets, repetitions, notes } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "exercise" SET plan_id = $1, exercise_name = $2, sets = $3, repetitions = $4, notes = $5 WHERE exercise_id = $6 RETURNING *',
        [plan_id, exercise_name, sets, repetitions, notes, exerciseId]
      );
      const updatedExercise = result.rows[0];
      res.json(updatedExercise);
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise not found');
    }
  });
  
app.delete('/api/exercise/:exercise_id', async (req, res) => {
    const exerciseId = req.params.exercise_id;
    try {
      await pool.query('DELETE FROM "exercise" WHERE exercise_id = $1', [exerciseId]);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise not found');
    }
  });
  
app.get('/api/exercise_log', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM exercise_log');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Bad Request');
    }
  });
  
app.get('/api/exercise_log/:log_id', async (req, res) => {
    const logId = req.params.log_id;
    try {
      const result = await pool.query('SELECT * FROM "exercise_log" WHERE log_id = $1', [logId]);
      const exerciseLog = result.rows[0];
      res.json(exerciseLog);
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise Log not found');
    }
  });
  
app.post('/api/exercise_log', async (req, res) => {
    const { plan_id, exercise_id, user_id, date, sets_completed, reps_completed, weight_used, duration, notes } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "exercise_log" (plan_id, exercise_id, user_id, date, sets_completed, reps_completed, weight_used, duration, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [plan_id, exercise_id, user_id, date, sets_completed, reps_completed, weight_used, duration, notes]
      );
      const newExerciseLog = result.rows[0];
      res.status(201).json(newExerciseLog);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.put('/api/exercise_log/:log_id', async (req, res) => {
    const logId = req.params.log_id;
    const { plan_id, exercise_id, user_id, date, sets_completed, reps_completed, weight_used, duration, notes } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "exercise_log" SET plan_id = $1, exercise_id = $2, user_id = $3, date = $4, sets_completed = $5, reps_completed = $6, weight_used = $7, duration = $8, notes = $9 WHERE log_id = $10 RETURNING *',
        [plan_id, exercise_id, user_id, date, sets_completed, reps_completed, weight_used, duration, notes, logId]
      );
      const updatedExerciseLog = result.rows[0];
      res.json(updatedExerciseLog);
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise Log not found');
    }
  });
  
app.delete('/api/exercise_log/:log_id', async (req, res) => {
    const logId = req.params.log_id;
    try {
      await pool.query('DELETE FROM "exercise_log" WHERE log_id = $1', [logId]);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(404).send('Exercise Log not found');
    }
  });
  
app.listen(PORT, () => {
    console.log(`Listening on port; ${PORT}`)
});