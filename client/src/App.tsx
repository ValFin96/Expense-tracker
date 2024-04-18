import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateExpense from './routes/AddExpense';
import Home from './routes/Home';
import { ExpensesContextProvider } from "./context/ExpensesContext";

const App = () => {
    return (
        <ExpensesContextProvider>
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />}></Route>
                        <Route path='/add' element={<UpdateExpense />}></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ExpensesContextProvider>
    );
}

export default App;