import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from "axios";
import { withRouter } from "react-router-dom";
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
const port = require("../config.json").PORT;


//axios.method('url', data(if needed), {withCredentials: true})

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined,
            tag: undefined,
            gender: undefined,
            school: undefined,
            status: "offline",
            games: undefined
        };
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`http://localhost:${port}/auth/getUserData`, {withCredentials: true})
      .then(async res => {
        console.log("res" + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`,
            tag: res.data.tag,
            status: "online",
            games: []
          });
          await axios.post(`http://localhost:${port}/api/viewProfile`, {discordID: this.state.discordId})
        .then(res2 => {
            if (res2.data) {
                console.log("res.data: ", res2.data);
                this.setState({
                    games: res2.data.games,
                    gender: res2.data.gender,
                    school: res2.data.school,
                });
                console.log("updated state w/ new games: ", this.state);
            }
        })
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
        <div className='Profile' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
              <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="friends"/>
              <div class="d-flex flex-column" id="content-wrapper">
                  <div id="content">
                      <div class="non-semantic-protector">
                          <div class="container mb-4 topbar static-top">
                              <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">Recent Friends</strong></em></h1>
                          </div>
                          <div class="container-fluid">
                              <div class="row justify-content-center">
                                  <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                      <div class="card shadow mb-4">
                                          <div class="card-header d-flex justify-content-between align-items-center">
                                              <h6 class="fs-4 fw-bold m-0">Friends</h6>
                                          </div>
                                          <div class="card-body">
                                              <div class="row gameRow">
                                                  <div class="col-lg-3"><img class="img-fluid rounded-circle gameIcon" src="assets/img/avatars/avatar3.jpeg" /></div>
                                                  <div class="col align-self-center">
                                                      <p class="gameName">Team Fortress 2</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
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

export default Profile;


{/* <p>queue screen</p>
            <strong>
              Hey {this.state.username}, welcome to Queue!
            </strong>
            <img src={this.state.avatarURL}></img>
            <button onClick={this.doLogout}>
                Log out
            </button> */}