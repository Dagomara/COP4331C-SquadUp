import React from 'react';

export default function BlockedRow(props) {
    console.log("props.blocked: ", props.blocked)
    const unblockThisGuy = () => {
        props.unblockPlayer(props.blocked.id);
    }
    return(
        <div class="row friendRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} /><span>{props.blocked.name}<br /></span></div>
            <div class="col-auto align-self-center">
                <button class="btn btn-primary fw-bold bg-gradient-danger" type="button" onClick={unblockThisGuy}>
                    <span>Unblock Player</span>
                </button>
            </div>
        </div>
    );
};

// onClick={props.unblockPlayer(props.blocked.discordID)}