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
connectionString: dbString
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
                res.status(200).json({user,  success: true, message: 'Login successful' });
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

app.post('/api/workout-plans', async (req, res) => {
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
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/api/workout-plans/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const result = await pool.query(
            'SELECT plan_id, plan_name, description FROM "workout_plan" WHERE user_id = $1',
            [user_id]
        );
        const workoutPlans = result.rows;
        res.status(200).json(workoutPlans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/api/workout-plans/:planId', async (req, res) => {
    const planId = req.params.planId;

    try {
        const deleteWorkoutPlanQuery = 'DELETE FROM "workout_plan" WHERE plan_id = $1 RETURNING *';
        const deleteWorkoutPlanResult = await pool.query(deleteWorkoutPlanQuery, [planId]);

        if (deleteWorkoutPlanResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Workout plan not found.' });
            return;
        }

        const deleteExercisesQuery = 'DELETE FROM "exercises" WHERE plan_id = $1 RETURNING *';
        await pool.query(deleteExercisesQuery, [planId]);

        const deletedPlan = deleteWorkoutPlanResult.rows[0];
        res.status(200).json({ success: true, message: `Workout plan with ID ${planId} and associated exercises deleted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});






app.listen(PORT, () => {
    console.log(`Listening on port; ${PORT}`)
});