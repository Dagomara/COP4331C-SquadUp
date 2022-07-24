import React, { useState, useEffect } from 'react';
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
const socket = io(serverRoot);

// QueueHandlers handle all socket.io connections! Upon creation,
// they fire a queue-request to the websocket.
export default function QueueHandler(props) {
  const {discordId, avatar, username, qrrPayload} = props;
  const [users, setUsers] = useState([]); // players in match with you
  const [queueStatus, setQueueStatus] = useState("queueing");

  useEffect(() => {
    socket.on("queue-request-response", payload => {
      console.log("response garnered! ", payload);
    });
  });

  return (
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
        <div class="card shadow mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="fs-4 fw-bold m-0">Select A Game</h6>
          </div>
          <div class="card-body">
            {queueStatus=="queueing" && (
              <div>
                <p className="away">Looking for game...</p>
                <button onClick={(e) => {
                  setQueueStatus("waiting"); e.preventDefault();
                }}>Next stage test</button>
              </div>
            )}
            {queueStatus=="waiting" && (
              <div>
                <p className='online'>Got a response! Waiting to start...</p>
                <button onClick={(e) => {
                  setQueueStatus("playing"); e.preventDefault();
                }}>Next stage test</button>
              </div>
            )}
            {queueStatus=="playing" && (
              <div>
                <p className='online'>You're now in-game :)</p>
                <button onClick={(e) => {
                  setQueueStatus("quit"); e.preventDefault();
                }}>Next stage test</button>
              </div>
            )}
            {queueStatus=="quit" && (
              <p className='away'>Game over! How was it?</p>
            )}
          </div>
        </div>
      </div>
  </div>
  )
}