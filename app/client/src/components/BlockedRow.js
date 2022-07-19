import React from 'react';

export default function BlockedRow(props) {

    return(
        <div class="row blockedRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} /><span>{props.blocked.name}<br /></span></div>
            <div class="col-auto align-self-center friendStatus"><span class="online"><i class="fas fa-circle"></i>&nbsp;{props.blocked.status}</span></div>
        </div>
    );
};

