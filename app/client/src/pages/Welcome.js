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
      const completeFormStep = () => {
        this.setState({ formStep: this.state.formStep + 1 });
      }
      const backpedalFormStep = () => {
        this.setState({ formStep: this.state.formStep - 1 });
      }
      return (
        <body className='splash' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          <div className="container" id="splashContainer">
              <div className="card shadow-lg o-hidden border-0 my-5">
                  <div className="card-body p-0 scroll-fit">
                      {this.state.formStep === 0 && (<div className="p-5 splash-section">
                          <div className="text-center">
                              <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={this.state.avatarURL} style={{marginRight: '30px'}} />Welcome {this.state.username}<span style={{color: 'gray'}}>#{this.state.tag}</span>!</h1>
                          </div>
                          <hr />
                          <form className="user">
                              <div className="row mb-3">
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                      <p className="text-white">On SquadUP, you can go by any username. Is this the one you'd like to use?</p><input className="form-control form-control-user" type="text" id="exampleFirstName" placeholder={`@${this.state.username}`} name="username" />
                                  </div>
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                                      <p className="text-white">Would you like to enter your school?</p><input className="form-control form-control-user" type="text" id="exampleFirstName-1" placeholder="School" name="school" />
                                  </div>
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                                      <p className="text-white">Would you like to enter your gender?</p><select className="form-select form-control-user">
                                          <option value="12" selected="">Male</option>
                                          <option value="13">Female</option>
                                          <option value="14">Other</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="mb-3"></div>
                              <hr />
                              <div class="row">
                                <div class="col"></div>
                                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                              </div>
                          </form>
                          
                      </div>)}
                      {this.state.formStep === 1 && (<div className="p-5 splash-section">
                          <div className="text-center">
                              <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={this.state.avatarURL} style={{marginRight: '30px'}} />Welcome {this.state.username}<span style={{color: 'gray'}}>#{this.state.tag}</span>!</h1>
                          </div>
                          <hr />
                          <form className="user">
                              <div className="row mb-3">
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                      <p className="text-white">What games do you play?</p><input className="form-control form-control-user" type="text" id="exampleFirstName-4" placeholder={`@${this.state.username}`} name="username" />
                                  </div>
                              </div>
                              <div className="mb-3"></div>
                              <hr />
                              <div class="row">
                                <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
                                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                              </div>
                          </form>
                      </div>)}
                      {this.state.formStep === 2 && (<div className="p-5 splash-section">
                          <div className="text-center">
                              <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={this.state.avatarURL} style={{marginRight: '30px'}} />Welcome {this.state.username}<span style={{color: 'gray'}}>#{this.state.tag}</span>!</h1>
                          </div>
                          <hr />
                          <form className="user">
                              <div className="row mb-3">
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                      <p className="text-white" style={{marginBottom: '0px'}}>What roles do you play for each game?</p>
                                  </div>
                                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                      <p className="text-white">Team Fortress 2</p>
                                      <div className="row splash-option">
                                          <div className="col-sm-12 col-md-3 text-start align-self-center">
                                              <p className="w-100">Level</p>
                                          </div>
                                          <div className="col align-self-center"><input className="form-control" type="text" /></div>
                                      </div>
                                      <div className="row splash-option">
                                          <div className="col-sm-12 col-md-3 align-self-center">
                                              <p>Positions</p>
                                          </div>
                                          <div className="col text-start align-self-center"><input className="form-control" type="text" /></div>
                                      </div>
                                  </div>
                              </div>
                              <div className="mb-3"></div>
                              <hr />
                              <div class="row">
                                <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
                                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                              </div>
                          </form>
                      </div>)}
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
