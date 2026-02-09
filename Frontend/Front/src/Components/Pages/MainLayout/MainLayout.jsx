import './MainLay.css';
import Sidebar from '../../../Sidebar/Sidebar';
import Home from '../../../dynamicContent/Home/Home.jsx';
import Read from '../../../dynamicContent/Read/Read.jsx';
import Recommendation from '../../../dynamicContent/Recommendation/Recommendation.jsx';
import { useState } from 'react';
import MenuButton from '../../MenuButton/MenuButton.jsx';
import Favourite from '../../../dynamicContent/Favourite/Favourite.jsx';
import SelectedCard from '../../../dynamicContent/Read/SelectedCard/SelectedCard.jsx';

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
            return <Read menuOption={activeMenu}/>;

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
                {/* {conditionalRender()} */}
                <SelectedCard/>
            </div>

            {active === 'Read' && <MenuButton className={'div3'} data={handleDataFromMenu} />}

        </div>
    )
}