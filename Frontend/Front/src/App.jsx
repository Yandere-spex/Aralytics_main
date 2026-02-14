import './App.css'
import Login from './Components/Pages/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from  './Components/Pages/SignUp/Signup';
import MainLayout from "./Components/Pages/MainLayout/MainLayout.jsx";
import { AuthProvider } from './context/AuthContext';

export default function App() {

  return (
    <>  
      <BrowserRouter>
          <AuthProvider>
                    <Routes>
                        <Route path="/" element={<SignUp/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/SignUp" element={<SignUp/>} />
                        <Route path="/Mainlayout" element={<MainLayout/>} />
                    </Routes>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}
