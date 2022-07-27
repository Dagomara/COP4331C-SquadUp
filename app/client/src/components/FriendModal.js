import React from "react";
import '../assets/stylesheets/modal.css';

function FriendModal(props) {
  let setFriendModal = props.setFriendModal; 
    return (
      <div className="modalBackground text-white">
        <div className="modalContainer">
        <div className="modalContainer2">
          <div className="titleCloseBtn">
            <button onClick={() => { setFriendModal(false);  }}> X </button>
          </div>
          <div className="title">
            <div className="title-border">
            <img className="img-fluid rounded-circle" src={props.avatarURL} /><span>{props.username}</span><span class="online"><i class="fas fa-circle"></i>&nbsp;{props.friend.status}</span>
            </div>
          </div>
          <div className="body">
          <div className="body-border">
            <p>Your friends games will appear here.</p>
          </div>
          </div>
          <div className="footer">
            <button onClick={() => { setFriendModal(false);  }}>Remove Friend</button>
            <button onClick={() => { setFriendModal(false);  }}>Block</button>
          </div>
        </div>
        </div>
      </div>
    );
  }
  
  export default FriendModal;