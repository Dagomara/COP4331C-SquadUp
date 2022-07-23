import React from "react";
//import '../assets/stylesheets/static.css';
import StaticNavbar from '../components/StaticNavbar';

function About() {
    return (
        <div className='static-body static-html'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
          <StaticNavbar page="about" />
          <div id="loginPane">
            <p className="fs-1 fw-bold" style={{textAlign: 'center'}}>About</p>
            <div className="container-fluid static-container-fluid py-5">
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>The SquadUp service is all about queueing up with other players of similar skill level to you with one click of a button. With that click of a button you are able to not only play but also chat with the person(s) you have queued up with via Discord. SquadUp is all about bringing gamers together.</p>
            </div>
          </div>
        </div>
      );
}

export default About;