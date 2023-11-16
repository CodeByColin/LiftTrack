import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';



const {Pool} = pg;
const app = express();
const PORT = 3000;
app.use(express.static('public'))

const pool = new Pool({
    user: 'colin',
    host: 'localhost',
    database: 'lifttracker',
    password: '',
    port: 5432
})

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Lift Track API!');
})


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

app.listen(PORT, () => {
    console.log(`Listening on port; ${PORT}`)
});