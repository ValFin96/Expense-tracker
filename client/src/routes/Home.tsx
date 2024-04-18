import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import Box from '@mui/material/Box';
import ExpenseFinder from '../apis/ExpenseFinder';
import { ExpensesContext } from '../context/ExpensesContext';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';



const Home: React.FC = () => {
  const context = useContext(ExpensesContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('ExpensesContext.Provider is missing around this component');
  }
  const { expenses, setExpenses } = context;

  const today = new Date().toISOString().slice(0, 10);
  const [isEdit, setIsEdit] = useState(false);
  const [todayExpenses, setTodayExpenses] = useState([]);

  const userIds = [
    91235, 93430, 5963, 29926, 67471,
    36235, 8122, 85641, 88791, 39853
  ];

  const [userId, setUserId] = useState(() => {
    const existingUserId = sessionStorage.getItem('userId');
    if (!existingUserId) {
      const randomIndex = Math.floor(Math.random() * userIds.length);
      const newUserId = userIds[randomIndex].toString();
      sessionStorage.setItem('userId', newUserId);
      return newUserId;
    }
    return existingUserId;
  });

  useEffect(() => {
    window.addEventListener('beforeunload', clearSessionStorage);

    return () => {
      window.removeEventListener('beforeunload', clearSessionStorage);
    };
  }, []);

  const clearSessionStorage = () => {
    sessionStorage.removeItem('userId');
  };

  console.log(userId);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const allExpensesResponse = await ExpenseFinder.get(`/users/${userId}`);
        const todayExpensesResponse = await ExpenseFinder.get(`/users/${userId}/${today}`);
        setExpenses(allExpensesResponse.data);
        if (todayExpensesResponse.data && todayExpensesResponse.data.length > 0) {
          setTodayExpenses(todayExpensesResponse.data);
          setIsEdit(true);
        } else {
          setIsEdit(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId]);

  const handleNavigate = () => {
    navigate('/add', { state: { userId, expenses: todayExpenses } });
  };

  return (
    <Box m={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="start">
        <Header text='Am I spending too much?' />
        <Button
          color="primary"
          variant="contained"
          type='submit'
          onClick={handleNavigate}
        >
          {isEdit ? 'Edit Expenses' : 'Add Expenses'}
        </Button>
      </Box>
      {expenses.map((expense) => (
        <Box width="400px" key={expense.expense_type_id}>
          <Box display="flex" justifyContent="space-between" alignItems="center" m={2}>
            <Typography variant="body1" style={{ marginLeft: '8px', marginRight: '8px', textTransform: 'capitalize' }}>
              {expense.expense_type_name}
            </Typography>
            <Typography variant="body1">
              {expense.total_amount === null ? 'N/A' : `$${Number(expense.total_amount).toFixed(2)}`} / week
              {expense.avg_amount && expense.total_amount !== null && (
                <Typography variant="body1" style={{ color: Number(expense.total_amount) > Number(expense.avg_amount) ? 'red' : 'green', display: 'flex', alignItems: 'center' }}>
                  {Number(expense.total_amount) > Number(expense.avg_amount) ?
                    (<><ArrowUpIcon style={{ fontSize: 'inherit', verticalAlign: 'middle' }} />{`${((Number(expense.total_amount) / Number(expense.avg_amount) - 1) * 100).toFixed(0)}% above`}</>) :
                    (<><ArrowDownIcon style={{ fontSize: 'inherit', verticalAlign: 'middle' }} />{`${((1 - Number(expense.total_amount) / Number(expense.avg_amount)) * 100).toFixed(0)}% below`}</>)
                  } average
                </Typography>
              )}
            </Typography>
          </Box>
          <div style={{ width: '25em', height: '1px', backgroundColor: 'black' }}
          ></div>
        </Box>

      ))}

    </Box>
  )
}

export default Home