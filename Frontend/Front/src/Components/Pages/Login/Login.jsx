import './Login.css';
import logo from '../../../../src/assets/imageCover/aralytics_Cover.jpg';
import InputComponent from '../../InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.data.user, data.data.token);

                // ← Role-based redirect
                if (data.data.user.role === 'teacher') {
                    navigate('/teacher', { replace: true });
                } else {
                    navigate('/Mainlayout', { replace: true });
                }
            } else {
                setErrors({ general: data.message || 'Invalid email or password' });
            }
        } catch (err) {
            setErrors({ general: 'Network error. Please try again.' });
        }

        setLoading(false);
    };

    return (
        <div className="main-wrapper">
            <div className="loginContainer">
                <img className="logo" src={logo} alt="Logo" />
                <h2 className="logotext">Aralytics</h2>
                <h3 className="logoDes">Learning Platform</h3>

                <form onSubmit={handleSubmit} className="form">
                    <InputComponent type="email"    name="email"    label="Email"    placeholder="Enter your email"    value={formData.email}    onChange={handleChange} error={errors.email} />
                    <InputComponent type="password" name="password" label="Password" placeholder="Enter your password" value={formData.password} onChange={handleChange} error={errors.password} />

                    {errors.general && <p style={{ color: 'red', fontSize: '14px', margin: '10px 0' }}>{errors.general}</p>}

                    <button type="submit" disabled={loading} className="button">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>Don't have an account? <span onClick={() => navigate('/SignUp')}>Sign Up</span></p>
            </div>
        </div>
    );
}