import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';
import PlayerResultRow from './PlayerResultRow';

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
  let [squadText, setSquadText] = useState("SOMEONE's Squad");
  let [queueId, setQueueId] = useState(0);
  let [ownerId, setOwnerId] = useState(""); // who owns the match? 
  let [queueStatus, setQueueStatus] = useState("queueing");
  let [mostRecentPayload, setMostRecentPayload] = useState({}); // for bugtesting 
  let [players, setPlayers] = useState({[discordId]: {
    avatar: `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`,
    isOwner: false, name: username
  }}); // for fellow player infos

  // For testing zone's "Next stage test" button. 
  const advanceQueueStatus = () => {
    if (queueStatus == "queueing") {
      queueStatus = "enqueued";
      setQueueStatus(queueStatus);
    }
    else if (queueStatus == "enqueued") {
      queueStatus = "waiting";
      setQueueStatus(queueStatus);
    }
    else if (queueStatus == "waiting") {
      queueStatus = "playing";
      setQueueStatus(queueStatus);
    }
    else if (queueStatus == "playing") {
      queueStatus = "quit";
      setQueueStatus(queueStatus);
    }
  }

  // Sets one player's information and updates the state of `players`. 
  const setPlayer = (id, stuff) => {
    // If player did not exist already, make them!
    if (!players[id]) {
      console.log("setPlayer: filling info!");
      players[id] = {
        avatar: stuff.avatar,
        isOwner: stuff.isOwner,
        name: stuff.name
      }
    }
    else {
      console.log("setPlayer: player is old!");
      // prioritize new information, but fallback to existing.
      // This doesn't work as expected, so establishOwner() exists. 
      let av = (stuff.avatar) ? stuff.avatar : players[id].avatar;
      let own = (stuff.isOwner) ? stuff.isOwner : players[id].isOwner;
      let nam = (stuff.name) ? stuff.name : players[id].name;
      let updatedPlayer = {avatar: av, isOwner: own, name: nam};
      console.log(`Updating ${id}: `, updatedPlayer);
      players[id] = updatedPlayer;
    }
    setPlayers(players); // to cause rerenders throughout component
    console.log("setPlayer: new players obj: ", players);
  }

  // Deletes a player ands updates the state of `players`. 
  const delPlayer = (id) => {
    console.log(`delPlayer: deleting ${players[id].name}!`);
    delete players[id];
    setPlayers(players);
    console.log("delPlayer: see the changes! ", players);
  }

  // Sets up all owner stuff given just an ownerId. 
  const establishOwner = (id) => {
    setOwnerId(id);
    setPlayer(id, {isOwner: true, avatar: players[id].avatar, name: players[id].name})
  }

  // socket playings
  let [isConnected, setIsConnected] = useState(socket.connected);
  let [lastPong, setLastPong] = useState(null);

  // For each discordId in `ids`, will make a "dictionary" of avatarURLs. 
  // Meant for the initial joining of a queue.
  const makePlayers = async (ids, owner) => {
    for await (const id of ids) {
      console.log(`Getting ${id}'s information...`);
      // make axios request for id's avatarURL and username
      let av = undefined; // avatar
      let na = undefined // name
      await axios.post(`${serverRoot}/api/getSmallProfile`, {discordID: id})
      .then(res => {
        console.log("res.data: ", res.data, "and name: ", res.data.username);
        av = `https://cdn.discordapp.com/avatars/${id}/${res.data.avatar}.png`;
        na = res.data.username;
      }).catch((err)=>{
        console.log(err);
      });
      setPlayer(id, {name: na, avatar: av, isOwner: (id == owner)});
      if (id == owner)
        setSquadText(`${na}'s Squad`);
      console.log(`Finished placing ${id}'s information.`)
    }
    setOwnerId(owner);
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
      if (queueStatus == "enqueueing" && payload.discordId == discordId) queueStatus = "queueing";
      console.log("received a queue request response for queueId", payload.queueId);
      console.log("queueStatus: ", queueStatus);
      if (queueStatus == "queueing" && payload.discordId == discordId) {
        console.log("Joining game! ", payload);
        setUsers(payload.players);
        setPlayersNeeded(payload.players_needed);
        setQueueId(payload.queueId);
        console.log("queueId: ", queueId, "payload queueId: ", payload.queueId);
        makePlayers(payload.players, payload.ownerId); // set up avatar URLs and usernames
        //establishOwner(payload.ownerId);
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
          name: payload.username, avatar: payload.discordAvatar, isOwner: false
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
        goBack();
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
  }, [queueStatus, queueId]); // only rebuild event listeners on these changes

  const queueRequest = (e) => {
    queueStatus = "enqueueing";
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
    goBack();
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
            <div class="card-header d-flex align-items-center">
              <img src={props.gameIcon} 
                className="img-fluid gameIconHeader"/>
              <h6 className="fs-4 fw-bold m-0">{props.gameName}</h6>
            </div>
            <div class="card-body">
              {queueStatus=="queueing" && ( // after queue req first sent
                <div>
                  <h2 className='text-white text-center'>
                    Does this look good? 
                  </h2>
                  <div className="row splash-option text-black" >
                    <div className="col-sm-5 col-md-4 text-start align-self-center">
                      <p className="w-100 text-capitalize">Players Needed</p>
                    </div>
                    <div className="col">
                        <p>{qrrPayload.players_needed}</p>
                    </div>
                  </div>
                  {(() => {
                    if (qrrPayload.filters != undefined && Object.keys(qrrPayload.filters).length > 0) {
                        return (
                        Object.keys(qrrPayload.filters).map((filt, index) => {
                          let typing = typeof qrrPayload.filters[filt];
                          if (typing === 'object') typing = 1; // array
                          else if (typing === 'boolean') typing = 2;
                          else typing = 3; // string, others will just be written
                          return (
                            <div className="row splash-option text-black" >
                              <div className="col-sm-5 col-md-4 text-start align-self-center">
                                <p className="w-100 text-capitalize">{filt}</p>
                              </div>
                              <div className="col">
                                {(typing == 1) && (
                                  <p>{qrrPayload.filters[filt].join(", ")}</p>
                                )}
                                {(typing == 2) && (
                                  <p>{(qrrPayload.filters[filt]) ? "Yes" : "No"}</p>
                                )}
                                {(typing >= 3) && (
                                  <p>{qrrPayload.filters[filt]}</p>
                                )}
                              </div>
                            </div>
                        )}));
                    }
                    else {
                        return (<p class="away">Loading Friends...</p>);
                    }
                  })()}
                  <p className="text-small text-center away mt-4">Beta Warning: Matched players will only loosely meet these requirements, due to a smaller playerbase. </p>
                  <div class="row mt-4">
                    <div class="col">
                      <button class="btn btn-primary fw-bold bg-gradient-danger" onClick={goBack} type="button">&lt;&nbsp;Back to Options</button>
                    </div>
                    <div class="col text-end">
                      <button class="btn btn-primary bg-gradient-primary" type="submit" onClick={queueRequest}>SquadUP!</button>
                    </div>  
                  </div>
                </div>
              )}
              {queueStatus=="enqueued" && (<p className="away">Looking for game...</p>)}
              {queueStatus=="waiting" && ( // in a match & waiting to start
                <div>
                  <h2 className='text-white text-center'>
                    {squadText}
                  </h2>
                  {(()=>{
                    console.log("users: ", users);
                    console.log("ownerId: ", ownerId);
                    let iconProps = 'img-fluid rounded-circle queue-icon';

                    return Object.keys(players).map(id => {return (
                      <div className='row queue-player text-white'>
                        <div className='col sm-2 text-center align-self-center'>
                          <img 
                            className={ownerId == id ? iconProps+' owner-icon' : iconProps}
                            src={players[id].avatar} 
                              onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}}
                            alt={`avatar of ${id}`}
                          />
                        </div>
                        <div className='col sm-5 align-self-center'>
                          <p>{players[id].name}</p>
                        </div>
                      </div>
                    );});
                  })()}
                  <div className='row'>
                    <div class="col text-start align-self-center">
                      <button class="btn btn-primary fw-bold bg-gradient-danger" onClick={leaveRequest} type="button">&lt;&nbsp;Leave Squad</button>
                    </div>
                    <div className='col align-self-center'>
                      <p className='online'>
                        Finding more players... {Object.keys(players).length}/{playersNeeded}
                      </p>
                    </div>
                    {(ownerId == discordId) && (<div class="col text-end align-self-center">
                      <button class="btn btn-primary bg-gradient-primary" type="submit" onClick={playRequest}>Ready UP!</button>
                    </div>)}
                    {(ownerId != discordId) && (<div class="col text-end align-self-center">
                      <p className='text-white'>Waiting for host to begin...</p>
                    </div>)}
                  </div>
                </div>
              )}
              {queueStatus=="playing" && ( // Playing with the group!
                <div>
                  <h2 className='text-white text-center'>
                    {squadText}
                  </h2>
                  {(()=>{
                    console.log("users: ", users);
                    console.log("ownerId: ", ownerId);
                    let iconProps = 'img-fluid rounded-circle queue-icon';
                    return Object.keys(players).map(id => {return (
                      <div className='row queue-player text-white'>
                        <div className='col sm-2 text-center align-self-center'>
                          <img 
                            className={ownerId == id ? iconProps+' owner-icon' : iconProps}
                            src={players[id].avatar}
                              onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}} 
                            alt={`avatar of ${id}`}
                          />
                        </div>
                        <div className='col sm-5 align-self-center'>
                          <p>{players[id].name}</p>
                        </div>
                      </div>
                    );});
                  })()}
                  <div className='row'>
                    <div class="col text-center">
                      <button class="btn btn-primary fw-bold bg-gradient-danger" onClick={quitRequest} type="button">Quit Match</button>
                    </div>
                  </div>
                </div>
              )}
              {queueStatus=="quit" && ( // Match has been quit :) 
                <div>
                  <h2 className='text-white text-center'>
                    {squadText}
                  </h2>
                  <p className='away'>Game over! How was it?</p>
                  {(() => {
                    console.log("Object.keys(players): ", Object.keys(players));
                    // Display an options row for each player who joined. 
                    return (
                      Object.keys(players).map((id, index) => {
                        return (
                            <PlayerResultRow
                              myId={discordId}
                              otherId={id}
                              obj={players[id]}
                              serverRoot={serverRoot} />
                        )
                    }));
                  })()}
                  <div className='row'>
                    <div class="col text-start">
                      <button class="btn btn-primary fw-bold bg-gradient-danger" onClick={goBack} type="button">&lt;&nbsp;Make New Squad</button>
                    </div>
                  </div>
                </div>
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
                <button onClick={(e) => {
                  advanceQueueStatus(); e.preventDefault();
                }}>Next stage test</button>
              </div>
            </div>
            {(queueStatus == "queueing") && (<div>
              <pre className='text-white'>{JSON.stringify(qrrPayload, null, 2)}</pre>
              <button onClick={goBack}>Back to Options</button>
              <button onClick={queueRequest}>Send queue request!</button>
            </div>)}
          </div>
        </div>
      </div>)}
    </div>
  )
}