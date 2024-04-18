require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());


//ROUTES


// Create multiple expenses for a specific user
app.post('/expenses/users/:id', async (req, res) => {
    const { id } = req.params; 
    const { expenses } = req.body;
    try {
        const query = "INSERT INTO expenses (user_id, expense_type_id, amount, date) VALUES ($1, $2, $3, $4) RETURNING *";
        const results = [];
        const date = new Date().toISOString().slice(0, 10);  

        for (const expense of expenses) {
            const result = await pool.query(query, [id, expense.type_id, expense.amount, date]);
            results.push(result.rows[0]);
        }

        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


// update multiple expenses for a user for todays date
app.put('/expenses/users/:id/:today', async (req, res) => {
    const { id, today } = req.params;
    const { expenses } = req.body;
    try {
        const query = "UPDATE expenses SET amount = $1 WHERE user_id = $2 AND date = $3 AND expense_type_id = $4 RETURNING *";
        const results = [];

        for (const expense of expenses) {
            const result = await pool.query(query, [expense.amount, id, today, expense.type_id]);
            results.push(result.rows[0]);
        }

        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});



//update an expense
app.put('/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const updateExpense = await pool.query("UPDATE expenses SET amount = $1 WHERE id = $2", [amount, id]);
        res.json("Expense was updated");
    } catch (err) {
        console.error(err.message);
    }
})


//get an expense for a specific user
app.get('/expenses/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expenses = await pool.query(
            `SELECT
            et.id AS expense_type_id,
            et.name AS expense_type_name,
            EXTRACT(WEEK FROM NOW()) AS current_week, 
            SUM(e.amount) FILTER (WHERE EXTRACT(WEEK FROM e.date) = EXTRACT(WEEK FROM NOW())
            AND EXTRACT(YEAR FROM e.date) = EXTRACT(YEAR FROM NOW())) AS total_amount,
            (SELECT ROUND(SUM(amount) / COUNT(DISTINCT DATE_TRUNC('week', date)), 2)
            FROM expenses WHERE expense_type_id = et.id AND user_id = $1) AS avg_amount
          FROM expenses e
          JOIN expense_types et ON e.expense_type_id = et.id
          WHERE e.user_id = $1
          GROUP BY et.id, et.name;`,
            [id]
        );
        res.json(expenses.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get expenses for a specific user for today
app.get('/expenses/users/:id/:today', async (req, res) => {
    try {
      const { id, today} = req.params;
      const expenses = await pool.query(
        `SELECT * FROM expenses WHERE user_id = $1 AND date = $2`,
        [id, today]
      );
      res.json(expenses.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  



app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

