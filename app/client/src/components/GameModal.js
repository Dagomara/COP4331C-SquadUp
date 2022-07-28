import React from "react";
import '../assets/stylesheets/modal.css';
import {findImg, getName} from '../assets/js/gameIcons';

function GameModal(props) {
  let setGameModal = props.setGameModal; 
  let name = getName(props.gameID);
  console.log(props);
  return (
    <div className="modalBackground text-white">
      <div className="modalContainer">
      <div className="modalContainer2">
        <div className="titleCloseBtn">
          <button className="text-white" onClick={() => { setGameModal(false);  }}> X </button>
        </div>
        <div className="title">
          <div className="title-border">
          <img className="img-fluid rounded-circle" src={findImg(props.gameID)} /><span>lol {props.gameID}{name}</span>
          </div>
        </div>
        <div className="body">
        <div className="body-border">
          <p>Your friends games will appear here.</p>
        </div>
        </div>
        <div className="footer">
          <button onClick={() => { setGameModal(false);  }}>Cancel Changes</button>
          <button onClick={() => { setGameModal(false);  }}>Save Changes</button>
        </div>
      </div>
      </div>
    </div>
  );
}
  
  export default GameModal;