import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
const port = process.env.PORT || 3001;
const urlRoot = process.env.URL_ROOT || "http://localhost:";


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
      await axios.get(`${urlRoot}${port}/auth/getUserData`, {withCredentials: true})
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
            games: undefined
          });
          await axios.post(`${urlRoot}${port}/api/viewProfile`, {discordID: this.state.discordId})
        .then(res2 => {
            if (res2.data) {
                console.log("res2.data: ", res2.data);
                this.setState({
                    gender: res2.data.gender,
                    school: res2.data.school,
                });
                this.setState({
                    games: res2.data.games
                })
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
      await axios.get(`${urlRoot}${port}/auth/logout`, {withCredentials: true})
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
                        <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">My Profile</strong></em></h1>
                    </div>
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <div class="col-lg-4">
                                <div class="card mb-3">
                                    <div class="card-body text-center shadow"><img class="rounded-circle mb-3 mt-4" src={this.state.avatarURL} width="160" height="160" />
                                        <div>
                                            <p class="profile-username"><span>@</span>{this.state.username}<span>#{this.state.tag}</span></p>
                                            <p class="profile-subheading">{this.state.school || "No School"}, {this.state.gender || "No Gender"}<br/></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="row mb-3 d-none">
                                    <div class="col">
                                        <div class="card text-white bg-primary shadow">
                                            <div class="card-body">
                                                <div class="row mb-2">
                                                    <div class="col">
                                                        <p class="m-0">Peformance</p>
                                                        <p class="m-0"><strong>65.2%</strong></p>
                                                    </div>
                                                    <div class="col-auto"><i class="fas fa-rocket fa-2x"></i></div>
                                                </div>
                                                <p class="text-white-50 small m-0"><i class="fas fa-arrow-up"></i>&nbsp;5% since last month</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="card text-white bg-success shadow">
                                            <div class="card-body">
                                                <div class="row mb-2">
                                                    <div class="col">
                                                        <p class="m-0">Peformance</p>
                                                        <p class="m-0"><strong>65.2%</strong></p>
                                                    </div>
                                                    <div class="col-auto"><i class="fas fa-rocket fa-2x"></i></div>
                                                </div>
                                                <p class="text-white-50 small m-0"><i class="fas fa-arrow-up"></i>&nbsp;5% since last month</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="card shadow mb-4">
                                            <div class="card-header d-flex justify-content-between align-items-center">
                                                <h6 class="fs-4 fw-bold m-0">Games</h6>
                                            </div>
                                            <div class="card-body">
                                                {(() => {
                                                    if (this.state.games != undefined && this.state.games.length > 0) {
                                                        return (
                                                        this.state.games.map((game, index) => {
                                                            console.log(game);
                                                            return (
                                                                <GameRow gameID={game.gameID} />
                                                            )
                                                        }));
                                                    }
                                                    else {
                                                        return (<p class="away">No games? Lame.</p>);
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
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Profile;