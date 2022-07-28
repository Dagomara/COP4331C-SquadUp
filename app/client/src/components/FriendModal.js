import React from "react";
import '../assets/stylesheets/modal.css';

function FriendModal(props) {
  let setFriendModal = props.setFriendModal; 
  let { name, avatar, status } = props.friend;
  const removeThisGuy = () => {
      props.removeFriend(props.friend.id);
  }
  const blockThisGuy = () => {
    props.blockFriend(props.friend.id);
  }
    return (
    <div className="modalBackground text-white">
      <div className="friend-modalContainer">
      <div className="friend-modalContainer2">
        <div className="titleCloseBtn">
          <button className="text-white" onClick={() => { setFriendModal(false);  }}> X </button>
        </div>
        <div className="title-friend">
          <div className="title-border">
          <img className="img-modal rounded-circle" src={avatar} 
            onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}}></img>
          <span className="friend-name">&nbsp;&nbsp;{name}</span><br/>
          <span className="online"><i class="fas fa-circle"></i>&nbsp;{status}</span>
          </div>
        </div>
        <div className="body">
        <div className="body-border">
          <p>Your friends games will appear here.</p>
        </div>
        </div>
        <div className="footer">
          <button onClick={removeThisGuy}
            >Remove Friend</button>
          <button onClick={blockThisGuy}
            >Block</button>
        </div>
      </div>
      </div>
    </div>
    );
  }
  
  export default FriendModal;