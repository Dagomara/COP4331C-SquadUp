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
  let [users, setUsers] = useState([]); // players in match with you
  let [avatars, setAvatars] = useState({}); // their avatars, arranged {plyaerId: discordUrl}
  let [playersNeeded, setPlayersNeeded] = useState(0);
  let [queueId, setQueueId] = useState(0);
  let [ownerId, setOwnerId] = useState(""); // who owns the match? 
  let [queueStatus, setQueueStatus] = useState("queueing");
  let [mostRecentPayload, setMostRecentPayload] = useState({}); // for bugtesting 
  let [players, setPlayers] = useState({discordId: {
    avatar: `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`,
    isOwner: false, name: username
  }}); // for fellow player infos
  const setPlayer = (id, stuff) => {
    // prioritize new information, but fallback to existing.
    let av = stuff.avatar || players[id].avatar;
    let own = stuff.isOwner || players[id].isOwner;
    let name = stuff.name || players[id].name;
    let updatedPlayer = {avatar: av, isOwner: own, name: name};
    console.log(`Updating ${id}: `, updatedPlayer);
    players[id] = updatedPlayer;
    setPlayers(players); // to cause rerenders throughout component
  }
  const delPlayer = (id) => {
    delete players[id];
  }


  // socket playings
  let [isConnected, setIsConnected] = useState(socket.connected);
  let [lastPong, setLastPong] = useState(null);

  // For each discordId in `ids`, will make a "dictionary" of avatarURLs. 
  // Meant for the initial joining of a queue.
  const makePlayers = async (ids) => {
    let urls = {};
    ids.forEach(async id => {
      console.log(`Getting ${id}'s information...`);
      // make axios request for id's avatarURL and username
      let av = undefined; // avatar
      let na = undefined // name
      await axios.post(`${serverRoot}/auth/getSmallProfile`, {withCredentials: true})
      .then(res => {
        console.log("res.data: " + res.data);
        av = res.data.avatar;
        na = res.data.name;
      }).catch((err)=>{
        console.log(err);
      });
      setPlayer(id, {name: na, avatar: av});
      console.log(`Finished placing ${id}'s information.`)
    });
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
      console.log("received a queue request response for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      if (queueStatus == "queueing" && payload.discordId == discordId) {
        console.log("Joining game! ", payload);
        setUsers(payload.players);
        setPlayersNeeded(payload.players_needed);
        setQueueId(payload.queueId);
        console.log("queueId: ", queueId, "payload queueId: ", payload.queueId);
        setOwnerId(payload.ownerId);
        makePlayers(payload.players); // set up avatar URLs and usernames
        setPlayer(payload.ownerId, {isOwner: true})
        console.log("Established all joining variables and setting status to waiting...");

        setMostRecentPayload(payload);
        setQueueStatus("waiting");
      }
    });

    // Server response when a player joins queue. 
    socket.on("queue-join-announcement", payload => {
      console.log("received a queue join announcement for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      console.log("queueId: ", queueId, "equal? ", (payload.queueId == queueId ? "yes" : "no"));
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Player joined! ", payload);
        // Make this guy renderable in the DOM 
        setPlayer(payload.discordId, {
          name: payload.username || "DUDE", avatar: payload.avatar, isOwner: false
        });
        setPlayersNeeded(payload.players_needed);
        console.log("new player should be visible :)");
      }
    });

    // Server response when the owner quits out of waiting queue. 
    socket.on('queue-abandon-announcement', payload => {
      console.log("received a queue abandon announcement for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Queue was abandoned by owner!");
        setMostRecentPayload(payload);
        setQueueStatus("abandoned");
      }
    });

    // Server response when other players quit out of waiting queue. 
    socket.on("queue-leave-announcement", payload => {
      console.log("received a queue leave announcement for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Player left! ", payload);
        delPlayer(payload.discordId);
        setPlayersNeeded(payload.players_needed);
      }
    });
    
    // Server response when anyone presses quit on a playing game. 
    socket.on("queue-quit-announcement", payload => {
      console.log("received a quit abandon announcement for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      if (queueStatus == "playing" && payload.queueId == queueId) {
        console.log("Player left current match! Quitting: ", payload);
        setMostRecentPayload(payload);
        setQueueStatus("quit");
      }
    });

    // Server response when queue owner decided to start up the game!
    socket.on("queue-play-announcement", payload => {
      console.log("received a queue play announcement for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      console.log("queueId: ", queueId, "equal? ", (payload.queueId == queueId ? "yes" : "no"));
      if (queueStatus == "waiting" && payload.queueId == queueId) {
        console.log("Let's play! ", payload);
        setMostRecentPayload(payload);
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

  const queueRequest = (e) => {
    console.log("Sending queue request with ", qrrPayload);
    socket.emit("queue-request", qrrPayload);
    e.preventDefault();
  }
  const leaveRequest = (e) => {
    let payload = {
      queueId: queueId,
      discordId: discordId,
      ownerId: ownerId
    };
    console.log("Sending leave request with ", payload);
    socket.emit("queue-leave-request", payload);
    e.preventDefault();
  };
  const playRequest = (e) => {
    let payload = {
      queueId: queueId,
      discordId: discordId,
      ownerId: ownerId
    };
    console.log("Sending play request with ", payload);
    socket.emit("queue-play-request", payload);
    e.preventDefault();
  };
  const quitRequest = (e) => {
    let payload = {
      queueId: queueId,
      discordId: discordId,
      ownerId: ownerId
    };
    console.log("Sending quit request with ", payload);
    socket.emit("queue-quit-request", payload);
    e.preventDefault();
  };

  return (
    <div>
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
                  <button onClick={queueRequest}>Send queue request!</button>
                </div>
              )}
              {queueStatus=="waiting" && ( // in a match & waiting to start
                <div>
                  <p className='online'>Got a response! Waiting to start...</p>
                  {(()=>{
                    console.log("users: ", users);
                    return users.map(id => {return (
                      <div className='row'>
                        <img src={avatars[id]} alt={`avatar of ${id}`} />
                        <p>Player with ID {id} and name {names[id]}</p>
                      </div>
                    )})
                  })()}
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
      {(process.env.NODE_ENV != "production") && (
        <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
          <div class="card shadow mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="fs-4 fw-bold m-0">Testing Zone</h6>
            </div>
            <div class="card-body">
              <div className='row'>
                <h5 className='text-white'>Most recent payload:</h5>
                <pre className='text-white'>{JSON.stringify(mostRecentPayload, null, 2)}</pre>
              </div>
              <div className='row'>
                <button onClick={leaveRequest}>Try leaving the queue</button>
                <button onClick={playRequest}>Try playing the queue</button>
                <button onClick={quitRequest}>Try quitting the queue</button>
              </div>
            </div>
          </div>
        </div>
      </div>)}
    </div>
  )
}