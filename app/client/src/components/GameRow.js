import React from 'react';
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';

export default function GameRow(props) {
    let findImg = (id) => {
        return `../assets/games/${id}.png`;
    }
    let getName = (id) => {
        let names = [
            "Team Fortress 2",
            "Valorant",
            "League of Legends",
            "Rocket League",
            "Among Us",
            "Overwatch",
            "Apex Legends"
        ]
        return names[id+1];
    }
    return(
        <div class="row gameRow">
            <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src={findImg(props.gameID)} /></div>
            <div class="col align-self-center">
                <p class="gameName">{getName(props.gameID)}</p>
            </div>
        </div>
    );
};