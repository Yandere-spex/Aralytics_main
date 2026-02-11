// Login.jsx
import { useState } from 'react';
import InputComponent from '../../InputComponent/InputComponent';
import './Login.css';
import logo from '../../../assets/imageCover/logo.jpg';
import { useNavigate } from 'react-router-dom';


export default function Login (){
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log('handleChange:', e.target.name, e.target.value); // DEBUG
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Login FormData:', formData); // DEBUG
        
        setLoading(true);
        setErrors({});

        const payload = {
            email: formData.email,
            password: formData.password
        };

        console.log('Payload being sent:', payload); // DEBUG

        try {
            // Real API call to backend
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status); // DEBUG
            const data = await response.json();
            console.log('Response data:', data); // DEBUG

            if (response.ok) {
                // Login successful - store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Redirect to dashboard
                navigate('/Mainlayout');
            } else {
                // Login failed - show error message
                setErrors({ general: data.message || 'Invalid credentials' });
            }
        } catch (err) {
            console.error('Error:', err); // DEBUG
            setErrors({ general: 'Network error. Please try again.' });
        }
        
        setLoading(false);
    };

    return (
        <div className='main-wrapper'>
            <div className={"loginContainer"}>
                <img className='logo' src={logo} alt='Logo'/>
                <h2 className='logotext'>Aralytics</h2>
                <h3 className='logoDes'>Learning Platform</h3>
                <form onSubmit={handleSubmit} className={"form"}>
                    <InputComponent
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputComponent
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    {errors.general && (
                        <p style={{ color: 'red', fontSize: '14px', margin: '10px 0' }}>
                            {errors.general}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className={"button"}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p><a href="/forgot-password">Forgot Password?</a></p>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </div>
    );
};