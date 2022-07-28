import React from "react";
//import '../assets/stylesheets/static.css';
import StaticNavbar from '../components/StaticNavbar';

function FAQ() {
    return (
        <div className='static-body static-html'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
          <StaticNavbar page="faq" />
          <div id="loginPane">
            <p className="fs-1 fw-bold" style={{textAlign: 'center'}}>FAQ</p>
            <div className="container-fluid static-container-fluid py-5">
              <p style={{ fontSize: '18px'}}>Here are just a couple of frequently asked questions in regards to the service:</p>
              <p style={{ fontSize: '18px'}}>&nbsp; &nbsp;1.&nbsp; How do we connect players?<br />We connect players based off of similar rank/level with varying roles in game. We use a Discord bot to match players on our official Discord server.</p>
              <p style={{ fontSize: '18px'}}>&nbsp; &nbsp;2. Do I need a SquadUP account?<br />Nope! SquadUp uses Discord to authenticate you. All that is needed is a Discord account.</p>
              <p style={{ fontSize: '18px'}}>&nbsp; &nbsp;3. What if I find someone toxic?<br />If you ever encounter anyone toxic when queueing you are able to block that specific player.</p>
              {false && (<p style={{ fontSize: '18px'}}>&nbsp; &nbsp;4. What if I want to play with the same person at a later date?<br />You are able to add other users as friends and you will be able to queue with them in the future.</p>)}
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/static.js"></script>
        </div>
      );
}

export default FAQ;