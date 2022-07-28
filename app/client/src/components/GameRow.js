import React from 'react';
import {findImg, getName} from '../assets/js/gameIcons';

export default function GameRow(props) {
    return(
        <div class="row gameRow" id={getName(props.gameID)} onClick={event => (props.onClick(event, {
            name: getName(props.gameID),
            icon: findImg(props.gameID)
        }))}>
            <div class="col-lg-3"><img class="img-fluid gameIcon" src={findImg(props.gameID)} /></div>
            <div class="col align-self-center">
                <p class="gameName">{getName(props.gameID)}</p>
            </div>
        </div>
    );
};