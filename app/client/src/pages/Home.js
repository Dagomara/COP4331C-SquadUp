import React from 'react';
import { redirectUrl } from  '../components/LoginButton';
import '../assets/stylesheets/static.css';
import StaticNavbar from '../components/StaticNavbar';


const Home = () => {
    return (
        <div className='static-body static-html'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
          <StaticNavbar page="home" />
          <div id="loginPane" className="p-5 mb-4 round-3">
            <p />
            <div className="container-fluid static-container-fluid py-5">
              <p style={{color: 'rgb(0,0,0)', textAlign: 'center', fontWeight: 'bold', fontSize: '17px'}}>Traditional matchmaking sucks.</p>
              <p style={{color: 'rgb(0,0,0)', textAlign: 'center', fontWeight: 'bold', fontSize: '17px'}}>Join today and SquadUp with real friends</p><button className="btn btn-primary w-100" type="button" onClick={(e) => {e.preventDefault(); window.location.href=redirectUrl;}} style={{fontSize: '17px'}}><i className="fab fa-discord" />&nbsp;Log in through Discord</button>
            </div>
          </div>
        </div>
      );
    }

export default Home;