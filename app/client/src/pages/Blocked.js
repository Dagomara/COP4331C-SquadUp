import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import BlockedRow from '../components/BlockedRow';
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
            blocked: [],
            loginRedirect: false,
            newBlocked: {}
        };

        this.unblockPlayer = async (blockedId) => {
          await axios.post(`${serverRoot}/api/deleteBlocked`, { discordID: this.state.discordId, blocked: blockedId})
          .then(res => {
              console.log("unblocked player: ", res.status);
              window.location.reload(false);
              return true;
          })
          .catch((err)=>{console.log("deleteBlocked Error!\n", err)});
          return false;
        };

        this.addTestDummies = async () => {
          await axios.post(`${serverRoot}/api/addBlocked`, { discordID: this.state.discordId, blocked: "280827046685573122"})
          .then((res) => {
            console.log("Added dummy account 1!");
          });
          await axios.post(`${serverRoot}/api/addBlocked`, { discordID: this.state.discordId, blocked: "155082013987045376"})
          .then((res) => {
            console.log("Added dummy account 2!");
          });
          window.location.reload(false);
        };
      }
      

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`${serverRoot}/auth/getUserData`, {withCredentials: true})
      .then(async res => {
        console.log("res" + res.data.login);
        if(res.data.login) {
          // make sure discordId doesn't stall on setState (viewFriends issues)
          this.state.discordId = res.data.discordId
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

          await axios.post(`${serverRoot}/api/viewBlocked`, {discordID: this.state.discordId})
          .then(res2 => {
            if (res2.data) {
              console.log("viewBlocked data: ", res2.data);
              this.state.blockedIDs = res2.data;
              this.setState({blockedIDs: res2.data}); // stability addition
            }
          })
          .then(async () => {
            console.log(this.state.blockedIDs);
            this.state.blockedIDs.forEach(async (id) => {
              await axios.post(`${serverRoot}/api/viewProfile`, {discordID: id})
              .then(res2 => {
                  if (res2.data) {
                      console.log("res2.data: ", res2.data);
                      let newDude = {[id]: {
                        name: res2.data.username,
                        avatar: `https://cdn.discordapp.com/avatars/${id}/${res2.data.avatar}.png`,
                        status: res2.data.status,
                        id: id
                      }}
                      let newBlocked = Object.assign(this.state.newBlocked, newDude);
                      this.state.newBlocked = newBlocked; // I hate this still
                      this.setState({ newBlocked: newBlocked }); // sketchy naming
                      console.log("updated state w/ new blocked players: ", this.state.newBlocked);
                  }
              })
              .catch((err)=>{
                console.log(err);
              });
          });

          });

        }
        else {
          // Redirect to login page if user was not logged in!
          this.setState({loginRedirect: true});
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    render() {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )

      return (
        <div className='Profile' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
              <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="settings"/>
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
                                        if (this.state.newBlocked != undefined && Object.keys(this.state.newBlocked).length > 0) {
                                          return (
                                            Object.keys(this.state.newBlocked).map((b, index) => (
                                            <BlockedRow blocked={ this.state.newBlocked[b] } 
                                              unblockPlayer={this.unblockPlayer}/>
                                          )));
                                        }
                                        else {
                                            return (<p class="away">Loading blocked players...</p>);
                                        }
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {(process.env.NODE_ENV != "production") && (
                              <div class="row justify-content-center">
                                <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                  <div class="card shadow mb-4">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                      <h6 class="fs-4 fw-bold m-0">Testing Zone</h6>
                                    </div>
                                    <div class="card-body">
                                      <button onClick={this.addTestDummies}>Add some testing figures</button>
                                    </div>
                                  </div>
                                </div>
                              </div>)}
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