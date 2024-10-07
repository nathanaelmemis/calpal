import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

import { Dashboard } from './pages/Dashboard/Dashboard';
import { Login } from './pages/Login/Login';
import AddFoodDish from './pages/AddFoodDish/AddFoodDish';
import { CreateFoodDish } from './pages/CreateFoodDish/CreateFoodDish';

import { UserDataSettings } from './pages/UserDataSettings/UserDataSettings';
import EditFoodDish from './pages/EditFoodDish/EditFoodDish';
import { ShowFoodDishEaten } from './pages/ShowFoodDishEaten/ShowFoodDishEaten';
import EditFoodDishEaten from './pages/EditFoodDishEaten/EditFoodDishEaten';
import { Register } from './pages/Register/Register';
import { ChangePassword } from './pages/ChangePassword/ChangePassword';


export function App() {
    return (
        <Container
            maxWidth={'md'}
        >
            <Routes>
                <Route path={'/login'} element={ <Login /> } />
                <Route path={'/register'} element={ <Register /> } />
                <Route path={'/dashboard'} element={ <Dashboard /> } />
                <Route path={'/addFood'} element={ <AddFoodDish /> } />
                <Route path={'/createFood'} element={ <CreateFoodDish /> } />
                <Route path={'/editFood'} element={ <EditFoodDish /> } />
                <Route path={'/showFoodEaten'} element={ <ShowFoodDishEaten /> } />
                <Route path={'/editFoodEaten'} element={ <EditFoodDishEaten /> } />
                <Route path={'/userSettings'} element={ <UserDataSettings /> } />
                <Route path={'/changePassword'} element={ <ChangePassword /> } /> 
                <Route path={'*'} element={ <Navigate to={'/dashboard'} /> } />
            </Routes>
        </Container>
    )
}