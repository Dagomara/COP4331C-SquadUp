import React from "react";
import './Modal.css';

// handles show/hide modal
const Modal = props => {
    //if (!props.show) {
    //    return null
    //}

    // lines 13: similar to the close button
    // line 14: allows anything clicked outside the modal to close the modal
    return (
        <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>  
                <div className="modal-header">
                    <h4 className="modal-title">{props.title}</h4>
                </div>
                <div className="modal-body">{props.children}</div>
                <div className="modal-footer">
                    <button onClick={props.onClose} className="button">Yes</button>
                    <button onClick={props.onClose} className="button">No</button>
                </div>
            </div>
        </div>
    )
}

export default Modal