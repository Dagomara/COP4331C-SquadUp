import React from "react";
import './assets/stylesheets/static.css';

function FAQ() {
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
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)'}} href="about.html">About</a></li>
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)', fontWeight: 'bold'}} href="FAQ.html">FAQ</a></li>
                  <li className="nav-item"><a className="nav-link" style={{color: 'rgba(228, 241, 254)'}} href="privacy.html">Privacy</a></li>
                </ul>
              </div>
            </div>
          </nav>{/* End: Purple Navbar */}
          {/* Start: Text Area */}
          <div id="loginPane">
            <p className="fs-1 fw-bold" style={{textAlign: 'center'}}>FAQ</p>
            <div className="container-fluid py-5">
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>Here are just a couple of frequently asked questions in regards to the service:</p>
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>&nbsp; &nbsp;1.&nbsp; How do we connect players?<br />We connect players based off of similar rank/level with varying roles in game. We use a discord bot to match each player together onto the same discord server.</p>
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>&nbsp; &nbsp;2. Do I need an account?<br />No! SquadUp uses Discord as a sign in. All that is needed is a Discord account.</p>
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>&nbsp; &nbsp;3. What if I find someone toxic?<br />If you ever encounter anyone toxic when queueing you are able to block that specific player.</p>
              <p style={{color: 'rgb(0,0,0)', fontSize: '18px'}}>&nbsp; &nbsp;4. What if I want to play with the same person at a later date?<br />You are able to add other users as friends and be able to queue with them in the future.</p>
            </div>
          </div>{/* End: Text Area */}
        </div>
      );
}

export default FAQ;