import React from 'react';

export default function BlockedRow(props) {
    return(
        <div class="row friendRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} /><span>{props.blocked.name}<br /></span></div>
            <div class="col-auto align-self-center btn btn-primary fw-bold unblockButton bg-gradient-danger"><span class>Unblock User</span></div>
        </div>
    );
};

