import './MainLay.css';
import Sidebar from '../../../Sidebar/Sidebar';
import Home from '../../../dynamicContent/Home/Home.jsx';
import Read from '../../../dynamicContent/Read/Read.jsx';
import Recommendation from '../../../dynamicContent/Recommendation/Recommendation.jsx';
import { useState } from 'react';
import MenuButton from '../../MenuButton/MenuButton.jsx';

export default function MainLayout(){

    const [active, setActive] = useState('');

    const handleDataFromSidebar = (data) =>{

        console.log(`MainLayout: Received data: ${data}`);
        setActive(data)

    }

    const conditionalRender = () => {
    switch (active) {
        case 'Home':
            return <Home />;

        case 'Read':
            return <Read />;

        case 'Recommendation':
            return <Recommendation />;

        case 'Logout':
            return <div>Logged out!</div>;
        default:
            return <Home/>;
    }
};
    

    return(
        <div className="parent-grid">
            <Sidebar className={'div1'} data={handleDataFromSidebar}/>

            <div className='div2'>
                {conditionalRender()}
            </div>

            {active === 'Read' && <MenuButton className={'div3'} />}

        </div>
    )
}