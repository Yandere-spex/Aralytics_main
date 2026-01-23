import './Sidebar.css';
import logo from '../../public/logo.jpg'
import { useState } from 'react';

export default function Sidebar({ className, clicked }) {


    function handleClicked(e) {
        clicked(e.target.id);
        
        
    }

    
    return(
        <div className={`parent-sidebar ${className || ''}`}>

            <img alt='Aralytics logo' src={logo} className='sidebarLogo'/>
            <h3>Eren S Yeager</h3>

            <button className='navBtn' onClick={handleClicked} id='Home'>
                Home <i class="fa-regular fa-house"></i>
            </button>

            <button className='navBtn' onClick={handleClicked} id='Read'>
                Read <i class="fa-brands fa-readme"></i>
            </button>

            <button className='navBtn' onClick={handleClicked} id='Recommendation'>
                Recommendation <i class="fa-regular fa-lightbulb"></i> 
            </button>

            <button className='navBtn logoutBtn'onClick={handleClicked} id='Logout'>
                Log out <i class="fa-solid fa-door-open"></i>
            </button>
        </div>
    )

}