import React from 'react';

export default function BlockedRow(props) {
    console.log("props.blocked: ", props.blocked)
    const unblockThisGuy = () => {
        props.unblockPlayer(props.blocked.id);
    }
    return(
        <div class="row friendRow">
            <div class="col-auto align-self-center"><img class="img-fluid rounded-circle friendIcon" src={props.blocked.avatar} 
                onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}}/>
            <span>{props.blocked.name}<br /></span></div>
            <div className="col-auto align-self-center text-end">
                <button className="btn block-button btn-primary fw-bold bg-gradient-danger" type="button" onClick={unblockThisGuy}>
                    <span>Unblock Player</span>
                </button>
            </div>
        </div>
    );
};