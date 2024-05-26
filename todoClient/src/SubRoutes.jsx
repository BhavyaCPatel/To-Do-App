import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateTodo from './components/CreateTodo';
import Trash from './components/Trash';
import Profile from './components/Profile';
import { Routes, Route } from 'react-router-dom';

function SubRoutes() {
    const token = localStorage.getItem('authToken');
    console.log(token)
    const navigate = useNavigate();

    if (!token) {
        navigate('/');
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="home" element={<Home />} />
                <Route path="create" element={<CreateTodo />} />
                <Route path="trash" element={<Trash />} />
                <Route path="profile" element={<Profile />} />
                {/* other routes where Navbar should appear */}
            </Routes>
        </>
    );
}

export default SubRoutes;