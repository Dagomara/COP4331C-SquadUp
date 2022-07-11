import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

function Queue() {
    //const [cPage, setCPage] = useState('');
    
    //setCPage("Queue");
    return (
        <div className='Queue'>
            <p>queue screen</p>
            <Sidebar />
        </div>
    );
}

export default Queue();