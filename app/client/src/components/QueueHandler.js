import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';

import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
    LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
   serverRoot = HEROKU_ROOT_SERVER;
}
else {
   serverRoot = LOCALHOST_ROOT_SERVER;
}

const socket = openSocket(serverRoot);

function sendSocketIO() {
  socket.emit('example_message', 'demo');
}

var names = []; // todo: implememnt a Players object-of-objects {id1: {name, avatar, isOwner}, id2: {...}}

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

  // socket playings
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  // For each discordId in `ids`, will make a "dictionary" of avatarURLs. 
  // Meant for the initial joining of a queue.
  const makeAvatars = (ids) => {
    let urls = {};
    ids.forEach(e => {
      console.log("Getting e's information...", e);
      // make axios request for e's avatarURL
      let temp = {};
      temp[e] = "placeholder image text";
      urls = {...urls, ...temp}
      names[e] = ("Craig #"+e);
    });
    setAvatars(urls);
  }

  // Establish sockets.io handling. 
  useEffect(() => {
    console.log("Connecting to serverRoot: ", serverRoot);
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });
    
    // Server response when we've been squadded up with other users. 
    socket.on("queue-request-response", (payload) => {
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
    socket.on("queue-join-announcement", payload => {
      console.log("Player joined! ", payload);
      setUsers([...users, payload.discordId]);
      let newAvatarObject = {};
      newAvatarObject[payload.discordId] = payload.avatar;
      setAvatars({...avatars, ...newAvatarObject}); // add player's avatar to the game!
      setPlayersNeeded(payload.players_needed);
    });

    // Server response when the owner quits out of waiting queue. 
    socket.on('queue-abandon-announcement', payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Queue was abandoned by owner!");
        setQueueStatus("abandoned");
      }
    });

    // Server response when other players quit out of waiting queue. 
    socket.on("queue-leave-announcement", payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Player left! ", payload);
        delete avatars[payload.discordId];
        setAvatars(avatars);
        setUsers(payload.players);
        setPlayersNeeded(payload.players_needed);
      }
    });
    
    // Server response when anyone presses quit on a playing game. 
    socket.on("queue-quit-announcement", payload => {
      if (queueStatus == "playing" && payload.queueId == queueId) {
        console.log("Player left current match! Quitting: ", payload);
        setQueueStatus("quit");
      }
    });

    // Server response when queue owner decided to start up the game!
    socket.on("queue-play-announcement", payload => {
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Let's play! ", payload);
        setQueueStatus("playing");
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      socket.off('queue-request-response');
      socket.off('queue-join-announcement')
      socket.off('queue-abandon-announcement')
      socket.off('queue-leave-announcement')
      socket.off('queue-quit-announcement')
      socket.off('queue-play-announcement')
    };
  }, []); // array makes sure this component only renders ONCE. 

  const sendQR = () => {
    console.log("Sending queue request with ", qrrPayload);
    socket.emit("queue-request", qrrPayload);
  }

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
                <button onClick={sendQR}>Send queue request!</button>
              </div>
            )}
            {queueStatus=="waiting" && ( // in a match & waiting to start
              <div>
                <p className='online'>Got a response! Waiting to start...</p>
                {()=>{
                  console.log("users: ", users);
                  return users.map(id => {return (
                    <div className='row'>
                      <img src={avatars[id]} alt={`avatar of ${id}`} />
                      <p>Player with ID {id} and name {names[id]}</p>
                    </div>
                  )})
                }}
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