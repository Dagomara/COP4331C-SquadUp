import React from 'react';
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';

export default function Navbar(props) {
    let activeOrNot = (pg) => {
        return props.page == pg ? "nav-link active" : "nav-link";
    }
    return(
        <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion p-0 navbar-background">
            <div class="container-fluid d-flex flex-column p-0"><a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0">
                    <div class="sidebar-brand-icon"><img class="img-fluid" src={BrandIcon} alt="SquadUP Logo" /></div>
                    <div class="sidebar-brand-text mx-3"><span class="span-test"><img class="img-fluid" src={BrandText} /></span></div>
                </a>
                <hr class="sidebar-divider my-0" />
                <ul class="navbar-nav text-light" id="accordionSidebar">
                    <li class="nav-item"><a class={activeOrNot("profile")} href="/profile"><i class="fas fa-user"></i><span>My Profile</span></a></li>
                    <li class="nav-item"><a class={activeOrNot("queue")} href="/queue"><i class="fas fa-tachometer-alt"></i><span>Queue</span></a></li>
                    <li class="nav-item"><a class={activeOrNot("friends")} href="/friends"><i class="fas fa-table"></i><span>Friends</span></a></li>
                    <li class="nav-item"><a class={activeOrNot("settings")} href="/settings"><i class="far fa-user-circle"></i><span>Settings</span></a></li>
                </ul>
                <div class="align-bottom sidebar-profile"><img class="img-fluid rounded-circle" src={props.avatarURL} 
                                onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}} />
                <span>{props.username}</span></div>
            </div>
        </nav>
    );
};