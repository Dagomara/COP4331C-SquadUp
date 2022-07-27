import React from "react";
import '../assets/stylesheets/deletemodal.css';

function FriendModal(props) {
  let setFriendModal = props.setFriendModal; 
    return (
      <div className="modalBackground">
        <div className="modalContainer">
        <div className="modalContainer2">
          <div className="titleCloseBtn">
            <button onClick={() => { setFriendModal(false);  }}> X </button>
          </div>
          <div className="title">
            <div className="title-border">
            <h1>Discord Username with Avatar</h1>
            </div>
          </div>
          <div className="body">
          <div className="body-border">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          </div>
          </div>
          <div className="footer">
            <button onClick={() => { setFriendModal(false);  }} id="cancelBtn">No</button>
            <button onClick={() => { setFriendModal(false);  }}>Yes</button>
          </div>
        </div>
        </div>
      </div>
    );
  }
  
  export default FriendModal;