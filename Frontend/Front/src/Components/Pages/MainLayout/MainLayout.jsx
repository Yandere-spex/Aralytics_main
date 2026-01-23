import './MainLay.css'
import Sidebar from '../../../Sidebar/Sidebar'
import { useState } from 'react'
export default function MainLayout(){

    const [active, setActive] = useState('');
    
    return(
        <div className="parent-grid">

            <Sidebar className={'div1'} click={active}/>

            <div className='div3'></div>
            <div className='div2'></div>
        
        </div>
    )
}