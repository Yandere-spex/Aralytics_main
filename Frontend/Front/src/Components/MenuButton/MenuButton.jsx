import './MenuButton.css';

export default function MenuButton({ className, data}){

    
    function handleClicked(event) {
        const dataFromEvent = event.currentTarget.id;
        console.log(`Menu: Clicked button id:  ${event.currentTarget.id}` );
        
        data(dataFromEvent); 
    }



    return(
        <>
            <div className={`mainMenuBtn ${className || ''}`}>
                <button  className='menuBtn' id='Easy' onClick={handleClicked}>     Easy</button>
                <button  className='menuBtn' id='Medium' onClick={handleClicked}>   Medium</button>
                <button  className='menuBtn' id='Hard' onClick={handleClicked}>     Hard</button>
            </div>
        </>
    )
}