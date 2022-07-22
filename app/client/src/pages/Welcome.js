import React from 'react';
import axios from "axios";
import WelcomeForm from '../components/WelcomeForm';
//import TestForm from '../components/TestForm';
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
      await axios.get(`${serverRoot}/auth/getUserData`, {withCredentials: true})
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
          await axios.post(`${serverRoot}/api/viewProfile`, {discordID: this.state.discordId})
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
      await axios.get(`${serverRoot}/auth/logout`, {withCredentials: true})
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
        <div className='splash' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          <div className="container" id="splashContainer">
              <div className="card shadow-lg o-hidden border-0 my-5">
                  <div className="card-body p-0 scroll-fit">
                    <WelcomeForm username={this.state.username} avatarURL={this.state.avatarURL} tag={this.state.tag} discID={this.state.discordId}/>
                  </div>
              </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Welcome;
