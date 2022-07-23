import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Modal from './components/Modal';

function App() {
    //manages the show value in modal.js... false is default
    const [show, setShow] = useState(false)

    // line 16: makes the show value true which then shows the modal
    // line 17: makes the show value false which then closes the modal
    return (
        <div>
            <Navigation />
            <HomePage />
            <button onClick={() => setShow(true) }>Show Modal</button>
            <Modal title="DiscordUsername" onClose={() => setShow(false)} show={show}>
                <p>Are you sure you want to delete your account?</p>
            </Modal>
        </div>
    )
}

export default App;