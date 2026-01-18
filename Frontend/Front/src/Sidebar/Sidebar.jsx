import './Sidebar.css';

export default function Sidebar({className}) {
    
    return(
        <div className={`parent-sidebar ${className || ''}`}>
            <button>click 1</button>
            <button>click 2</button>
            <button>click 3</button>
            <button>click 4</button>
            <button>click 5</button>
            <button>click 6</button>
        </div>
    )
}