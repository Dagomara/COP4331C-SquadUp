import React from 'react';

export default function BlockedRow(props) {

    return(
        <div class="row blockedRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} /><span>{props.blocked.name}<br /></span></div>
            <div class="col-auto align-self-center btn btn-primary fw-bold bg-gradient-danger"><span class="blocked">&nbsp;{props.blocked.status}</span></div>
        </div>
    );
};

