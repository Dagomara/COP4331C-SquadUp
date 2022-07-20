import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from "axios";
import { withRouter } from "react-router-dom";
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';
import Navbar from '../components/Navbar';
import BlockedRow from '../components/BlockedRow';
const port = require("../config.json").PORT;


//axios.method('url', data(if needed), {withCredentials: true})

class Blocked extends React.Component {
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
            games: undefined,
            blockedIDs: undefined,
            blocked: []
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
            blockedIDs: undefined,
            blocked: []
          });

          await axios.post(`http://localhost:${port}/api/viewBlocked`, {discordID: this.state.discordId})
          .then(res2 => {
            if (res2.data) {
              console.log("viewBlocked data: ", res2.data);
              this.state.blockedIDs = res2.data;
            }
          })

          console.log(this.state.blockedIDs);
          this.state.blockedIDs.forEach(async (id) => {
            await axios.post(`http://localhost:${port}/api/viewProfile`, {discordID: id})
            .then(res2 => {
                if (res2.data) {
                    console.log("res2.data: ", res2.data);
                    this.setState({
                      blocked: this.state.blocked.concat([{
                        name: res2.data.username,
                        avatar: `https://cdn.discordapp.com/avatars/${id}/${res2.data.avatar}.png`,
                        status: res2.data.status
                    }])});
                    console.log("updated state w/ new blocked players: ", this.state.blocked);
                }
            })
            .catch((err)=>{
              console.log(err);
            });
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
        <div className='Profile' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
              <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="profile"/>
              <div class="d-flex flex-column" id="content-wrapper">
                  <div id="content">
                      <div class="non-semantic-protector">
                          <div class="container mb-4 topbar static-top">
                              <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">Blocked Players</strong></em></h1>
                          </div>
                          <div class="container-fluid">
                              <div class="row justify-content-center">
                                  <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                      <div class="card shadow mb-4">
                                          <div class="card-header d-flex justify-content-between align-items-center">
                                              <h6 class="fs-4 fw-bold m-0">Blocked</h6>
                                          </div>
                                          <div class="card-body">
                                            {(() => {
                                              if (this.state.blocked != undefined && this.state.blocked.length > 0) {
                                                  return (
                                                  this.state.blocked.map((b, index) => (
                                                  <BlockedRow blocked={ b } />
                                                  )));
                                              }
                                              else {
                                                  return (<p class="away">No Blocked Players. Cool!</p>);
                                              }
                                            })()}
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

export default Blocked;