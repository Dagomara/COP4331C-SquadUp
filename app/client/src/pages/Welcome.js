import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from "axios";
import { withRouter } from "react-router-dom";
import BrandIcon from '../assets/img/SquadUp Logo with gradient.png';
import BrandText from '../assets/img/SquadUP Text Only.png';
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
import WelcomeForm from '../components/WelcomeForm';
import TestForm from '../components/TestForm';
const port = require("../config.json").PORT;


//axios.method('url', data(if needed), {withCredentials: true})

class Welcome extends React.Component {
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
            formStep: 0
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
                console.log("res2.data: ", res2.data);
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
        <body className='splash' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          <div className="container" id="splashContainer">
              <div className="card shadow-lg o-hidden border-0 my-5">
                  <div className="card-body p-0 scroll-fit">
                    <TestForm />
                    {/* <WelcomeForm username={this.state.username} avatarURL={this.state.avatarURL} tag={this.state.tag}/> */}
                  </div>
              </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/theme.js"></script>
        </body>
      );
    }
}

export default Welcome;
