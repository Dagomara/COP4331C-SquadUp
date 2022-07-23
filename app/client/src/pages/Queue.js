import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
     LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
    serverRoot = HEROKU_ROOT_SERVER;
}
else {
    serverRoot = LOCALHOST_ROOT_SERVER;
}
const clientId = CLIENT_ID;


//axios.method('url', data(if needed), {withCredentials: true})

class Queue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined,
            games: undefined,
            loginRedirect: false
        };
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`${serverRoot}/auth/getUserData`, {withCredentials: true})
      .then(async res => {
        console.log("res.data.login: " + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`,
            games: undefined
          });
          await axios.post(`${serverRoot}/api/viewProfile`, {discordID: res.data.discordId})
          .then(res2 => {
              if (res2.data) {
                  console.log("res2.data: ", res2.data);
                  this.setState({
                      games: res2.data.games
                  });
                  console.log("updated state w/ new games: ", this.state);
              }
          })
        }
        else {
          // Redirect to login page if user was not logged in!
          this.setState({loginRedirect: true});
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    doLogout = async (e) => {
      e.preventDefault();
      await axios.get(`${serverRoot}/auth/logout`, {withCredentials: true})
      .then(res => {
        if (!res.data.login) {
          console.log("logout success!");
          this.setState({loginRedirect: true});
        }
        else
          console.log("something unpoggers happened!");
      })
      .catch((err)=>{
        console.log(err);
      });
    };

    render() {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )

      return (
        <div className='Queue' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          <div id="wrapper">
            <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="queue"/>
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