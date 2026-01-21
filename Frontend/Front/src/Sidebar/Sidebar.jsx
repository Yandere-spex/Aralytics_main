import './Sidebar.css';
import logo from '../../public/logo.jpg'


export default function Sidebar({className}) {
    
    return(
        <div className={`parent-sidebar ${className || ''}`}>

            <img alt='Aralytics logo' src={logo} className='sidebarLogo'/>
            <h3>Eren S Yeager</h3>



            <button className='navBtn'>
                Home <i class="fa-regular fa-house"></i>
            </button>

            <button className='navBtn'>
                Read <i class="fa-brands fa-readme"></i>
            </button>

            <button className='navBtn'>
                Recommendation <i class="fa-regular fa-lightbulb"></i> 
            </button>

            <button className='navBtn logoutBtn'>
                Log out <i class="fa-solid fa-door-open"></i>
            </button>
        </div>
    )
}