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
              <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '17px'}}>Traditional matchmaking sucks.</p>
              <h4 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '17px'}}>Join today and SquadUP with real friends.</h4><button className="btn btn-static btn-primary w-100" type="button" onClick={(e) => {e.preventDefault(); window.location.href=redirectUrl;}} style={{fontSize: '17px'}}><i className="fab fa-discord" />&nbsp;Log in through Discord</button>
            </div>

            <div className="container-fluid static-container-fluid py-5 mt-5">
              <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '17px'}}>
                Made with love by Michael Miller, Elias Cousino, Leo Alepuz, Reece Segui, Cesar Hernandez, and Alex Zommer. For COP4331c, Summer 2022.
              </p>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/static.js"></script>
        </div>
      );
    }

export default Home;