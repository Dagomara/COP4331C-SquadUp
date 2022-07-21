import React from 'react';
import {findImg, getName} from '../assets/js/gameIcons';

export default function GameRow(props) {
    console.log("GameRow for ", getName(props.gameID), " at your service!");
    return(
        <div class="row gameRow" id={getName(props.gameID)}>
            <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src={findImg(props.gameID)} /></div>
            <div class="col align-self-center">
                <p class="gameName">{getName(props.gameID)}</p>
            </div>
        </div>
    );
};