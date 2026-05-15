import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login            from './Components/Pages/Login/Login';
import SignUp           from './Components/Pages/SignUp/Signup';
import MainLayout       from './Components/Pages/MainLayout/MainLayout.jsx';
import TeacherLayout    from './Components/Pages/TeacherLayout/TeacherLayout.jsx';
import TeacherDashboard from './Components/Pages/TeacherDashboard/TeacherDashboard.jsx';
import ClassesPage      from './Components/Pages/Classes/ClassesPage.jsx'
import ProtectedRoute   from './routes/ProtectedRoute';

function RoleRedirect() {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user)   return <Navigate to="/login" replace />;
    return user.role === 'teacher'
        ? <Navigate to="/teacher" replace />
        : <Navigate to="/Mainlayout" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/"       element={<SignUp />} />
                    <Route path="/login"  element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />

                    {/* Role redirect */}
                    <Route path="/home" element={<RoleRedirect />} />

                    {/* Student routes */}
                    <Route path="/Mainlayout" element={
                        <ProtectedRoute allowedRoles={['user', 'student', 'admin']}>
                            <MainLayout />
                        </ProtectedRoute>
                    } />

                    {/* Teacher routes */}
                    <Route path="/teacher" element={
                        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <TeacherLayout />
                        </ProtectedRoute>
                    }>
                        <Route index          element={<TeacherDashboard />} />  {/* /teacher */}
                        <Route path="classes" element={<ClassesPage />} />       {/* /teacher/classes ← add */}
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}