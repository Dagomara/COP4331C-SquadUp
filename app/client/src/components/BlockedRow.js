import React from 'react';

export default function BlockedRow(props) {
    return(
        <div class="row friendRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} /><span>{props.blocked.name}<br /></span></div>
            <div class="col-auto align-self-center"><button class="btn btn-primary fw-bold bg-gradient-danger" type="button"><span>Unblock Player</span></button></div>
        </div>
    );
};

