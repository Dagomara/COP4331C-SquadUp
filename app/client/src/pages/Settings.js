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

class Settings extends React.Component {
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
        <div className='Profile' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
            <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="profile"/>
            <div className="d-flex flex-column" id="content-wrapper">
                <div id="content">
                <div className="non-semantic-protector">
                    <div className="container mb-4 topbar static-top">
                    <h1 className="ribbon"><em><strong className="text-uppercase fw-bolder ribbon-content">My Settings</strong></em></h1>
                    </div>
                    <div className="container-fluid">
                    <div className="row mb-3">
                        <div className="col-lg-4">
                        <div className="card mb-3">
                            <div className="card-body text-center shadow"><img className="rounded-circle mb-3 mt-4" src="assets/img/avatars/avatar3.jpeg" width={160} height={160} />
                            <div>
                                <p className="profile-username"><span>@</span>{this.state.username}<span>#1234</span></p>
                                <p className="profile-subheading">{this.state.school || "No School"}, {this.state.gender || "No Gender"}<br /></p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="col-lg-8">
                        <div className="row mb-3 d-none">
                            <div className="col">
                            <div className="card text-white bg-primary shadow">
                                <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col">
                                    <p className="m-0">Peformance</p>
                                    <p className="m-0"><strong>65.2%</strong></p>
                                    </div>
                                    <div className="col-auto"><i className="fas fa-rocket fa-2x" /></div>
                                </div>
                                <p className="text-white-50 small m-0"><i className="fas fa-arrow-up" />&nbsp;5% since last month</p>
                                </div>
                            </div>
                            </div>
                            <div className="col">
                            <div className="card text-white bg-success shadow">
                                <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col">
                                    <p className="m-0">Peformance</p>
                                    <p className="m-0"><strong>65.2%</strong></p>
                                    </div>
                                    <div className="col-auto"><i className="fas fa-rocket fa-2x" /></div>
                                </div>
                                <p className="text-white-50 small m-0"><i className="fas fa-arrow-up" />&nbsp;5% since last month</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                <p className="m-0 fw-bold">User Settings</p>
                                </div>
                                <div className="card-body">
                                <form>
                                    <div className="row">
                                    <div className="col">
                                        <div className="mb-3"><label className="form-label" htmlFor="username"><strong>Username</strong></label><input className="form-control" type="text" id="username" placeholder={this.state.username} name="username" /></div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-3"><label className="form-label" htmlFor="tag"><strong>Tag</strong></label><input className="form-control" type="email" id="tag" placeholder={this.state.tag} name="emailtag" /></div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="col">
                                        <div className="mb-3"><label className="form-label" htmlFor="school"><strong>School</strong></label><select className="form-select" name="school">
                                            <option value={1} selected>{this.state.school}</option>
                                            <option value={2}>Female</option>
                                            <option value={3}>Other</option>
                                        </select></div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-3"><label className="form-label" htmlFor="gender"><strong>Gender</strong></label><select className="form-select" name="gender">
                                            <option value={1} selected>Male</option>
                                            <option value={2}>Female</option>
                                            <option value={3}>Other</option>
                                        </select></div>
                                    </div>
                                    </div>
                                    <div className="mb-3"><button className="btn btn-primary btn-sm bg-gradient-primary" type="submit">Save Settings</button></div>
                                </form>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                <p className="m-0 fw-bold">See Blocked Users</p>
                                </div>
                                <div className="card-body"><button className="btn btn-danger" type="button" onClick={(e) => {e.preventDefault(); window.location.href='/blocked';}}>See Blocked Users</button></div>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <p>Paragraph</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                <p className="m-0 fw-bold">Delete Account</p>
                                </div>
                                <div className="card-body"><button className="btn btn-danger" type="button">DELETE ACCOUNT</button></div>
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

export default Settings;