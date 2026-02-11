import './Signup.css'
import logo from '../../../../src/assets/imageCover/logo.jpg';
import InputComponent from '../../InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUp() {
    const navigate = useNavigate();

    const tryNavigate = () =>{
        navigate('/login');
    }

    // Updated formData to match backend requirements
    const [formData, setFormData] = useState({ 
        firstName: '',
        lastName: '',
        email: '', 
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // DEBUG - Check state before submitting
    console.log('FormData state:', formData);
    console.log('firstName:', formData.firstName);
    console.log('lastName:', formData.lastName);
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
    };

    console.log('Payload being sent:', payload);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            setSuccessMessage('Registration successful! Redirecting...');
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            setTimeout(() => {
                navigate('/Mainlayout');
            }, 2000);

        } else {
            setErrors({ general: data.message || 'Registration failed' });
        }

    } catch (err) {
        console.error('Error:', err);
        setErrors({ general: 'Network error. Please try again.' });
    }

    setLoading(false);
};
    return (
        <>
            <div className='main-wrapper'>
                <div className={"loginContainer"}>
                    <img className='logo' src={logo} alt='Logo'/>
                    <h2 className='logotext'>Aralytics</h2>
                    <h3 className='logoDes'>Learning Platform</h3>
                    
                    <form onSubmit={handleSubmit} className={"form"}>
                        {/* First Name */}
                        <InputComponent
                            type="text"
                            name="firstName"
                            label="First Name"
                            placeholder="Enter your First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                        />

                        {/* Last Name */}
                        <InputComponent
                            type="text"
                            name="lastName"
                            label="Last Name"
                            placeholder="Enter your Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                        />

                        {/* Email */}
                        <InputComponent
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        {/* Password */}
                        <InputComponent
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        {/* Confirm Password */}
                        <InputComponent
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />

                        {/* Error Message */}
                        {errors.general && (
                            <p style={{ color: 'red', fontSize: '14px', margin: '10px 0' }}>
                                {errors.general}
                            </p>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <p style={{ color: 'green', fontSize: '14px', margin: '10px 0' }}>
                                {successMessage}
                            </p>
                        )}
        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={"button"}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p>Already have an account? <span onClick={tryNavigate}>Login </span></p>
                </div>
            </div>
        </>
    )
}