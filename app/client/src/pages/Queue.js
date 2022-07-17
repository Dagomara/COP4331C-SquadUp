import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from "axios";
import { withRouter } from "react-router-dom";
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';
const port = require("../config.json").PORT;


//axios.method('url', data(if needed), {withCredentials: true})

class Queue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined
        };
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`http://localhost:${port}/auth/getUserData`, {withCredentials: true})
      .then(res => {
        console.log("res" + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`
          });
        }
        else {
          res.redirect("/");
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    doLogout = async (e) => {
      e.preventDefault();
      await axios.get(`http://localhost:${port}/auth/logout`, {withCredentials: true})
      .then(res => {
        if (!res.data.login) {
          console.log("logout success!");
          this.props.history.push("/");
        }
        else
          console.log("something unpoggers happened!");
      })
      .catch((err)=>{
        console.log(err);
      });
    };

    render() {
      return (
        <div className='Queue' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
        <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion p-0 navbar-background">
            <div class="container-fluid d-flex flex-column p-0"><a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
                    <div class="sidebar-brand-icon"><img class="img-fluid" src={BrandIcon} alt="SquadUP Logo" /></div>
                    <div class="sidebar-brand-text mx-3"><span class="span-test"><img class="img-fluid" src={BrandText} /></span></div>
                </a>
                <hr class="sidebar-divider my-0" />
                <ul class="navbar-nav text-light" id="accordionSidebar">
                    <li class="nav-item"><a class="nav-link" href="/profile"><i class="fas fa-user"></i><span>My Profile</span></a></li>
                    <li class="nav-item"><a class="nav-link active" href="/index"><i class="fas fa-tachometer-alt"></i><span>Queue</span></a></li>
                    <li class="nav-item"><a class="nav-link" href="/friends"><i class="fas fa-table"></i><span>Friends</span></a></li>
                    <li class="nav-item"><a class="nav-link" href="/settings"><i class="far fa-user-circle"></i><span>Settings</span></a></li>
                </ul>
                <div class="align-bottom sidebar-profile"><img class="img-fluid rounded-circle" src={this.state.avatarURL} /><span>{this.state.username}</span><a href="welcome.html"></a></div>
            </div>
        </nav>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <div class="non-semantic-protector">
                    <div class="container mb-4 topbar static-top">
                        <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">The Main Attraction</strong></em></h1>
                    </div>
                    <div class="container-fluid">
                        {/* Start: Chart */}
                        <div class="row justify-content-center">
                            <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                <div class="card shadow mb-4">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h6 class="fs-4 fw-bold m-0">Select A Game</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row gameRow">
                                            <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src="../assets/img/avatars/avatar3.jpeg" /></div>
                                            <div class="col align-self-center">
                                                <p class="gameName">League of Legends</p>
                                            </div>
                                        </div>
                                        <div class="row gameRow">
                                            <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src="../assets/img/avatars/avatar3.jpeg" /></div>
                                            <div class="col align-self-center">
                                                <p class="gameName">Team Fortress 2</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>{/* End: Chart */}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Queue;


{/* <p>queue screen</p>
            <strong>
              Hey {this.state.username}, welcome to Queue!
            </strong>
            <img src={this.state.avatarURL}></img>
            <button onClick={this.doLogout}>
                Log out
            </button> */}