import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from "axios";
const port = require("../config.json").PORT;

//axios.method('url', data(if needed), {withCredentials: true})

class Queue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined
        }
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount() {
      axios.get(`http://localhost:${port}/auth/getUserData`, {withCredentials: true}).then(res=>{
        console.log("res" + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`
          });
        }
        else {
          window.location.href = "/";
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    render() {
      return (
        <div className='Queue'>
            <p>queue screen</p>
            <strong>
              Hey {this.state.username}, welcome to Queue!
            </strong>
            <img src={this.state.avatarURL}></img>
        </div>
      );
    }
}

export default Queue;