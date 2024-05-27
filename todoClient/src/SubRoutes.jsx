import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateTodo from './components/CreateTodo';
import Trash from './components/Trash';
import Profile from './components/Profile';
import PrivateRoute from './PrivateRoute';

function SubRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="create" element={<PrivateRoute><CreateTodo /></PrivateRoute>} />
                <Route path="completed" element={<PrivateRoute><Trash /></PrivateRoute>} />
                <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
                {/* other routes where Navbar should appear */}
            </Routes>
        </>
    );
}

export default SubRoutes;
