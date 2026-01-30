import './ReadCard.css';
import { useState } from 'react';

export default function ReadCard({cover, Title, onClick}){


    return(
        <div className='readCardContainer'>
            <img className='coverReadCard' src={cover}/>
            
            <div> 
                <h4>{Title}</h4>

                <div className='forDifficultAndHeart'> 
                    <span className='textMode'> Difficulty Easy</span>
                    <span> <i className="fa-regular fa-heart"></i></span>
                </div>

            </div>
            <button className='readBtn' onClick={onClick}>Start Your Journey</button>

        </div>
    )
}