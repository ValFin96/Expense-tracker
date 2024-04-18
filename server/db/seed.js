const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

const pool = new Pool(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'expenses_db',
        password: 'Itagam20!',
        port: 5432,
    }
);

async function findExpenseTypeId(name) {
    const res = await pool.query('SELECT id FROM expense_types WHERE name = $1', [name]);
    return res.rows[0] ? res.rows[0].id : null;
}

async function insertExpense(user_id, expense_type_id, amount, date) {
    await pool.query('INSERT INTO expenses (user_id, expense_type_id, amount, date) VALUES ($1, $2, $3, $4)', [user_id, expense_type_id, amount, date]);
}

let insertPromises = [];

fs.createReadStream('db/billroo.csv')
    .pipe(csv())
    .on('data', (row) => {
        const insertPromise = findExpenseTypeId(row.expense_type).then(expense_type_id => {
            if (expense_type_id) {
                return insertExpense(row.user_id, expense_type_id, row.amount, row.date);
            } else {
                console.log(`Expense type ${row.expense_type} not found.`);
                return Promise.resolve();
            }
        });
        insertPromises.push(insertPromise);
    })
    .on('end', () => {
        Promise.all(insertPromises).then(() => {
            console.log('CSV file successfully processed');
            pool.end();
        });
    });

