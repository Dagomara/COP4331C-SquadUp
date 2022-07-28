import React, { useEffect, useState } from "react";
import '../assets/stylesheets/modal.css';
import GameRow from './GameRow';
import axios from 'axios';

function FriendModal(props) {
  let setFriendModal = props.setFriendModal; 
  let games = props.games;
  let { name, avatar, status } = props.friend;
  const removeThisGuy = () => {
      props.removeFriend(props.friend.id);
  }
  const blockThisGuy = () => {
    props.blockFriend(props.friend.id);
  }

  // Upon opening this friendModal, grab this person's games!

  return (
    <div className="modalBackground text-white">
      <div className="friend-modalContainer">
      <div className="friend-modalContainer2">
        <div className="titleCloseBtn">
          <button className="text-white" onClick={() => { setFriendModal(false);  }}> X </button>
        </div>
        <div className="title-friend">
          <div className="title-border row">
            <div className="col sm-1 md-2 modal-friend-image">
              <img className="img-modal rounded-circle" src={avatar} 
                onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}}
              />
            </div>
            <div className="col align-self-center">
              <span className="friend-name">{name}</span><br/>
              <span className={status}><i class="fas fa-circle"></i>&nbsp;{status}</span>
            </div>
          </div>
        </div>
        <div className="body">
        <div className="body-border-friend">
          {(() => {
            if (games != undefined && games.length > 0) {
                return (
                games.map((game, index) => {
                  console.log("game: ", game);
                return (
                  <GameRow gameID={game.gameID} />
                )}));
            }
            else {
                return (<p class="away">Your friend's games will appear here.</p>);
            }
          })()}
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