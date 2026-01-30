import { useState } from 'react';
import './Read.css';
import ReadCard from '../../Components/ReadCard/ReadCard.jsx';
import coverLittle from '../../../public/The Little princess Cover.webp';
import coverpillar from '../../../public/The Very hungry caterpillar.webp';

export default function Read(){




    return(
        <div className='mainRead'>
                <ReadCard Title={'The Little Princess'} cover={coverLittle}/>
                <ReadCard Title={'The Very Hungry Caterpillar'} cover={coverpillar}/>
                <ReadCard Title={'The Little Princess'} cover={coverLittle}/>
                <ReadCard Title={'The Very Hungry Caterpillar'} cover={coverpillar}/>
        </div>
        
    )
}