import 'primereact/resources/themes/saga-blue/theme.css';
import "primeicons/primeicons.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SubRoutes from './SubRoutes';
import LoginForm from './components/LoginForm';
import SignUp from './components/SignUp';
function App() {

  return (
    <>
      <span className='gradient'></span>
      <Router>
        <Routes>
          <Route path="/*" element={<SubRoutes />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
