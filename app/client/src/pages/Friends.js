import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import FriendRow from '../components/FriendRow';
import FriendModal from '../components/FriendModal';
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

class Friends extends React.Component {
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
            friendIDs: undefined,
            friends: {},
            loginRedirect: false,
            modalFriend: false,
            selectedFriend: undefined,
            chosenGames: []
        };
        // const [friendsList, setFriendsList] = React.useState([]);
        this.setModalFriend = (val) => {
          this.setState({
            modalFriend: val
          }); 
        }

        // remove friend call
        this.removeFriend = async (id) => {
          await axios.post(`${serverRoot}/api/deleteFriend`, {discordID: this.state.discordId, friends: id})
          .then(res => {
              console.log("Friend Removed ", res.status);
              window.location.reload(false);
              return true;
          })
          .catch((err)=>{console.log("deleteFriend Error!\n", err)});
          return false;
        }

        // block player/friend call
        this.blockFriend = async (id) => {
          await axios.post(`${serverRoot}/api/addBlocked`, {discordID: this.state.discordId, blocked: id})
          .then(res => {
              console.log("Friend Blocked", res.status);
              window.location.reload(false);
              return true;
          })
          .catch((err)=>{console.log("blockFriend Error!\n", err)});
          return false;
        }

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
          // Also just do normal state updates
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`,
            tag: res.data.tag,
            status: "online",
            friendIDs: [],
            friends: {},
            blockedfriends: []
          });

          await axios.post(`${serverRoot}/api/viewFriends`, {discordID: this.state.discordId})
          .then(res2 => {
            if (res2.data) {
              console.log("viewFriends data: ", res2.data);
              this.state.friendIDs = res2.data
              this.setState({friendIDs: res2.data}); // stability addition
            }
          })
          .then(async () => {
            console.log(this.state.friendIDs);
            this.state.friendIDs.forEach(async (id) => {
              await axios.post(`${serverRoot}/api/viewProfile`, {discordID: id})
              .then(res2 => {
                  if (res2.data) {
                      console.log("res2.data: ", res2.data);
                      let newDude = {};
                      newDude[id] = {
                        name: res2.data.username,
                        avatar: `https://cdn.discordapp.com/avatars/${id}/${res2.data.avatar}.png`,
                        status: res2.data.status,
                        id: id
                      };
                      let newFriends = Object.assign(this.state.friends, newDude);
                      this.state.friends = newFriends; // I hate this
                      this.setState({
                        friends: newFriends
                      });
                      console.log("updated state w/ new friends: ", this.state.friends);
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

    render = () => {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )

      return (
        <div className='Profile' id='page-top'>
          {this.state.modalFriend && (<FriendModal
            setFriendModal={this.setModalFriend}
            friend={this.state.selectedFriend}
            removeFriend={this.removeFriend}
            blockFriend={this.blockFriend}
            serverRoot={serverRoot}
            games={this.state.chosenGames}
          />)}
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            {!this.state.modalFriend && (
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
                                            {(() => {
                                              if (this.state.friends != undefined && Object.keys(this.state.friends).length > 0) {
                                                  return (
                                                  Object.keys(this.state.friends).map((id, index) => {
                                                    console.log("id: ", id, "friend data: ", this.state.friends[id]);
                                                  return (
                                                    <FriendRow friend={ this.state.friends[id] } onClick={async (e) => {
                                                        await axios.post(`${serverRoot}/api/viewProfile`, {discordID: id})
                                                        .then(res => {
                                                          if (res.data) {
                                                            console.log("clicked friend's res.data: ", res.data);
                                                            this.setState({chosenGames: res.data.games});
                                                          }
                                                        })
                                                        this.setState({modalFriend: true});
                                                        this.setState({selectedFriend: this.state.friends[id]});
                                                        e.preventDefault();
                                                      }}/>
                                                  )}));
                                              }
                                              else {
                                                  return (<p class="away">Loading Friends...</p>);
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
            </div>)}
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Friends;