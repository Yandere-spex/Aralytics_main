import './Signup.css';
import logo from '../../../../src/assets/imageCover/aralytics_Cover.jpg';
import InputComponent from '../../InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',           // ← new field
    });
    const [errors, setErrors]           = useState({});
    const [loading, setLoading]         = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName:       formData.firstName,
                    lastName:        formData.lastName,
                    email:           formData.email,
                    password:        formData.password,
                    confirmPassword: formData.confirmPassword,
                    role:            formData.role,     // ← send role to backend
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Registration successful! Redirecting...');
                login(data.data.user, data.data.token);

                setTimeout(() => {
                    // Redirect based on role
                    if (data.data.user.role === 'teacher') {
                        navigate('/teacher', { replace: true });
                    } else {
                        navigate('/Mainlayout', { replace: true });
                    }
                }, 1500);
            } else {
                setErrors({ general: data.message || 'Registration failed' });
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
                    <InputComponent type="text"     name="firstName"       label="First Name"       placeholder="Enter your First Name"       value={formData.firstName}       onChange={handleChange} error={errors.firstName} />
                    <InputComponent type="text"     name="lastName"        label="Last Name"         placeholder="Enter your Last Name"        value={formData.lastName}        onChange={handleChange} error={errors.lastName} />
                    <InputComponent type="email"    name="email"           label="Email"             placeholder="Enter your email"            value={formData.email}           onChange={handleChange} error={errors.email} />
                    <InputComponent type="password" name="password"        label="Password"          placeholder="Enter your password"         value={formData.password}        onChange={handleChange} error={errors.password} />
                    <InputComponent type="password" name="confirmPassword" label="Confirm Password"  placeholder="Confirm your Password"       value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

                    {/* Role selector — new */}
                    <div className="role-selector">
                        <label className="role-label">I am a:</label>
                        <div className="role-options">
                            <label className={`role-option ${formData.role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                <i className="fa-solid fa-user-graduate"></i>
                                <span>Student</span>
                            </label>
                            <label className={`role-option ${formData.role === 'teacher' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={formData.role === 'teacher'}
                                    onChange={handleChange}
                                />
                                <i className="fa-solid fa-chalkboard-teacher"></i>
                                <span>Teacher</span>
                            </label>
                        </div>
                    </div>

                    {errors.general    && <p style={{ color: 'red',   fontSize: '14px', margin: '10px 0' }}>{errors.general}</p>}
                    {successMessage    && <p style={{ color: 'green', fontSize: '14px', margin: '10px 0' }}>{successMessage}</p>}

                    <button type="submit" disabled={loading} className="button">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
            </div>
        </div>
    );
}