import logo from '../../../../public/logo.jpg';
import './Signup.css'
import InputComponent from '../../InputComponent/InputComponent';
import { useState } from 'react';

export default function SignUp() {
    const [formData, setFormData] = useState({ email: '', password: '' });
        const [errors, setErrors] = useState({});
        const [loading, setLoading] = useState(false);
    
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
    
            try {

            if (formData.email && formData.password) {
            } else {
                setErrors({ general: 'Invalid credentials' });
            }
            } catch (err) {
            setErrors({ general: 'Login failed' });
            }
            setLoading(false);
        };


    return(
        <>
            <div className='main-wrapper'>
                        <div className={"loginContainer"}>
                        <img className='logo' src={logo} alt='Logo'/>
                        <h2 className='logotext'>Aralytics</h2>
                        <h3 className='logoDes'>Learning Platform</h3>
                        <form onSubmit={handleSubmit} className={"form"}>

                            <InputComponent
                            type="text"
                            name="text"
                            label="text"
                            placeholder="Enter your First Name"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            />

                            <InputComponent
                            type="text"
                            name="text"
                            label="text"
                            placeholder="Enter your Last Name"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            />


                            <InputComponent
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            />

                            <InputComponent
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            />

                            <InputComponent
                            type="text"
                            name="text"
                            label="text"
                            placeholder="Confirm your Password"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            />

                            {errors.general && <p className={styles.error}>{errors.general}</p>}
            
                            <button type="submit" disabled={loading} className={"button"}>
                            {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p><a href="/forgot-password">Forgot Password?</a></p>
                        <p>Don't have an account? <a href="/signup">Sign up</a></p>
                        </div>
                </div>
        
        </>
    )
}