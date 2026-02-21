import './MainLay.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../Sidebar/Sidebar';
import Home from '../../../dynamicContent/Home/Home.jsx';
import Recommendation from '../../../dynamicContent/Recommendation/Recommendation.jsx';
import MenuButton from '../../MenuButton/MenuButton.jsx';
import Favourite from '../../../dynamicContent/Favourite/Favourite.jsx';
import SelectedCard from '../../../dynamicContent/Read/SelectedCard/SelectedCard.jsx';
import AlphabetGrid from '../../../dynamicContent/AlphabetGrid/AlphabetGrid.jsx';

export default function MainLayout() {
    const { user, loading, error, fetchUserData } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState('Home');
    const [activeMenu, setActiveMenu] = useState('');

    // ✅ Fetch user data ONLY when MainLayout mounts
    useEffect(() => {
        console.log('🚀 MainLayout mounted - fetching user data');
        fetchUserData();
    }, [fetchUserData]); // Runs once when component mounts

    // Redirect if no user after loading completes
    // useEffect(() => {
    //     if (!loading && !user) {
    //         console.log('No user found, redirecting to login...');
    //         navigate('/login', { replace: true });
    //     }
    // }, [user, loading, navigate]);

    const handleDataFromSidebar = (data) => {
        setActive(data);
    };

    const conditionalRender = () => {
        switch (active) {
            case 'Home':
                return <Home />;
            case 'Read':
                return <SelectedCard menuOption={activeMenu} />;
            // case 'Alphabet':
            //     return <AlphabetGrid />;
            case 'Recommendation':
                return <Recommendation />;
            case 'Favourite':
                return <Favourite />;
            default:
                return <Home />;
        }
    };

    const handleDataFromMenu = (data) => {
        console.log(`MainLayout: Received data: ${data}`);
        setActiveMenu(data);
    };

    // Show loading while fetching
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    // Show error with retry
    if (error) {
        return (
            <div className="error-screen">
                <div className="error-icon">⚠️</div>
                <h2>Connection Error</h2>
                <p>{error}</p>
                <button 
                    onClick={fetchUserData}
                    className="retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Don't render if no user (will redirect)
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

            {active === 'Read' && <MenuButton className={'div3'} data={handleDataFromMenu} />}
        </div>
    );
}


// // ## How It Works Now

// // 1. ✅ **App loads** → AuthProvider wraps everything (no fetch happens)
// // 2. ✅ **User logs in** → Navigate to `/dashboard`
// // 3. ✅ **MainLayout mounts** → `useEffect` runs → Calls `fetchUserData()`
// // 4. ✅ **Shows loading spinner** while fetching
// // 5. ✅ **User data loads** → Renders dashboard
// // 6. ✅ **Refresh page** → MainLayout mounts again → Fetches data again

// // ## Benefits

// // - ✅ Data fetches **only when MainLayout renders**
// // - ✅ No fetch when visiting Login/SignUp pages
// // - ✅ Fresh data every time you navigate to dashboard
// // - ✅ Clean, predictable behavior
// // - ✅ Easy to test - just refresh the page

// // ## Console Output When Testing
// ```
// // 🚀 MainLayout mounted - fetching user data
// // 🔍 Fetching user data...
// // Response status: 200
// // ✅ User data fetched: {firstName: "John", ...}
// // Loading complete