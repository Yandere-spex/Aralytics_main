import './App.css'
import Login from './Components/Pages/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from  './Components/Pages/SignUp/Signup';

export default function App() {

  return (
    <>  
      <BrowserRouter>
              <Routes>
                  <Route path="/" element={<SignUp/>} />
                  <Route path="/login" element={<Login/>} />
              </Routes>
        </BrowserRouter>
    </>
  )
}
