import React, { createContext, useState } from 'react';
import { ReactNode } from 'react';

type Expense = {
  expense_type_id: number;
  expense_type_name: string;
  total_amount: string | null ;
  avg_amount: string;
}

type ExpensesContextType = {
    expenses: Expense[]; 
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>; 
  };
  
  type ExpensesContextProviderProps = {
    children: ReactNode;
  };
  

  export const ExpensesContext = createContext<ExpensesContextType | null>(null);
  
  export const ExpensesContextProvider: React.FC<ExpensesContextProviderProps> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

  
      return (
          <ExpensesContext.Provider value={{ expenses, setExpenses }}>
              {children}
          </ExpensesContext.Provider>
      );
  }
