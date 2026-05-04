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
                
                
<div class="logo-wrap">

    <div class="icon" role="img" aria-label="Open book with bookmark">
        <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14 Q8 10 13 10 L47 10 L47 78 Q47 82 42 82 L13 82 Q8 82 8 78 Z"
                fill="white" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M53 10 L87 10 Q92 10 92 14 L92 78 Q92 82 87 82 L58 82 Q53 82 53 78 Z"
                fill="white" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
        <line x1="50" y1="10" x2="50" y2="82" stroke="#111" stroke-width="3" stroke-linecap="round"/>

        <line x1="18" y1="26" x2="41" y2="26" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="18" y1="35" x2="41" y2="35" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="18" y1="44" x2="41" y2="44" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="18" y1="53" x2="41" y2="53" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>


        <line x1="59" y1="44" x2="82" y2="44" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="59" y1="53" x2="82" y2="53" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
        <line x1="59" y1="62" x2="82" y2="62" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>


        <path d="M68 4 L82 4 L82 28 L75 22 L68 28 Z"
                fill="#007bff" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>
        </svg>
    </div>

</div>



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