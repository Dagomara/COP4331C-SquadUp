import React from 'react';

export default function FriendRow(props) {
    console.log("FriendRow for ", props)
    return(
        <div class="row friendRow" onClick={props.onClick}>
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.friend.avatar} /><span>{props.friend.name}<br /></span></div>
            <div class="col-auto align-self-center friendStatus"><span class="online"><i class="fas fa-circle"></i>&nbsp;{props.friend.status}</span></div>
        </div>
    );
};

