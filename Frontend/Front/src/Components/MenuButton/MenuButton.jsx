import './MenuButton.css';

export default function MenuButton({ className }){
    return(
        <>
            <div className={`mainMenuBtn ${className || ''}`}>

                <button  className='menuBtn'>Easy</button>
                <button  className='menuBtn'>Medium</button>
                <button  className='menuBtn'>Hard</button>
                <button  className='menuBtn'>Very Hard</button>
            
            </div>
        </>
    )
}