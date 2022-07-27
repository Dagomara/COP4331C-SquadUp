import axios from 'axios';
import React from 'react';

export default function PlayerResultRow(props) {

  const blockId = async () => {
    await axios.post(`${props.serverRoot}/api/addBlocked`, {
      discordID: props.myId,
      friends: props.otherId
    })
  }
  const addId = async () => {
    await axios.post(`${props.serverRoot}/api/addFriend`, {
      discordID: props.myId,
      friends: props.otherId
    })
  }
  return(
      <div class="row gameRow" id={props.obj.name}>
          <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src={props.obj.avatar} /></div>
          <div class="col align-self-center">
              <p class="gameName">{props.obj.name}</p>
          </div>
          <div className='col text-end'>
            <button onClick={blockId} className='btn btn-primary fw-bold bg-gradient-danger'>
              Block Player
            </button>
          </div>
          <div className='col text-end'>
            <button onClick={addId} className='btn btn-primary bg-gradient-primary'>
              Add as Friend
            </button>
          </div>
      </div>
  );
};