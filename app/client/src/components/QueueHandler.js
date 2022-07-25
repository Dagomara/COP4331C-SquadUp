import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';

import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
    LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
   serverRoot = HEROKU_ROOT_SERVER;
}
else {
   serverRoot = LOCALHOST_ROOT_SERVER;
}

// QueueHandlers handle all socket.io connections! Upon creation,
// they fire a queue-request to the websocket.
export default function QueueHandler(props) {
  const {discordId, avatar, username, qrrPayload, goBack} = props;
  const gameId = qrrPayload.gameId;
  console.log("gameId: ", gameId);
  const [users, setUsers] = useState([]); // players in match with you
  const [avatars, setAvatars] = useState({}); // their avatars, arranged {plyaerId: discordUrl}
  const [playersNeeded, setPlayersNeeded] = useState(0);
  const [queueId, setQueueId] = useState(0);
  const [ownerId, setOwnerId] = useState(""); // who owns the match? 
  const [queueStatus, setQueueStatus] = useState("queueing");
  const socket = useRef(null);

  // For each discordId in `ids`, will make a "dictionary" of avatarURLs. 
  const makeAvatars = (ids) => {
    let urls = {};
    ids.forEach(e => {
      // make axios request for e's avatarURL
      let temp = {};
      temp[e] = "placeholder image text";
      urls = {...urls, ...temp}
    });
    setAvatars(urls);
  }

  // Establish sockets.io handling. 
  useEffect(() => {
    console.log("Connecting to serverRoot: ", serverRoot);
    socket.current = io(serverRoot, { autoConnect: false });

    // Server response when we've been squadded up with other users. 
    socket.current.on("queue-request-response", payload => {
      console.log("Joining game! ", payload);
      if (queueStatus == "queueing" && payload.discordId == discordId) {
        setUsers(payload.players);
        setPlayersNeeded(payload.setPlayersNeeded);
        setQueueId(payload.queueId);
        setOwnerId(payload.ownerId);
        makeAvatars(payload.players); // set up avatar URLs
        console.log("Established all joining variables and setting status to waiting...");

        setQueueStatus("waiting");
      }
    });

    // Server response when a player joins queue. 
    socket.current.on("queue-join-announcement", payload => {
      console.log("Player joined! ", payload);
      setUsers([...users, payload.discordId]);
      let newAvatarObject = {};
      newAvatarObject[payload.discordId] = payload.avatar;
      setAvatars({...avatars, ...newAvatarObject}); // add player's avatar to the game!
      setPlayersNeeded(payload.players_needed);
    });

    // Server response when the owner quits out of waiting queue. 
    socket.current.on('queue-abandon-announcement', payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Queue was abandoned by owner!");
        setQueueStatus("abandoned");
      }
    });

    // Server response when other players quit out of waiting queue. 
    socket.current.on("queue-leave-announcement", payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Player left! ", payload);
        delete avatars[payload.discordId];
        setAvatars(avatars);
        setUsers(payload.players);
        setPlayersNeeded(payload.players_needed);
      }
    });
    
    // Server response when anyone presses quit on a playing game. 
    socket.current.on("queue-quit-announcement", payload => {
      if (queueStatus == "playing" && payload.queueId == queueId) {
        console.log("Player left current match! Quitting: ", payload);
        setQueueStatus("quit");
      }
    });

    // Server response when queue owner decided to start up the game!
    socket.current.on("queue-play-announcement", payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Let's play! ", payload);
        setQueueStatus("playing");
      }
    });
  }, [serverRoot]); // array makes sure this component only renders ONCE. 

  return (
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
        <div class="card shadow mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="fs-4 fw-bold m-0">Select A Game</h6>
          </div>
          <div class="card-body">
            {queueStatus=="queueing" && ( // after queue req first sent
              <div>
                <button onClick={goBack}>Back to Options</button>
                <p className="away">Looking for game...</p>
                <pre className='text-white'>{JSON.stringify(qrrPayload, null, 2)}</pre>
                <button onClick={(e) => {
                  setQueueStatus("waiting"); e.preventDefault();
                }}>Next stage test</button>
                <button onClick={(e) => {
                  socket.current.emit("queue-request", qrrPayload);
                  console.log("Sent queue request with ", qrrPayload);
                  e.preventDefault();
                }}>Send queue request!</button>
              </div>
            )}
            {queueStatus=="waiting" && ( // in a match & waiting to start
              <div>
                <p className='online'>Got a response! Waiting to start...</p>
                <button onClick={(e) => {
                  setQueueStatus("playing"); e.preventDefault();
                }}>Next stage test</button>
              </div>
            )}
            {queueStatus=="playing" && ( // Playing with the group!
              <div>
                <p className='online'>You're now in-game :)</p>
                <button onClick={(e) => {
                  setQueueStatus("quit"); e.preventDefault();
                }}>Next stage test</button>
              </div>
            )}
            {queueStatus=="quit" && ( // Match has been quit :) 
              <p className='away'>Game over! How was it?</p>
            )}
          </div>
        </div>
      </div>
  </div>
  )
}