// Since game icons have to be imported, it's easiest to just have one file do all the work!
import TFIcon from '../games/1.png';
import ValIcon from '../games/2.png';
import LeagueIcon from '../games/3.png';
import RLIcon from '../games/4.png';
import MogusIcon from '../games/5.png';
import OWIcon from '../games/6.png';
import ApexIcon from '../games/7.png';

const gameNames = [
    "Team Fortress 2",
    "Valorant",
    "League of Legends",
    "Rocket League",
    "Among Us",
    "Overwatch",
    "Apex Legends"
];
const gameIcons = [
    TFIcon,
    ValIcon,
    LeagueIcon,
    RLIcon,
    MogusIcon,
    OWIcon,
    ApexIcon
];

// Now, with just a gameID, you can get the name and image representing that game!
export function findImg(id) {
    return gameIcons[id-1];
}
export function getName(id) {
    return gameNames[id-1];
}