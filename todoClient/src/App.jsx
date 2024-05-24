import Navbar from './components/Navbar'
import 'primereact/resources/themes/saga-blue/theme.css';
import "primeicons/primeicons.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CreateTodo from './components/CreateTodo';
import Trash from './components/Trash';
import Profile from './components/Profile';
function App() {

  return (
    <>
    <span className='gradient'></span>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/create/" element={<CreateTodo />} />
            <Route path="/trash/" element={<Trash />} />
            <Route path="/profile/" element={<Profile />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
