import React from "react";
import '../assets/stylesheets/modal.css';

function GameModal(props) {
  let setGameModal = props.setGameModal; 
    return (
      <div className="modalBackground text-white">
        <div className="modalContainer">
        <div className="modalContainer2">
          <div className="titleCloseBtn">
            <button className="text-white" onClick={() => { setGameModal(false);  }}> X </button>
          </div>
          <div className="title">
            <div className="title-border">
            <img className="img-fluid rounded-circle" src={props.avatarURL} /><span>{props.username}</span>
            </div>
          </div>
          <div className="body">
          <div className="body-border">
            <p>Your friends games will appear here.</p>
          </div>
          </div>
          <div className="footer">
            <button onClick={() => { setGameModal(false);  }}>Remove Friend</button>
            <button onClick={() => { setGameModal(false);  }}>Block</button>
          </div>
        </div>
        </div>
      </div>
    );
  }
  
  export default GameModal;