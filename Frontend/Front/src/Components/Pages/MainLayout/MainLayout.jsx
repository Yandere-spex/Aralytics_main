import './MainLay.css';
import { useState } from 'react';
import Sidebar from '../../../Sidebar/Sidebar';
import Home from '../../../dynamicContent/Home/Home.jsx';
import Recommendation from '../../../dynamicContent/Recommendation/Recommendation.jsx';
import MenuButton from '../../MenuButton/MenuButton.jsx';
import Favourite from '../../../dynamicContent/Favourite/Favourite.jsx';
import SelectedCard from '../../../dynamicContent/Read/SelectedCard/SelectedCard.jsx';
import ResultScreen from '../../ResultScreen/ResultScreen.jsx';

export default function MainLayout(){

    const [active, setActive] = useState('');

    const handleDataFromSidebar = (data) =>{
        setActive(data)
    }

    const conditionalRender = () => {
    switch (active) {
        case 'Home':
            return <Home />;

        case 'Read':
            return <SelectedCard menuOption={activeMenu}/>;

        case 'Recommendation':
            return <Recommendation />;

        case 'Favourite':
            return <Favourite />;

        case 'Logout':
            return <div>Logged out!</div>;
        default:
            return <Home/>;
    }
};

    const [activeMenu, setActiveMenu] = useState('');

    const handleDataFromMenu = (data) =>{
        console.log(`MainLayout: Received data: ${data}`);
        setActiveMenu(data)
    }

    


    return(
        <div className="parent-grid">
            <Sidebar className={'div1'} data={handleDataFromSidebar}/>

            <div className='div2'>
                {conditionalRender()}
                {/* <ResultScreen/> */}
            </div>

            {active === 'Read' && <MenuButton className={'div3'} data={handleDataFromMenu} />}

        </div>
    )
}