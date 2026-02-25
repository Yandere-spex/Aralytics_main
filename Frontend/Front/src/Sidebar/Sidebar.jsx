import './Sidebar.css';
import logo from '../../src/assets/imageCover/logo.jpg';
import { useAuth } from '../context/AuthContext.jsx';
import LogoutModal from '../Components/Logout/LogoutModal.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ className, data }) {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    function handleClicked(event) {
        const dataFromEvent = event.currentTarget.id;
        
        if (dataFromEvent === 'Logout') {
            setShowLogoutModal(true); 
            return;
        }
        data(dataFromEvent); 
    }

    const handleLogoutConfirm = async () => {
        setShowLogoutModal(false);
        await logout();
        navigate('/login', { replace: true });
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    // Show loading state while fetching user
    if (loading) {
        return (
            <div className={`parent-sidebar ${className || ''}`}>
                <img alt='Aralytics logo' src={logo} className='sidebarLogo' />
                <p>Loading...</p>
            </div>
        );
    }

    // If no user, show placeholder
    if (!user) {
        return (
            <div className={`parent-sidebar ${className || ''}`}>
                <img alt='Aralytics logo' src={logo} className='sidebarLogo' />
                <p>Please log in</p>
            </div>
        );
    }

    return (
        <>
            <div className={`parent-sidebar ${className || ''}`}>
                <img alt='Aralytics logo' src={logo} className='sidebarLogo' />
                
                {/* User info - safely access properties */}
                <div className="user-profile">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className="user-email">{user.email}</p>
                </div>

                <button className='navBtn' onClick={handleClicked} id='Dashboard'>
                    Dashboard <i className="fa-regular fa-house"></i>
                </button>

                <button className='navBtn' onClick={handleClicked} id='Read'>
                    Read <i className="fa-brands fa-readme"></i>
                </button>

                <button className='navBtn' onClick={handleClicked} id='Alphabet'>
                    Alphabet <i className="fa-solid fa-a"></i>
                </button>

                <button className='navBtn' onClick={handleClicked} id='Recommendation'>
                    Recommendation <i className="fa-regular fa-lightbulb"></i>
                </button>

                <button className='navBtn' onClick={handleClicked} id='Favourite'>
                    Favourite <i className="fa-regular fa-heart"></i>
                </button>

                <button className='navBtn logoutBtn' onClick={handleClicked} id='Logout'>
                    Log out <i className="fa-solid fa-door-open"></i>
                </button>
            </div>

            <LogoutModal 
                isOpen={showLogoutModal}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                userName={user?.firstName || 'User'}
            />
        </>
    );
}