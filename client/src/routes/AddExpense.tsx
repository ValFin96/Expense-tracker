import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CoffeeIcon from '@mui/icons-material/Coffee';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import ExpenseFinder from '../apis/ExpenseFinder';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';

interface Expense {
  expense_type_id: number;
  amount: string;
}

interface ExpenseAccumulator {
  coffee: number;
  food: number;
  alcohol: number;
}

function AddExpense() {
  const location = useLocation();
  const { userId, expenses } = location.state;


  const [coffeeAmount, setCoffeeAmount] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [alcoholAmount, setAlcoholAmount] = useState('');
  const expenseTypeIds = {
    Food: 1,
    Coffee: 2,
    Alcohol: 3
  };


  useEffect(() => {
    if (expenses && expenses.length > 0) {
      const defaultValues = expenses.reduce((acc: ExpenseAccumulator, expense: Expense) => {
        switch (expense.expense_type_id) {
          case expenseTypeIds.Coffee:
            acc.coffee = parseFloat(expense.amount);
            break;
          case expenseTypeIds.Food:
            acc.food = parseFloat(expense.amount);
            break;
          case expenseTypeIds.Alcohol:
            acc.alcohol = parseFloat(expense.amount);
            break;
          default:
            console.log('Unknown type_id:', expense.expense_type_id); // Log if a type_id does not match
            break;
        }
        return acc;
      }, { coffee: '', food: '', alcohol: '' });

      setCoffeeAmount(defaultValues.coffee);
      setFoodAmount(defaultValues.food);
      setAlcoholAmount(defaultValues.alcohol);
    }
  }, [expenses]);


  const [error, setError] = useState({
    coffee: '',
    food: '',
    alcohol: '',
    form: '',
    success: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError({ coffee: '', food: '', alcohol: '', form: '', success: 'Expenses added successfully!' });

    const today = new Date().toISOString().slice(0, 10);


    try {
      const todayExpensesResponse = await ExpenseFinder.get(`users/${userId}/${today}`);

      const expensesData = {
        expenses: [
          { type_id: expenseTypeIds.Food, amount: foodAmount },
          { type_id: expenseTypeIds.Coffee, amount: coffeeAmount },
          { type_id: expenseTypeIds.Alcohol, amount: alcoholAmount }
        ]
      };

      let response;
      if (todayExpensesResponse.data && todayExpensesResponse.data.length > 0) {
        // If today's expenses exist, update them
        response = await ExpenseFinder.put(`users/${userId}/${today}`, expensesData);
        setError({ ...error, success: 'Expenses updated successfully!' });
      } else {
        // If no expenses for today, create new
        response = await ExpenseFinder.post(`/users/${userId}`, expensesData);
        setError({ ...error, success: 'Expenses added successfully!' });
      }
      setCoffeeAmount('');
      setFoodAmount('');
      setAlcoholAmount('');
      navigate('/');

    } catch (err) {
      console.error(err);
      setError({ ...error, form: 'Failed to add or update expenses. Please try again.', success: '' });
    }
  };


  const handleFocus = () => {
    setError(prev => ({ ...prev, coffee: '', food: '', alcohol: '', form: '', success: '' }));
  };

  return (
    <Box m={2} >
      <Header text='How much did I spend today?' />
      <Box component="form" sx={{ maxWidth: 400 }}>
        <Box my={2}>
          <TextField
            fullWidth
            error={!!error.food}
            helperText={error.food}
            id="outlined-controlled"
            label="Food"
            value={foodAmount}
            onFocus={handleFocus}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target;
              if (value === '' || (value.match(/^\d*\.?\d*$/) && parseFloat(value) >= 1 && parseFloat(value) <= 100)) {
                setFoodAmount(value);
                setError(prev => ({ ...prev, food: '' })); // Clears error if input is valid
              } else {
                setError(prev => ({ ...prev, food: 'Please enter a number between 1 and 100' }));
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FastfoodIcon />
                  $
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            error={!!error.coffee}
            helperText={error.coffee}
            id="outlined-controlled"
            label="Coffee"
            value={coffeeAmount}
            onFocus={handleFocus}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target;
              if (value === '' || (value.match(/^\d*\.?\d*$/) && parseFloat(value) >= 1 && parseFloat(value) <= 100)) {
                setCoffeeAmount(value);
                setError(prev => ({ ...prev, coffee: '' }));
              } else {
                setError(prev => ({ ...prev, coffee: 'Please enter a number between 1 and 100' }));
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CoffeeIcon />
                  $
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box my={2}>
          <TextField
            fullWidth
            error={!!error.alcohol}
            helperText={error.alcohol}
            id="outlined-controlled"
            label="Alcohol"
            value={alcoholAmount}
            onFocus={handleFocus}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target;
              if (value === '' || (value.match(/^\d*\.?\d*$/) && parseFloat(value) >= 1 && parseFloat(value) <= 100)) {
                setAlcoholAmount(value);
                setError(prev => ({ ...prev, alcohol: '' })); // Clears error if input is valid
              } else {
                setError(prev => ({ ...prev, alcohol: 'Please enter a number between 1 and 100' }));
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalBarIcon />
                  $
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {error.form && <Alert severity="error">{error.form}</Alert>}
        {error.success && <Alert severity="success">{error.success}</Alert>}
        <Box my={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate('/')}>Back</Button>
          <Button color="primary" variant="contained" type='submit' onClick={handleSubmit}>Add expenses</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddExpense;
