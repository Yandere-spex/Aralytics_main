import './MainLay.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../Sidebar/Sidebar';
import Dashboard from '../../../dynamicContent/Dashboard/Dashboard.jsx';
import ClassesPage from '../../Pages/Classes/ClassesPage.jsx';
import MenuButton from '../../MenuButton/MenuButton.jsx';
import SelectedCard from '../../../dynamicContent/Read/SelectedCard/SelectedCard.jsx';
import AlphabetGrid from '../../../dynamicContent/AlphabetGrid/AlphabetGrid.jsx';

export default function MainLayout() {
    const { user, loading, error, fetchUserData } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState('Home');
    const [activeMenu, setActiveMenu] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate]);
    
    const handleDataFromSidebar = (data) => {
        setActive(data);
    };

    const conditionalRender = () => {
        switch (active) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Read':
                return <SelectedCard menuOption={activeMenu} />;
            case 'Alphabet':
                return <AlphabetGrid />;
            case 'Classespage':
                return <ClassesPage />;
            default:
                return <Dashboard />;
        }
    };

    const handleDataFromMenu = (data) => {
        console.log(`MainLayout: Received data: ${data}`);
        setActiveMenu(data);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <div className="error-icon">⚠️</div>
                <h2>Connection Error</h2>
                <p>{error}</p>
                <button onClick={fetchUserData} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="parent-grid">
            <Sidebar
                className={'div1'}
                data={handleDataFromSidebar}
            />
            <div className='div2'>
                {conditionalRender()}
            </div>
            {active === 'Read' && (
                <MenuButton className={'div3'} data={handleDataFromMenu} />
            )}
        </div>
    );
}