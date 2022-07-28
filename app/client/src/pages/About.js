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
              <p style={{ fontSize: '18px'}}>The SquadUp service surrounds queuing up with other players of similar skill level to you with one click of a button. You can chat with those you have queued up with via the Discord channel our app automatically makes!</p>
              <h4 className="text-center mt-5"><strong className>SquadUp is all about bringing gamers together.</strong></h4>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/static.js"></script>
        </div>
      );
}

export default About;