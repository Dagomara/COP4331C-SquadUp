import React from "react";
import './assets/stylesheets/static.css';

function About() {
    return (
        <div>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
          <title>SquapUp_Pages</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
          {/* Start: Purple Navbar */}
          <nav className="navbar navbar-light navbar-expand-md navbar-fixed-top navigation-clean-button" style={{background: 'var(--ucf-gray)', borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, borderStyle: 'none', paddingTop: 0, paddingBottom: '10px'}}>
            <div className="container"><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div><a className="navbar-brand" href="#"><img className="img-fluid" src="assets/img/Squadup_with_text_white.png" /> </a></div>
              <div className="collapse navbar-collapse" id="navcol-1" style={{color: 'rgb(255,255,255)'}}>
                <ul className="navbar-nav">
                  <li className="nav-item"><a className="nav-link active" style={{color: 'rgba(228, 241, 254)'}} href="home.html">Home</a></li>
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)', fontWeight: 'bold'}} href="about.html">About</a></li>
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)'}} href="FAQ.html">FAQ</a></li>
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)'}} href="privacy.html">Privacy</a></li>
                </ul>
              </div>
            </div>
          </nav>{/* End: Purple Navbar */}
          {/* Start: Text Area */}
          <div id="loginPane">
            <p className="fs-1 fw-bold" style={{textAlign: 'center'}}>About</p>
            <div className="container-fluid py-5">
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>The SquadUp service is all about queueing up with other players of similar skill level to you with one click of a button. With that click of a button you are able to not only play but also chat with the person(s) you have queued up with via Discord. SquadUp is all about bringing gamers together.</p>
            </div>
          </div>{/* End: Text Area */}
        </div>
      );
}

export default About;