import './Sidebar.css';
import logo from '../../public/logo.jpg';


export default function Sidebar({ className, data }) {
    function handleClicked(event) {
        const dataFromEvent = event.currentTarget.id;
        console.log(`Sidebar: Clicked button id:  ${event.currentTarget.id}` );
        
        data(dataFromEvent); 
    }

    return (
        <div className={`parent-sidebar ${className || ''}`}>
            <img alt='Aralytics logo' src={logo} className='sidebarLogo' />
            <h3>Eren S Yeager</h3>

            <button className='navBtn' onClick={handleClicked} id='Home'>
                Home <i className="fa-regular fa-house"></i>
            </button>

            <button className='navBtn' onClick={handleClicked} id='Read'>
                Read <i className="fa-brands fa-readme"></i>
            </button>

            <button className='navBtn' onClick={handleClicked} id='Recommendation'>
                Recommendation <i className="fa-regular fa-lightbulb"></i>
            </button>

            <button className='navBtn' onClick={handleClicked} id='Favourite'>
                Favourite <i class="fa-regular fa-heart"></i>
            </button>

            <button className='navBtn logoutBtn' onClick={handleClicked} id='Logout'>
                Log out <i className="fa-solid fa-door-open"></i>
            </button>
        </div>
    );
}